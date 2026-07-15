import { createHash } from "node:crypto";
import { RRule, RRuleSet, rrulestr } from "rrule";
import {
  getDateTimePartsInTimeZone,
  parseDateTimeInTimeZone
} from "../../utils/timeZone";

export type ParsedIcsEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  campusId?: string;
  description?: string;
  isRecurring?: boolean;
  recurringInstanceId?: string;
};

export type IcsDateProperty = {
  value: string;
  params: Record<string, string>;
};

export type RecurrenceWorkBudget = { remaining: number };

export type RecurrenceExpansionOptions = {
  dtStart: IcsDateProperty;
  exdates: IcsDateProperty[];
  horizonDays: number;
  maxInstances: number;
  referenceDate: Date;
  workBudget: RecurrenceWorkBudget;
};

export type RecurrencePreflightOptions = Pick<RecurrenceExpansionOptions, "dtStart" | "horizonDays" | "maxInstances" | "referenceDate">;

const RRULE_PREFIX = "RRULE:";
const EXPLICIT_BY_RULE_PART = /(?:^|;)BY[A-Z]+=/i;
const FLOATING_DATE_TIME_PATTERN = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/;
const UTC_UNTIL_PATTERN = /(?:^|;)UNTIL=[^;]+Z(?:;|$)/i;
const MAX_RRULE_WORK_PER_EVENT = 10_000;
const UNSUPPORTED_RECURRENCE = -1;
const FREQUENCY_MILLISECONDS = [
  31_536_000_000,
  2_419_200_000,
  604_800_000,
  86_400_000,
  3_600_000,
  60_000,
  1000
];

type CalendarParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function validIsoDate(dateValue: string, originalValue: string): string {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ICS date: ${originalValue}`);
  return date.toISOString();
}

function calendarPartsKey(parts: CalendarParts): string {
  return [parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second].join(":");
}

function validateDateParts(parts: CalendarParts): void {
  const candidate = utcDateFromParts(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
  const normalized: CalendarParts = {
    year: candidate.getUTCFullYear(),
    month: candidate.getUTCMonth() + 1,
    day: candidate.getUTCDate(),
    hour: candidate.getUTCHours(),
    minute: candidate.getUTCMinutes(),
    second: candidate.getUTCSeconds()
  };
  const values = [parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second];
  if (!values.every(Number.isInteger) || calendarPartsKey(normalized) !== calendarPartsKey(parts)) {
    throw new Error("Invalid calendar datetime");
  }
}

function parseAllDayIcsDate(value: string): string | undefined {
  if (!/^\d{8}$/.test(value)) return undefined;
  validateDateParts({
    year: Number(value.slice(0, 4)),
    month: Number(value.slice(4, 6)),
    day: Number(value.slice(6, 8)),
    hour: 0,
    minute: 0,
    second: 0
  });
  return validIsoDate(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00.000Z`, value);
}

function normalizeOffset(suffix: string): string {
  return suffix.includes(":") ? suffix : `${suffix.slice(0, 3)}:${suffix.slice(3)}`;
}

export function parseIcsDate(value: string, timeZone?: string): string {
  const allDayDate = parseAllDayIcsDate(value);
  if (allDayDate) return allDayDate;

  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z|[+-]\d{4}|[+-]\d{2}:\d{2})?$/);
  if (!match) throw new Error(`Invalid ICS date: ${value}`);

  const [, year, month, day, hour, minute, second = "00", suffix] = match;
  validateDateParts({
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second)
  });
  const dateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  if (suffix === "Z") return validIsoDate(`${dateTime}.000Z`, value);
  if (suffix) return validIsoDate(`${dateTime}${normalizeOffset(suffix)}`, value);
  if (timeZone) {
    return parseDateTimeInTimeZone({
      year: Number(year), month: Number(month), day: Number(day), hour: Number(hour), minute: Number(minute), second: Number(second)
    }, timeZone);
  }
  return validIsoDate(`${dateTime}.000Z`, value);
}

function utcDateFromParts(year: number, month: number, day: number, hour: number, minute: number, second: number): Date {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, 0);
  return date;
}

function floatingDateFromIcsValue(value: string): Date {
  const match = value.match(FLOATING_DATE_TIME_PATTERN);
  if (!match) throw new Error(`Invalid floating ICS date: ${value}`);
  const [, year, month, day, hour, minute, second = "00"] = match;
  return utcDateFromParts(Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second));
}

function instantToFloatingDate(instant: Date, timeZone: string): Date {
  const parts = getDateTimePartsInTimeZone(instant, timeZone);
  const floating = utcDateFromParts(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
  floating.setUTCMilliseconds(instant.getUTCMilliseconds());
  return floating;
}

function floatingDateToInstant(floating: Date, timeZone: string): Date {
  return new Date(parseDateTimeInTimeZone({
    year: floating.getUTCFullYear(), month: floating.getUTCMonth() + 1, day: floating.getUTCDate(),
    hour: floating.getUTCHours(), minute: floating.getUTCMinutes(), second: floating.getUTCSeconds()
  }, timeZone));
}

function recurrenceTimeZone(dtStart: IcsDateProperty): string | undefined {
  const timeZone = dtStart.params.TZID;
  return timeZone && FLOATING_DATE_TIME_PATTERN.test(dtStart.value) ? timeZone : undefined;
}

function cappedWork(first: number, second: number): number {
  if (first === 0 || second === 0) return 0;
  return first > MAX_RRULE_WORK_PER_EVENT / second ? MAX_RRULE_WORK_PER_EVENT + 1 : first * second;
}

function explicitByValueMultiplier(rruleValue: string): number {
  return rruleValue.replace(/^RRULE:/i, "").split(";").reduce((multiplier, part) => {
    if (!part.match(/^BY[A-Z]+=/i)) return multiplier;
    const valueCount = part.split("=", 2)[1]?.split(",").filter(Boolean).length ?? 0;
    return cappedWork(multiplier, Math.max(1, valueCount));
  }, 1);
}

function frequencyMilliseconds(frequency: number): number {
  return FREQUENCY_MILLISECONDS[frequency] ?? 1000;
}

function recurrenceStepsBetween(start: Date, end: Date, rrule: RRule): number {
  if (end <= start) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / frequencyMilliseconds(rrule.options.freq) / Math.max(1, rrule.options.interval));
}

function isSupportedCount(declaredCount: number | null): boolean {
  return (declaredCount ?? 0) <= MAX_RRULE_WORK_PER_EVENT;
}

type RecurrenceWorkInput = {
  rrule: RRule;
  rruleValue: string;
  startDate: Date;
  fromDate: Date;
  horizonDate: Date;
  maxInstances: number;
  includePast: boolean;
  budget: RecurrenceWorkBudget;
};

function futureRecurrenceWork(input: RecurrenceWorkInput, multiplier: number, declaredCount: number | null): number {
  if (EXPLICIT_BY_RULE_PART.test(input.rruleValue)) {
    return cappedWork(recurrenceStepsBetween(input.fromDate, input.horizonDate, input.rrule), multiplier);
  }
  return Math.min(input.maxInstances, declaredCount ?? input.maxInstances);
}

function recurrencePastLimit(includePast: boolean, declaredCount: number | null, priorWork: number): number {
  if (!includePast) return 0;
  return Math.min(declaredCount ?? priorWork + 1, MAX_RRULE_WORK_PER_EVENT);
}

function canSpendRecurrenceWork(work: number, budget: RecurrenceWorkBudget): boolean {
  return work <= Math.min(MAX_RRULE_WORK_PER_EVENT, budget.remaining);
}

function pastCandidateLimit(input: RecurrenceWorkInput): number {
  const { rrule, rruleValue, startDate, fromDate, includePast, budget } = input;
  const declaredCount = rrule.options.count;
  const multiplier = explicitByValueMultiplier(rruleValue);
  const priorWork = cappedWork(recurrenceStepsBetween(startDate, fromDate, rrule), multiplier);
  const futureWork = futureRecurrenceWork(input, multiplier, declaredCount);
  const pastLimit = recurrencePastLimit(includePast, declaredCount, priorWork);
  const estimatedWork = Math.max(1, priorWork + futureWork + pastLimit);
  if (!canSpendRecurrenceWork(estimatedWork, budget)) return UNSUPPORTED_RECURRENCE;
  budget.remaining -= estimatedWork;
  return pastLimit;
}

type ExdateParseInput = {
  properties: IcsDateProperty[];
  recurrenceZone?: string;
};

function parseExdates(input: ExdateParseInput): Date[] {
  return input.properties.flatMap((property) => property.value.split(",").flatMap((part) => {
    try {
      const instant = new Date(parseIcsDate(part.trim(), property.params.TZID ?? input.recurrenceZone));
      return input.recurrenceZone ? [instantToFloatingDate(instant, input.recurrenceZone)] : [instant];
    } catch {
      return [];
    }
  }));
}

type RuleParseInput = {
  ruleValue: string;
  startDate: Date;
  timeZone?: string;
};

function parseRule(input: RuleParseInput): RRule {
  const ruleString = input.ruleValue.startsWith(RRULE_PREFIX) ? input.ruleValue : `${RRULE_PREFIX}${input.ruleValue}`;
  const parsed = rrulestr(ruleString, { dtstart: input.startDate, tzid: null });
  if (parsed instanceof RRuleSet) throw new Error("Unsupported recurrence rule set");
  if (!input.timeZone || !parsed.options.until || !UTC_UNTIL_PATTERN.test(input.ruleValue)) return parsed;
  return new RRule({
    ...parsed.origOptions,
    dtstart: input.startDate,
    until: instantToFloatingDate(parsed.options.until, input.timeZone),
    tzid: null
  });
}

function fallback(baseEvent: ParsedIcsEvent, exdates: Date[], recurrenceStart: Date): ParsedIcsEvent[] {
  return exdates.some((exdate) => exdate.getTime() === recurrenceStart.getTime()) ? [] : [baseEvent];
}

function occurrenceSource(rule: RRule, exdates: Date[]): RRule {
  if (exdates.length === 0) return rule;
  const set = new RRuleSet();
  set.rrule(rule);
  exdates.forEach((exdate) => set.exdate(exdate));
  return set;
}

type OccurrenceWindow = {
  source: RRule;
  startDate: Date;
  referenceDate: Date;
  horizonDate: Date;
  maxInstances: number;
  includePast: boolean;
  pastLimit: number;
};

function expandOccurrences(window: OccurrenceWindow): Date[] {
  const { source, startDate, referenceDate, horizonDate, maxInstances, includePast, pastLimit } = window;
  const upcoming = startDate <= horizonDate && referenceDate <= horizonDate
    ? source.between(startDate > referenceDate ? startDate : referenceDate, horizonDate, true, (_occurrence, index) => index < maxInstances)
    : [];
  if (!includePast || upcoming.length >= maxInstances) return upcoming;
  const past = source.between(startDate, referenceDate, true, (_occurrence, index) => index < pastLimit)
    .filter((occurrence) => occurrence < referenceDate);
  return upcoming.concat(past.slice(-(maxInstances - upcoming.length)));
}

function instanceId(baseId: string, startsAt: string): string {
  // This is intentionally local to recurrence expansion: the base id remains
  // stable while every expanded occurrence gets an independently routable key.
  return createHash("sha256").update(`${baseId}|${startsAt}`).digest("hex").slice(0, 16);
}

function mapOccurrences(baseEvent: ParsedIcsEvent, occurrences: Date[], timeZone?: string): ParsedIcsEvent[] {
  const duration = baseEvent.endsAt ? Date.parse(baseEvent.endsAt) - Date.parse(baseEvent.startsAt) : 0;
  return occurrences.sort((a, b) => a.getTime() - b.getTime()).map((occurrence) => {
    const instant = timeZone ? floatingDateToInstant(occurrence, timeZone) : occurrence;
    const startsAt = instant.toISOString();
    const recurringInstanceId = instanceId(baseEvent.id, startsAt);
    return {
      ...baseEvent,
      id: recurringInstanceId,
      startsAt,
      endsAt: duration > 0 ? new Date(instant.getTime() + duration).toISOString() : baseEvent.endsAt,
      isRecurring: true,
      recurringInstanceId
    };
  });
}

type RecurrenceWindowContext = {
  timeZone?: string;
  startDate: Date;
  referenceDate: Date;
  horizonDate: Date;
};

function recurrenceWindowContext(options: RecurrencePreflightOptions): RecurrenceWindowContext {
  const timeZone = recurrenceTimeZone(options.dtStart);
  const startDate = timeZone
    ? floatingDateFromIcsValue(options.dtStart.value)
    : new Date(parseIcsDate(options.dtStart.value, options.dtStart.params.TZID));
  const horizon = new Date(options.referenceDate.getTime() + options.horizonDays * 86_400_000);
  return {
    timeZone,
    startDate,
    referenceDate: timeZone ? instantToFloatingDate(options.referenceDate, timeZone) : options.referenceDate,
    horizonDate: timeZone ? instantToFloatingDate(horizon, timeZone) : horizon
  };
}

export function isRecurrenceEligible(ruleValue: string, options: RecurrencePreflightOptions): boolean {
  if (options.maxInstances === 0) return true;
  try {
    const window = recurrenceWindowContext(options);
    const rule = parseRule({ ruleValue, startDate: window.startDate, timeZone: window.timeZone });
    if (!isSupportedCount(rule.options.count)) return false;
    const limit = pastCandidateLimit({
      rrule: rule,
      rruleValue: ruleValue,
      startDate: window.startDate,
      fromDate: window.startDate > window.referenceDate ? window.startDate : window.referenceDate,
      horizonDate: window.horizonDate,
      maxInstances: options.maxInstances,
      includePast: rule.options.count != null || rule.options.until != null,
      budget: { remaining: MAX_RRULE_WORK_PER_EVENT }
    });
    return limit !== UNSUPPORTED_RECURRENCE;
  } catch { return false; }
}

/** Expands a bounded RRULE with RFC 5545 timezone and EXDATE semantics. */
export function expandRecurringEvent(baseEvent: ParsedIcsEvent, ruleValue: string, options: RecurrenceExpansionOptions): ParsedIcsEvent[] {
  if (options.maxInstances === 0) return [];
  let startDate = new Date(baseEvent.startsAt);
  let exdates: Date[] = [];
  try {
    const window = recurrenceWindowContext(options);
    startDate = window.startDate;
    exdates = parseExdates({ properties: options.exdates, recurrenceZone: window.timeZone });
    const rule = parseRule({ ruleValue, startDate, timeZone: window.timeZone });
    if (!isSupportedCount(rule.options.count)) return fallback(baseEvent, exdates, startDate);

    const includePast = rule.options.count != null || rule.options.until != null;
    const fromDate = startDate > window.referenceDate ? startDate : window.referenceDate;
    const limit = pastCandidateLimit({
      rrule: rule,
      rruleValue: ruleValue,
      startDate,
      fromDate,
      horizonDate: window.horizonDate,
      maxInstances: options.maxInstances,
      includePast,
      budget: options.workBudget
    });
    if (limit === UNSUPPORTED_RECURRENCE) return fallback(baseEvent, exdates, startDate);
    return mapOccurrences(
      baseEvent,
      expandOccurrences({
        source: occurrenceSource(rule, exdates),
        startDate,
        referenceDate: window.referenceDate,
        horizonDate: window.horizonDate,
        maxInstances: options.maxInstances,
        includePast,
        pastLimit: limit
      }),
      window.timeZone
    );
  } catch {
    return fallback(baseEvent, exdates, startDate);
  }
}
