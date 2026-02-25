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

  describe("error handling", () => {
    it("returns 404 for unknown path", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/unknown").expect(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatchObject({ code: "not_found" });
    });

    it("returns 405 for POST to data route", async () => {
      const app = createRequestListener();
      const res = await request(app).post("/events").expect(405);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatchObject({ code: "method_not_allowed" });
    });

    it("returns 405 for PUT to data route", async () => {
      const app = createRequestListener();
      const res = await request(app).put("/events").expect(405);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatchObject({ code: "method_not_allowed" });
    });

    it("returns 405 for DELETE to data route", async () => {
      const app = createRequestListener();
      const res = await request(app).delete("/events").expect(405);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatchObject({ code: "method_not_allowed" });
    });
  });

  describe("health endpoint", () => {
    it("returns 200 for GET /health", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toMatchObject({ status: "ok" });
    });

    it("returns version in health response", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toHaveProperty("version");
    });

    it("returns institution in health response", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toHaveProperty("institution");
    });

    it("returns uptime in health response", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toHaveProperty("uptime");
      // Uptime is returned as a formatted string
      expect(typeof res.body.uptime).toBe("string");
    });

    it("returns checks in health response", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toHaveProperty("checks");
      expect(res.body.checks).toHaveProperty("institutionPack");
      expect(res.body.checks).toHaveProperty("memory");
    });
  });

  describe("events endpoint", () => {
    it("returns 200 for GET /events when institution is loaded", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events").expect(200);
      expect(res.body).toHaveProperty("events");
      expect(Array.isArray(res.body.events)).toBe(true);
    });

    it("returns events with required fields", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events").expect(200);
      if (res.body.events.length > 0) {
        const event = res.body.events[0];
        expect(event).toHaveProperty("id");
        expect(event).toHaveProperty("title");
      }
    });

    it("supports search query parameter", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events?search=test").expect(200);
      expect(res.body).toHaveProperty("events");
      expect(Array.isArray(res.body.events)).toBe(true);
    });

    it("supports from date query parameter", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events?from=2024-01-01").expect(200);
      expect(res.body).toHaveProperty("events");
    });

    it("supports to date query parameter", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events?to=2025-12-31").expect(200);
      expect(res.body).toHaveProperty("events");
    });

    it("supports limit query parameter", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/events?limit=5").expect(200);
      expect(res.body).toHaveProperty("events");
      expect(res.body.events.length).toBeLessThanOrEqual(5);
    });

    it("supports offset query parameter", async () => {
      const app = createRequestListener();
      const res1 = await request(app).get("/events?limit=2").expect(200);
      const res2 = await request(app).get("/events?limit=2&offset=1").expect(200);
      // If there are at least 2 events, the second request should start from a different event
      if (res1.body.events.length >= 2 && res2.body.events.length >= 1) {
        // First event of second request should be second event of first request
        expect(res2.body.events[0]?.id).toBe(res1.body.events[1]?.id);
      }
    });
  });

  describe("rooms endpoint", () => {
    it("returns 200 for GET /rooms", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/rooms").expect(200);
      expect(res.body).toHaveProperty("rooms");
      expect(Array.isArray(res.body.rooms)).toBe(true);
    });
  });

  describe("today endpoint", () => {
    it("returns 200 for GET /today", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/today").expect(200);
      expect(res.body).toHaveProperty("events");
      // Schedule may not be present if no schedules configured
    });
  });

  describe("rate limiting", () => {
    it("returns 429 when rate limit exceeded", async () => {
      const app = createRequestListener();
      const limit = 65;
      for (let i = 0; i < limit; i++) {
        await request(app).get("/health");
      }
      const res = await request(app).get("/health").expect(429);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatchObject({ code: "rate_limited" });
      expect(res.headers["retry-after"]).toBeDefined();
    });

    it("includes retry-after header in rate limit response", async () => {
      const app = createRequestListener();
      const limit = 65;
      for (let i = 0; i < limit; i++) {
        await request(app).get("/health");
      }
      const res = await request(app).get("/health").expect(429);
      const retryAfter = parseInt(res.headers["retry-after"], 10);
      expect(retryAfter).toBeGreaterThan(0);
    });
  });

  describe("security headers", () => {
    it("includes X-Content-Type-Options header", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("includes X-Frame-Options header", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.headers["x-frame-options"]).toBe("DENY");
    });

    it("includes X-Request-Id header", async () => {
      const app = createRequestListener();
      const res = await request(app).get("/health").expect(200);
      expect(res.headers["x-request-id"]).toBeDefined();
    });
  });

  describe("CORS", () => {
    it("handles OPTIONS preflight request", async () => {
      const app = createRequestListener();
      await request(app)
        .options("/events")
        .set("Origin", "http://localhost:8081")
        .set("Access-Control-Request-Method", "GET")
        .expect(204);
    });
  });
});
