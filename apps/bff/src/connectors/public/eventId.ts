// Placeholder: Stable event id generation
// TODO:
// - Hash {sourceUrl, title, date} deterministically
// - Avoid collisions, keep IDs stable across runs
// - Use WebCrypto in case of future API routes port

export function buildEventId(_input: {
  sourceUrl: string;
  title: string;
  date: string;
}): string {
  throw new Error("TODO: buildEventId implementieren");
}
