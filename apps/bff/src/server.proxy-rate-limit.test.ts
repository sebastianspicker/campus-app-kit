import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createTrustedProxyMatcher } from "./utils/trustedProxy";

const matcher = createTrustedProxyMatcher(["10.24.0.0/16"]);

function request(forwardedFor: string, authorization?: string): IncomingMessage {
  return {
    headers: { "x-forwarded-for": forwardedFor, ...(authorization ? { authorization } : {}) },
    method: "GET",
    socket: { remoteAddress: "10.24.1.7" },
    url: "/health"
  } as unknown as IncomingMessage;
}

function response(): ServerResponse & { status: () => number } {
  let statusCode = 200;
  const value = {
    headersSent: false,
    writableEnded: false,
    setHeader() { return value; },
    writeHead(status: number) { statusCode = status; return value; },
    end() { return value; },
    status: () => statusCode
  };
  return value as unknown as ServerResponse & { status: () => number };
}

function chain(spoofedLeft: string, client: string): string {
  return `${spoofedLeft}, ${client}, 10.24.1.3`;
}

describe("configured proxy rate-limit composition", () => {
  let createRequestListener: typeof import("./server").createRequestListener;
  let clearRateLimitBuckets: typeof import("./utils/rateLimit").clearRateLimitBuckets;
  const originalRequireAuth = process.env.BFF_REQUIRE_AUTH;
  const originalAuthToken = process.env.BFF_AUTH_TOKEN;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("./config/env", () => ({
      BFF_ENV: {
        corsOrigins: [], defaultCacheTtl: 300, institutionId: "hfmt", port: 4000,
        rruleExpansionHorizonDays: 90, trustedProxies: ["10.24.0.0/16"],
        trustedProxyMatcher: matcher, trustProxy: "trusted" as const
      }
    }));
    ({ createRequestListener } = await import("./server"));
    ({ clearRateLimitBuckets } = await import("./utils/rateLimit"));
  });

  afterEach(() => {
    clearRateLimitBuckets();
    vi.doUnmock("./config/env");
    if (originalRequireAuth === undefined) delete process.env.BFF_REQUIRE_AUTH;
    else process.env.BFF_REQUIRE_AUTH = originalRequireAuth;
    if (originalAuthToken === undefined) delete process.env.BFF_AUTH_TOKEN;
    else process.env.BFF_AUTH_TOKEN = originalAuthToken;
  });

  it("keeps invalid-auth attempts in one resolved-client bucket despite rotating spoofed values", async () => {
    process.env.BFF_REQUIRE_AUTH = "true";
    process.env.BFF_AUTH_TOKEN = "expected";
    const listener = createRequestListener();
    for (let index = 0; index < 60; index += 1) {
      const result = response();
      await listener(request(chain(`198.51.100.${index + 1}`, "203.0.113.10"), "Bearer wrong"), result);
      expect(result.status()).toBe(401);
    }
    const blocked = response();
    await listener(request(chain("198.51.100.250", "203.0.113.10"), "Bearer wrong"), blocked);
    expect(blocked.status()).toBe(429);
  });

  it("keeps normal requests in one resolved-client bucket but separates distinct clients", async () => {
    delete process.env.BFF_REQUIRE_AUTH;
    const listener = createRequestListener();
    for (let index = 0; index < 60; index += 1) {
      const result = response();
      await listener(request(chain(`198.51.100.${index + 1}`, "203.0.113.10")), result);
      expect(result.status()).toBe(200);
    }
    const blocked = response();
    await listener(request(chain("198.51.100.250", "203.0.113.10")), blocked);
    expect(blocked.status()).toBe(429);

    const differentClient = response();
    await listener(request(chain("198.51.100.250", "203.0.113.11")), differentClient);
    expect(differentClient.status()).toBe(200);
  });
});
