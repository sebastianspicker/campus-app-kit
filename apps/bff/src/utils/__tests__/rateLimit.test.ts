import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkRateLimit,
  clearRateLimitBuckets,
  getRateLimitSize
} from "../rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    clearRateLimitBuckets();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearRateLimitBuckets();
  });

  it("evicts expired buckets during periodic cleanup", () => {
    checkRateLimit("client-1", { limit: 1, windowMs: 1000 });
    expect(getRateLimitSize()).toBe(1);

    vi.setSystemTime(61_000);
    checkRateLimit("client-2", { limit: 1, windowMs: 1000 });

    expect(getRateLimitSize()).toBe(1);
  });

  it("keeps active buckets when cleanup runs", () => {
    checkRateLimit("client-1", { limit: 2, windowMs: 120_000 });

    vi.setSystemTime(61_000);
    checkRateLimit("client-1", { limit: 2, windowMs: 120_000 });

    expect(getRateLimitSize()).toBe(1);
  });
});
