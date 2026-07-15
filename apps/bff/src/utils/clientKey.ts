import type { IncomingMessage } from "node:http";
import { resolveForwardedClientKey } from "./forwardedClientIdentity";
import type { ClientKeyOptions } from "./forwardedClientIdentity";

export type TrustProxyMode = "never" | "always" | "trusted";

/** Resolves a rate-limit key from an explicit trusted-proxy chain. */
export function getClientKey(req: IncomingMessage, options?: ClientKeyOptions): string {
  return resolveForwardedClientKey(req, options ?? {});
}
