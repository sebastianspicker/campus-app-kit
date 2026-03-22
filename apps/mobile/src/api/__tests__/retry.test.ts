import { describe, expect, it, vi } from "vitest";
import { withRetry } from "../retry";

describe("withRetry", () => {
  it("returns on first success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withRetry(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure and succeeds", async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new TypeError("network"))
      .mockResolvedValueOnce("recovered");

    const result = await withRetry(fn, { retries: 2, baseDelayMs: 1 });
    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries", async () => {
    const fn = vi.fn().mockRejectedValue(new TypeError("network error"));

    await expect(withRetry(fn, { retries: 1, baseDelayMs: 1 })).rejects.toThrow("network error");
    expect(fn).toHaveBeenCalledTimes(2); // 1 initial + 1 retry
  });

  it("does not retry AbortError", async () => {
    const err = new Error("aborted");
    (err as { name: string }).name = "AbortError";
    const fn = vi.fn().mockRejectedValue(err);

    await expect(withRetry(fn, { retries: 3 })).rejects.toThrow("aborted");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry 4xx errors except 429", async () => {
    const err = new Error("not found");
    (err as { status?: number }).status = 404;
    const fn = vi.fn().mockRejectedValue(err);

    await expect(withRetry(fn, { retries: 3 })).rejects.toThrow("not found");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on 429", async () => {
    const err429 = new Error("rate limited");
    (err429 as { status?: number }).status = 429;
    const fn = vi.fn()
      .mockRejectedValueOnce(err429)
      .mockResolvedValueOnce("ok");

    const result = await withRetry(fn, { retries: 2, baseDelayMs: 1 });
    expect(result).toBe("ok");
  });

  it("retries on 5xx errors", async () => {
    const err500 = new Error("server error");
    (err500 as { status?: number }).status = 500;
    const fn = vi.fn()
      .mockRejectedValueOnce(err500)
      .mockResolvedValueOnce("recovered");

    const result = await withRetry(fn, { retries: 2, baseDelayMs: 1 });
    expect(result).toBe("recovered");
  });
});
