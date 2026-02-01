import { createHash } from "node:crypto";

type EventIdInput = {
  sourceUrl: string;
  title: string;
  date: string;
};

export function buildEventId(input: EventIdInput): string {
  const normalized = JSON.stringify({
    sourceUrl: input.sourceUrl.trim(),
    title: input.title.trim(),
    date: input.date.trim()
  });

  const hash = createHash("sha256").update(normalized).digest("hex").slice(0, 24);
  return `evt_${hash}`;
}
