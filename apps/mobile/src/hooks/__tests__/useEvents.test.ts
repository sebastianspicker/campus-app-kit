import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "./testUtils";
import { useEvents } from "../useEvents";
import { clearCache } from "../../data/cache";

const mockEvents = {
  events: [
    {
      id: "event-1",
      title: "Public Event",
      date: "2020-01-01T00:00:00.000Z",
      sourceUrl: "https://example.org/events"
    }
  ]
};

describe("useEvents", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockEvents
    }));
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads events", async () => {
    const { getResult, flush, unmount } = renderHook(useEvents);

    expect(getResult().loading).toBe(true);
    await flush();

    expect(getResult().loading).toBe(false);
    expect(getResult().data?.events.length).toBe(1);
    unmount();
  });
});
