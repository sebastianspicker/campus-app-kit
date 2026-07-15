import { describe, expect, it } from "vitest";
import { parseIcs } from "../icsParser";

describe("parseIcs — adversarial edge cases", () => {
  it("returns empty array for empty string", () => {
    expect(parseIcs("")).toEqual([]);
  });

  it("returns empty array for garbage input", () => {
    expect(parseIcs("this is not an ics file at all\nrandom\nlines")).toEqual([]);
  });

  it("returns empty array for binary-like content", () => {
    expect(parseIcs("\x00\x01\x02\xFF\xFE")).toEqual([]);
  });

  it("skips events missing SUMMARY", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:no-summary
DTSTART:20260101T100000Z
END:VEVENT
END:VCALENDAR`;
    expect(parseIcs(ics)).toEqual([]);
  });

  it("skips events missing DTSTART", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:no-dtstart
SUMMARY:Missing Start
END:VEVENT
END:VCALENDAR`;
    expect(parseIcs(ics)).toEqual([]);
  });

  it("skips events with invalid date in DTSTART", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:bad-date
SUMMARY:Bad Date
DTSTART:not-a-date
END:VEVENT
END:VCALENDAR`;
    expect(parseIcs(ics)).toEqual([]);
  });

  it("handles DTSTART with TZID parameter", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:tzid-test
SUMMARY:Berlin Event
DTSTART;TZID=Europe/Berlin:20260615T140000
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].startsAt).toBe("2026-06-15T12:00:00.000Z");
  });

  it("handles DTSTART with explicit numeric offset", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:offset-test
SUMMARY:Offset Event
DTSTART:20260615T140000+0200
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].startsAt).toBe("2026-06-15T12:00:00.000Z");
  });

  it("handles DTSTART with VALUE=DATE parameter", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:value-date
SUMMARY:Date Only
DTSTART;VALUE=DATE:20260615
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].startsAt).toBe("2026-06-15T00:00:00.000Z");
  });

  it("accepts valid epoch-zero ICS timestamps", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:epoch-zero
SUMMARY:Unix Epoch
DTSTART:19700101T000000Z
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].startsAt).toBe("1970-01-01T00:00:00.000Z");
  });

  it("handles values with colons (timestamps)", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:colon-value
SUMMARY:Event: Important Meeting
DTSTART:20260101T100000Z
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Event: Important Meeting");
  });

  it("drops colon-rich descriptions that exceed the logical-value budget", () => {
    const description = `Before${":".repeat(256 * 1024)}After`;
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:colon-rich
SUMMARY:Colon rich
DTSTART:20260101T100000Z
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;
    const startedAt = performance.now();
    const events = parseIcs(ics);

    expect(performance.now() - startedAt).toBeLessThan(1000);
    expect(events).toEqual([]);
  });

  it("drops folded logical lines that exceed the scanner budget", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:folded-overflow
SUMMARY:Folded overflow
DTSTART:20260101T100000Z
DESCRIPTION:${"a".repeat(40_000)}
 ${"b".repeat(40_000)}
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics)).toEqual([]);
  });

  it("drops a property whose parameter count exceeds the bound", () => {
    const fillerParameters = Array.from({ length: 1_000 }, () => "X=a=b").join(";");
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:many-parameters
SUMMARY:Parameter bounded
DTSTART;TZID=Europe/Berlin;${fillerParameters}:20260615T140000
END:VEVENT
END:VCALENDAR`;
    const startedAt = performance.now();
    const events = parseIcs(ics);

    expect(performance.now() - startedAt).toBeLessThan(1000);
    expect(events).toEqual([]);
  });

  it("does not silently ignore a TZID beyond the parameter bound", () => {
    const fillerParameters = Array.from({ length: 64 }, () => "X=a").join(";");
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:late-tzid
SUMMARY:Late TZID
DTSTART;${fillerParameters};TZID=Europe/Berlin:20260615T140000
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics)).toEqual([]);
  });

  it("drops oversized RRULE values before library parsing", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:oversized-rule
SUMMARY:Rule bounded
DTSTART:20260101T100000Z
RRULE:${"FREQ=DAILY;".repeat(2_000)}
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics)).toEqual([]);
  });

  it("skips unknown properties before allocating retained event state", () => {
    const unknownProperties = Array.from({ length: 5_000 }, (_unused, index) => `X-UNKNOWN-${index}:a`).join("\n");
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:known-only
SUMMARY:Known
DTSTART:20260101T100000Z
${unknownProperties}
END:VEVENT
END:VCALENDAR`;
    const startedAt = performance.now();
    const events = parseIcs(ics);

    expect(performance.now() - startedAt).toBeLessThan(1000);
    expect(events.map((event) => event.id)).toEqual(["known-only"]);
  });

  it("drops a VEVENT with too many EXDATE properties rather than restoring excluded instances", () => {
    const exdates = Array.from({ length: 513 }, () => "EXDATE:20260101T100000Z").join("\n");
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:too-many-exdates
SUMMARY:Cancelled series
DTSTART:20260101T100000Z
RRULE:FREQ=DAILY;COUNT=2
${exdates}
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics, { referenceDate: new Date("2025-01-01T00:00:00.000Z") })).toEqual([]);
  });

  it("handles CRLF line endings", () => {
    const ics = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:crlf\r\nSUMMARY:CRLF Event\r\nDTSTART:20260101T100000Z\r\nEND:VEVENT\r\nEND:VCALENDAR";
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("CRLF Event");
  });

  it("handles multiple events in one calendar", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:multi-1
SUMMARY:First
DTSTART:20260102T100000Z
END:VEVENT
BEGIN:VEVENT
UID:multi-2
SUMMARY:Second
DTSTART:20260101T100000Z
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(2);
    // Should be sorted by date
    expect(events[0].title).toBe("Second");
    expect(events[1].title).toBe("First");
  });

  it("ignores non-VEVENT components", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VTODO
UID:todo-1
SUMMARY:Not an event
DTSTART:20260101T100000Z
END:VTODO
BEGIN:VEVENT
UID:real-event
SUMMARY:Real Event
DTSTART:20260101T100000Z
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Real Event");
  });

  it("strips double quotes from parameter values", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:quoted-param
SUMMARY:Quoted Param
DTSTART;TZID="America/New_York":20260615T140000
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics);
    expect(events).toHaveLength(1);
  });

  it("caps output by relevance rather than source order", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:one
SUMMARY:One
DTSTART:20260101T100000Z
END:VEVENT
BEGIN:VEVENT
UID:two
SUMMARY:Two
DTSTART:20260102T100000Z
END:VEVENT
BEGIN:VEVENT
UID:three
SUMMARY:Three
DTSTART:20260103T100000Z
END:VEVENT
END:VCALENDAR`;
    const options = {
      maxTotalEvents: 2,
      referenceDate: new Date("2026-01-01T12:00:00.000Z")
    };

    expect(parseIcs(ics, options).map((event) => event.id)).toEqual(["two", "three"]);

    const reversed = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:three
SUMMARY:Three
DTSTART:20260103T100000Z
END:VEVENT
BEGIN:VEVENT
UID:two
SUMMARY:Two
DTSTART:20260102T100000Z
END:VEVENT
BEGIN:VEVENT
UID:one
SUMMARY:One
DTSTART:20260101T100000Z
END:VEVENT
END:VCALENDAR`;
    expect(parseIcs(reversed, options).map((event) => event.id)).toEqual(["two", "three"]);
  });

  it("bounds high-frequency rules to the requested window and instance cap", () => {
    const now = new Date();
    const oneSecondAgo = new Date(now.getTime() - 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:secondly
SUMMARY:Frequent event
DTSTART:${oneSecondAgo}
RRULE:FREQ=SECONDLY
END:VEVENT
END:VCALENDAR`;

    expect(parseIcs(ics, { rruleHorizonDays: 90, rruleMaxInstances: 25 })).toHaveLength(25);
  });

  it.each([
    ["a far-past million-occurrence rule", "FREQ=SECONDLY;COUNT=1000000"],
    ["a far-past open-ended rule", "FREQ=MINUTELY"],
    ["a combinatorial BY-rule", "FREQ=YEARLY;COUNT=3;BYMONTH=1,2,3,4,5,6,7,8,9,10,11,12;BYMONTHDAY=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28;BYHOUR=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23"]
  ])("bounds recurrence work for %s", (_description, rule) => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:expensive-recurrence
SUMMARY:Unsupported expensive recurrence
DTSTART:20200101T000000Z
RRULE:${rule}
END:VEVENT
END:VCALENDAR`;
    const startedAt = performance.now();
    const events = parseIcs(ics, {
      referenceDate: new Date("2022-01-01T00:00:00.000Z"),
      rruleMaxInstances: 3
    });

    expect(performance.now() - startedAt).toBeLessThan(250);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: "expensive-recurrence",
      title: "Unsupported expensive recurrence",
      startsAt: "2020-01-01T00:00:00.000Z"
    });
    expect(events[0].isRecurring).toBeUndefined();
  });

  it("still expands a long-running open daily rule within the work budget", () => {
    const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:long-running-daily
SUMMARY:Daily office hour
DTSTART:20100101T000000Z
RRULE:FREQ=DAILY
END:VEVENT
END:VCALENDAR`;
    const events = parseIcs(ics, {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleMaxInstances: 3
    });

    expect(events.map((event) => event.startsAt)).toEqual([
      "2026-07-14T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
      "2026-07-16T00:00:00.000Z"
    ]);
    expect(events.every((event) => event.isRecurring)).toBe(true);
  });

  it("does not let an out-of-horizon rule displace an eligible recurrence", () => {
    const eligible = `BEGIN:VEVENT
UID:old-soon
SUMMARY:Eligible annual event
DTSTART:20000715T100000Z
RRULE:FREQ=YEARLY
END:VEVENT`;
    const outOfHorizon = `BEGIN:VEVENT
UID:newer-far
SUMMARY:Out-of-horizon annual event
DTSTART:20251231T100000Z
RRULE:FREQ=YEARLY
END:VEVENT`;
    const calendar = (events: string[]) => `BEGIN:VCALENDAR
${events.join("\n")}
END:VCALENDAR`;
    const options = {
      referenceDate: new Date("2026-07-14T00:00:00.000Z"),
      rruleHorizonDays: 90,
      maxTotalEvents: 1
    };

    for (const orderedEvents of [[eligible, outOfHorizon], [outOfHorizon, eligible]]) {
      expect(parseIcs(calendar(orderedEvents), options)).toMatchObject([{
        startsAt: "2026-07-15T10:00:00.000Z",
        isRecurring: true
      }]);
    }
  });

  it("keeps preparation bounded when a feed contains many non-recurring VEVENTs", () => {
    const eventCount = 20_000;
    const event = (index: number) => `BEGIN:VEVENT
UID:event-${index}
SUMMARY:Event ${index}
DTSTART:20260101T000000Z
END:VEVENT`;
    const ics = `BEGIN:VCALENDAR
${Array.from({ length: eventCount }, (_unused, index) => event(index)).join("\n")}
END:VCALENDAR`;
    const startedAt = performance.now();

    const events = parseIcs(ics, {
      maxTotalEvents: 1,
      referenceDate: new Date("2025-01-01T00:00:00.000Z")
    });

    expect(performance.now() - startedAt).toBeLessThan(1000);
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("event-0");
  });
});
