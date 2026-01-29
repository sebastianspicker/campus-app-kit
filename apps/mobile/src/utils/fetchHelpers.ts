/** Placeholder für API-Fetch-Helpers */

export type BffError = {
  code: string;
  message: string;
};

export async function fetchJsonWithTimeout<T>(
  url: string,
  init?: RequestInit,
  timeoutMs = 10_000
): Promise<T> {
  // TODO: Implementieren
  // 1. AbortController mit timeoutMs.
  // 2. Request ausführen.
  // 3. Bei `!response.ok` `parseBffError`.
  // 4. JSON parsen (ggf. Schema).
  throw new Error(
    "TODO: fetchJsonWithTimeout implementieren (Timeout, Fehler parsing, body parsing)"
  );
}

export async function parseBffError(response: Response): Promise<BffError> {
  // TODO: response.json() auf Error-Body prüfen.
  throw new Error("TODO: parseBffError implementieren");
}
