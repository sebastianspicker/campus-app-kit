import { afterEach, describe, expect, it } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequestListener } from "./server";
import { clearRateLimitBuckets } from "./utils/rateLimit";

function createRequest(authorization: string, forwardedFor?: string, remoteAddress = "203.0.113.10"): IncomingMessage {
  return {
    headers: { authorization, ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}) },
    method: "GET",
    socket: { remoteAddress },
    url: "/health"
  } as IncomingMessage;
}

function createResponse(): ServerResponse & { getStatus: () => number; getHeaders: () => Record<string, string> } {
  let status = 200;
  const headers: Record<string, string> = {};
  const response = {
    headersSent: false,
    writableEnded: false,
    setHeader(name: string, value: string) { headers[name.toLowerCase()] = value; return response; },
    writeHead(code: number) { status = code; return response; },
    end() { return response; },
    getStatus: () => status,
    getHeaders: () => headers
  };
  return response as unknown as ServerResponse & { getStatus: () => number; getHeaders: () => Record<string, string> };
}

describe("BFF listener dispatch", () => {
  const originalRequireAuth = process.env.BFF_REQUIRE_AUTH;
  const originalAuthToken = process.env.BFF_AUTH_TOKEN;

  afterEach(() => {
    clearRateLimitBuckets();
    if (originalRequireAuth === undefined) delete process.env.BFF_REQUIRE_AUTH;
    else process.env.BFF_REQUIRE_AUTH = originalRequireAuth;
    if (originalAuthToken === undefined) delete process.env.BFF_AUTH_TOKEN;
    else process.env.BFF_AUTH_TOKEN = originalAuthToken;
  });

  it("limits failed bearer attempts without denying a later valid credential", async () => {
    process.env.BFF_REQUIRE_AUTH = "true";
    process.env.BFF_AUTH_TOKEN = "expected-token";
    const listener = createRequestListener();

    for (let i = 0; i < 60; i++) {
      const response = createResponse();
      await listener(createRequest("Bearer wrong-token"), response);
      expect(response.getStatus()).toBe(401);
      expect(response.getHeaders()["x-request-id"]).toBeDefined();
    }

    const blockedFailure = createResponse();
    await listener(createRequest("Bearer wrong-token"), blockedFailure);
    expect(blockedFailure.getStatus()).toBe(429);

    const validResponse = createResponse();
    await listener(createRequest("Bearer expected-token"), validResponse);
    expect(validResponse.getStatus()).toBe(200);
  });

  it("does not let a direct private peer rotate rate-limit buckets with X-Forwarded-For", async () => {
    const listener = createRequestListener();
    for (let index = 0; index < 60; index += 1) {
      const response = createResponse();
      await listener(createRequest("", `198.51.100.${index + 1}`, "192.168.1.44"), response);
      expect(response.getStatus()).toBe(200);
    }

    const blocked = createResponse();
    await listener(createRequest("", "203.0.113.1", "192.168.1.44"), blocked);
    expect(blocked.getStatus()).toBe(429);
  });
});
