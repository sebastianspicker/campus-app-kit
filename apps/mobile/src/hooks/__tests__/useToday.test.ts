import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { renderHook } from "./testUtils";
import { useToday } from "../useToday";
import { clearCache } from "../../data/cache";
import { clearPersistedCache } from "../../data/persistedCache";
import { _resetBffBaseUrlMemoForTests } from "../../utils/bffConfig";
import { getCampusDate } from "../../utils/campusTime";
import { getInstitutionTimeZone } from "../../config/institution";

const mockToday = {
  events: [
    {
      id: "event-1",
      title: "Public Event",
      date: "2020-01-01T00:00:00.000Z",
      sourceUrl: "https://example.org/events"
    }
  ],
  rooms: []
};

describe("useToday", () => {
  beforeEach(async () => {
    process.env.EXPO_PUBLIC_BFF_BASE_URL = "http://localhost:4000";
    _resetBffBaseUrlMemoForTests();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(mockToday),
      headers: { get: () => null },
    }));
    clearCache();
    await clearPersistedCache();
  });

  afterEach(async () => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete process.env.EXPO_PUBLIC_BFF_BASE_URL;
    await clearPersistedCache();
  });

  it("loads today", async () => {
    const { getResult, flush, unmount } = renderHook(useToday);
    const expectedDate = getCampusDate(new Date(), getInstitutionTimeZone());

    expect(getResult().loading).toBe(true);
    await flush();

    expect(getResult().loading).toBe(false);
    expect(getResult().data?.events.length).toBe(1);
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toContain("/today");
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toContain(`date=${expectedDate}`);
    unmount();
  });

  it("keys the request to the configured institution day", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:30:00.000Z"));
    const { unmount } = renderHook(useToday);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect((fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toContain("date=2026-01-31");
    unmount();
  });
});
