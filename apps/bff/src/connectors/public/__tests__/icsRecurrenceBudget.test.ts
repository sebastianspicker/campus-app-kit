import { describe, expect, it } from "vitest";
import { parseIcs } from "../icsParser";

describe("ICS recurrence budgets", () => {
  it("uses the retained output cap when preflighting recurrence work", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:boundary-daily
SUMMARY:Boundary daily event
DTSTART:19990417T000000Z
RRULE:FREQ=DAILY
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics, {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      maxTotalEvents: 1
    })).toMatchObject([{
      startsAt: "2026-07-14T00:00:00.000Z",
      isRecurring: true
    }]);
  });

  it("falls back promptly for a long-running hourly rule beyond the work budget", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:long-running-hourly
SUMMARY:Unsupported hourly series
DTSTART:20100101T000000Z
RRULE:FREQ=HOURLY
END:VEVENT
END:VCALENDAR`;
    const startedAt = performance.now();
    const events = parseIcs(ics, {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleMaxInstances: 3
    });

    expect(performance.now() - startedAt).toBeLessThan(250);
    expect(events).toHaveLength(1);
    expect(events[0].isRecurring).toBeUndefined();
  });

  it("allocates the document recurrence budget independently of VEVENT source order", () => {
    const event = (id: string) => `BEGIN:VEVENT
UID:${id}
SUMMARY:Daily office hour ${id}
DTSTART:20050101T000000Z
RRULE:FREQ=DAILY
END:VEVENT`;
    const ids = ["a", "b", "c", "d", "e", "f", "g"];
    const calendar = (orderedIds: string[]) => `BEGIN:VCALENDAR
${orderedIds.map(event).join("\n")}
END:VCALENDAR`;
    const options = {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleMaxInstances: 1
    };

    const forward = parseIcs(calendar(ids), options);
    const reversed = parseIcs(calendar([...ids].reverse()), options);

    expect(reversed).toEqual(forward);
    expect(forward.every((entry) => entry.isRecurring === undefined)).toBe(true);
  });

  it("does not let structurally invalid RRULE VEVENTs poison recurrence shares", () => {
    const good = `BEGIN:VEVENT
UID:good-daily
SUMMARY:Good daily
DTSTART:20100101T000000Z
RRULE:FREQ=DAILY
END:VEVENT`;
    const invalid = (index: number) => `BEGIN:VEVENT
UID:invalid-${index}
RRULE:FREQ=DAILY
END:VEVENT`;
    const invalidEvents = Array.from({ length: 10 }, (_unused, index) => invalid(index));
    const calendar = (events: string[]) => `BEGIN:VCALENDAR
${events.join("\n")}
END:VCALENDAR`;
    const options = {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleMaxInstances: 1,
      maxTotalEvents: 1
    };

    for (const events of [[good, ...invalidEvents], [...invalidEvents, good]]) {
      expect(parseIcs(calendar(events), options)).toMatchObject([{
        id: expect.any(String),
        startsAt: "2026-07-14T00:00:00.000Z",
        isRecurring: true
      }]);
    }
  });

  it.each([
    ["a malformed rule", "NOT_A_RULE"],
    ["an excessive high-frequency rule", "FREQ=SECONDLY;COUNT=1000000"],
    [
      "a combinatorial BY-rule",
      "FREQ=YEARLY;COUNT=3;BYMONTH=1,2,3,4,5,6,7,8,9,10,11,12;BYMONTHDAY=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28;BYHOUR=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23"
    ]
  ])("does not let %s dilute valid recurrence work", (_description, poisonRule) => {
    const valid = `BEGIN:VEVENT
UID:valid-daily
SUMMARY:Valid daily
DTSTART:20100101T000000Z
RRULE:FREQ=DAILY
END:VEVENT`;
    const poison = (index: number) => `BEGIN:VEVENT
UID:poison-${index}
SUMMARY:Poison ${index}
DTSTART:20000101T000000Z
RRULE:${poisonRule}
END:VEVENT`;
    const poisonEvents = Array.from({ length: 10 }, (_unused, index) => poison(index));
    const calendar = (events: string[]) => `BEGIN:VCALENDAR
${events.join("\n")}
END:VCALENDAR`;
    const options = {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleMaxInstances: 1,
      maxTotalEvents: 1
    };

    for (const events of [[valid, ...poisonEvents], [...poisonEvents, valid]]) {
      expect(parseIcs(calendar(events), options)).toMatchObject([{
        startsAt: "2026-07-14T00:00:00.000Z",
        isRecurring: true
      }]);
    }
  });
});
