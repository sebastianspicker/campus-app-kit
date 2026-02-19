export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeoutMs = 8000
): Promise<Response> {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const callerSignal = options?.signal;
  if (callerSignal != null) {
    callerSignal.addEventListener("abort", () => timeoutController.abort(), {
      once: true
    });
  }
  const signal = timeoutController.signal;

  try {
    return await fetch(url, { ...options, signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
