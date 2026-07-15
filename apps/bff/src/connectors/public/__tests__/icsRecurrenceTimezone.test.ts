import { describe, expect, it } from "vitest";
import { parseIcs } from "../icsParser";

const referenceDate = new Date("2026-03-26T00:00:00.000Z");

function calendar(body: string): string {
  return `BEGIN:VCALENDAR\nBEGIN:VEVENT\n${body}\nEND:VEVENT\nEND:VCALENDAR`;
}

describe("ICS recurrence timezone handling", () => {
  it("preserves a Berlin wall time and duration across spring daylight saving", () => {
    const events = parseIcs(calendar([
      "UID:berlin-spring-series",
      "SUMMARY:Berlin Afternoon Class",
      "DTSTART;TZID=Europe/Berlin:20260327T140000",
      "DTEND;TZID=Europe/Berlin:20260327T150000",
      "RRULE:FREQ=DAILY;COUNT=5"
    ].join("\n")), { referenceDate });
    expect(events.map((event) => event.startsAt)).toEqual([
      "2026-03-27T13:00:00.000Z", "2026-03-28T13:00:00.000Z", "2026-03-29T12:00:00.000Z",
      "2026-03-30T12:00:00.000Z", "2026-03-31T12:00:00.000Z"
    ]);
    expect(events.map((event) => event.endsAt)).toContain("2026-03-29T13:00:00.000Z");
  });

  it("preserves a Berlin wall time across autumn daylight saving", () => {
    const events = parseIcs(calendar("UID:berlin-autumn\nSUMMARY:Class\nDTSTART;TZID=Europe/Berlin:20261023T140000\nRRULE:FREQ=DAILY;COUNT=5"), {
      referenceDate: new Date("2026-10-22T00:00:00.000Z")
    });
    expect(events.map((event) => event.startsAt)).toEqual([
      "2026-10-23T12:00:00.000Z", "2026-10-24T12:00:00.000Z", "2026-10-25T13:00:00.000Z",
      "2026-10-26T13:00:00.000Z", "2026-10-27T13:00:00.000Z"
    ]);
  });

  it.each(["EXDATE;TZID=Europe/Berlin:20260329T140000", "EXDATE:20260329T120000Z"])("applies %s after daylight-saving", (exdate) => {
    const events = parseIcs(calendar(`UID:berlin-exdate\nSUMMARY:Class\nDTSTART;TZID=Europe/Berlin:20260327T140000\nRRULE:FREQ=DAILY;COUNT=5\n${exdate}`), { referenceDate });
    expect(events.map((event) => event.startsAt)).not.toContain("2026-03-29T12:00:00.000Z");
  });

  it.each([["20260329T120000Z", 3], ["20260329T115959Z", 2]])("makes UTC UNTIL %s inclusive", (until, expectedCount) => {
    const events = parseIcs(calendar(`UID:berlin-until\nSUMMARY:Class\nDTSTART;TZID=Europe/Berlin:20260327T140000\nRRULE:FREQ=DAILY;UNTIL=${until}`), { referenceDate });
    expect(events).toHaveLength(expectedCount);
  });

  it("normalizes case-insensitive property and parameter names without changing values", () => {
    const events = parseIcs(calendar("uid:mixed-case\nsUmMaRy:Class\ndTsTaRt;tZiD=Europe/Berlin:20260327T140000\nrRuLe:FREQ=DAILY;COUNT=3\neXdAtE;tZiD=Europe/Berlin:20260328T140000"), { referenceDate });
    expect(events.map((event) => event.startsAt)).toEqual(["2026-03-27T13:00:00.000Z", "2026-03-29T12:00:00.000Z"]);
  });

  it.each(["20260230", "20260230T100000Z", "20261301T100000+0100"])("skips invalid calendar components: %s", (value) => {
    expect(parseIcs(calendar(`UID:invalid\nSUMMARY:Invalid\nDTSTART:${value}`))).toEqual([]);
  });

  it("accepts a valid leap day", () => {
    expect(parseIcs(calendar("UID:leap\nSUMMARY:Leap\nDTSTART:20260228T100000Z"))).toHaveLength(1);
    expect(parseIcs(calendar("UID:leap\nSUMMARY:Leap\nDTSTART:20240229T100000Z"))).toHaveLength(1);
  });
});
