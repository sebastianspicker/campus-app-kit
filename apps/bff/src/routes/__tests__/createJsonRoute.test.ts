import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import institution from "../../__fixtures__/institution.public.json";
import { TimeoutError } from "../../utils/fetch";
import { createJsonRoute } from "../createJsonRoute";

function createResponse(): ServerResponse & { getHeader: (name: string) => string | undefined; getStatus: () => number } {
  const headers: Record<string, string> = {};
  let status = 200;
  const response = {
    headersSent: false,
    writableEnded: false,
    setHeader(name: string, value: string) { headers[name.toLowerCase()] = value; return response; },
    writeHead(code: number) { status = code; return response; },
    end() { return response; },
    getHeader: (name: string) => headers[name.toLowerCase()],
    getStatus: () => status
  };
  return response as unknown as ServerResponse & { getHeader: (name: string) => string | undefined; getStatus: () => number };
}

describe("createJsonRoute", () => {
  it("uses the ingress request ID on route errors", async () => {
    const handler = createJsonRoute(async () => {
      throw new Error("connector failed");
    }, z.object({}));
    const response = createResponse();

    await handler({ headers: {} } as IncomingMessage, response, institution, "ingress-request-id");

    expect(response.getStatus()).toBe(500);
    expect(response.getHeader("x-request-id")).toBe("ingress-request-id");
  });

  it("maps connector TimeoutError failures to the timeout response", async () => {
    const handler = createJsonRoute(async () => {
      throw new TimeoutError("https://public.example", 1000);
    }, z.object({}));
    const response = createResponse();

    await handler({ headers: {} } as IncomingMessage, response, institution, "timeout-request-id");

    expect(response.getStatus()).toBe(504);
  });
});
