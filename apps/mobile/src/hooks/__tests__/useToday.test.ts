import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "./testUtils";
import { useToday } from "../useToday";
import { clearCache } from "../../data/cache";

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
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockToday
    }));
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads today", async () => {
    const { getResult, flush, unmount } = renderHook(useToday);

    expect(getResult().loading).toBe(true);
    await flush();

    expect(getResult().loading).toBe(false);
    expect(getResult().data?.events.length).toBe(1);
    unmount();
  });
});
