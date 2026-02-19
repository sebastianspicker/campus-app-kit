import { afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createRequestListener } from "./server";
import { clearRateLimitBuckets } from "./utils/rateLimit";

describe("BFF server integration", () => {
  beforeAll(() => {
    process.env.INSTITUTION_ID = process.env.INSTITUTION_ID ?? "hfmt";
  });

  afterEach(() => {
    clearRateLimitBuckets();
  });

  it("returns 404 for unknown path", async () => {
    const app = createRequestListener();
    const res = await request(app).get("/unknown").expect(404);
    expect(res.body).toMatchObject({ code: "not_found" });
  });

  it("returns 405 for POST to data route", async () => {
    const app = createRequestListener();
    const res = await request(app).post("/events").expect(405);
    expect(res.body).toMatchObject({ code: "method_not_allowed" });
  });

  it("returns 200 for GET /health", async () => {
    const app = createRequestListener();
    const res = await request(app).get("/health").expect(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });

  it("returns 200 for GET /events when institution is loaded", async () => {
    const app = createRequestListener();
    const res = await request(app).get("/events").expect(200);
    expect(res.body).toHaveProperty("events");
    expect(Array.isArray(res.body.events)).toBe(true);
  });

  it("returns 429 when rate limit exceeded", async () => {
    const app = createRequestListener();
    const limit = 65;
    for (let i = 0; i < limit; i++) {
      await request(app).get("/health");
    }
    const res = await request(app).get("/health").expect(429);
    expect(res.body).toMatchObject({ code: "rate_limited" });
    expect(res.headers["retry-after"]).toBeDefined();
  });

  it("returns 404 for institution not found when INSTITUTION_ID unknown", async () => {
    const orig = process.env.INSTITUTION_ID;
    process.env.INSTITUTION_ID = "nonexistent-id-12345";
    const app = createRequestListener();
    const res = await request(app).get("/events").expect(404);
    expect(res.body).toMatchObject({ code: "institution_not_found" });
    process.env.INSTITUTION_ID = orig;
  });
});
