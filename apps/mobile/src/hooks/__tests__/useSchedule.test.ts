import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "./testUtils";
import { useSchedule } from "../useSchedule";
import { clearCache } from "../../data/cache";

const mockSchedule = {
  schedule: [
    {
      id: "schedule-1",
      title: "Jazz Ensemble",
      startsAt: "2020-01-01T10:00:00.000Z",
      endsAt: "2020-01-01T12:00:00.000Z",
      location: "A-101",
      campusId: "cologne"
    }
  ]
};

describe("useSchedule", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSchedule
    }));
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads schedule", async () => {
    const { getResult, flush, unmount } = renderHook(useSchedule);

    expect(getResult().loading).toBe(true);
    await flush();

    expect(getResult().loading).toBe(false);
    expect(getResult().data?.schedule.length).toBe(1);
    unmount();
  });
});
