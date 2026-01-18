import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "./testUtils";
import { useRooms } from "../useRooms";
import { clearCache } from "../../data/cache";

const mockRooms = {
  rooms: [
    {
      id: "room-1",
      name: "Room A",
      campusId: "cologne"
    }
  ]
};

describe("useRooms", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRooms
    }));
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads rooms", async () => {
    const { getResult, flush, unmount } = renderHook(useRooms);

    expect(getResult().loading).toBe(true);
    await flush();

    expect(getResult().loading).toBe(false);
    expect(getResult().data?.rooms.length).toBe(1);
    unmount();
  });
});
