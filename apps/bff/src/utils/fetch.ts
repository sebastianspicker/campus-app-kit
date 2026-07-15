import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest, type ClientRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest, type RequestOptions } from "node:https";
import { BlockList, isIP } from "node:net";

import { assertSuccessfulResponse, MAX_RESPONSE_BYTES } from "./fetchResponse";

export class TimeoutError extends Error {
  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`);
    this.name = "TimeoutError";
  }
}

const MAX_REDIRECTS = 3;

type LookupResult = { address: string; family: number };
type Lookup = (hostname: string, options: { all: true; verbatim: true }) => Promise<LookupResult[]>;
type Request = (url: URL, options: RequestOptions, callback: (response: IncomingMessage) => void) => ClientRequest;
type ResolvedPublicUrl = { parsed: URL; hostname: string; addresses: LookupResult[] };

export interface FetchTextDependencies {
  lookup?: Lookup;
  httpRequest?: Request;
  httpsRequest?: Request;
}

export interface FetchTextOptions {
  signal?: AbortSignal;
}

function createBlockedAddressList(): BlockList {
  const addresses = new BlockList();
  addresses.addSubnet("0.0.0.0", 8, "ipv4");
  addresses.addSubnet("10.0.0.0", 8, "ipv4");
  addresses.addSubnet("100.64.0.0", 10, "ipv4");
  addresses.addSubnet("127.0.0.0", 8, "ipv4");
  addresses.addSubnet("169.254.0.0", 16, "ipv4");
  addresses.addSubnet("172.16.0.0", 12, "ipv4");
  addresses.addSubnet("192.0.0.0", 24, "ipv4");
  addresses.addSubnet("192.0.2.0", 24, "ipv4");
  addresses.addSubnet("192.88.99.0", 24, "ipv4");
  addresses.addSubnet("192.168.0.0", 16, "ipv4");
  addresses.addSubnet("198.18.0.0", 15, "ipv4");
  addresses.addSubnet("198.51.100.0", 24, "ipv4");
  addresses.addSubnet("203.0.113.0", 24, "ipv4");
  addresses.addSubnet("224.0.0.0", 4, "ipv4");
  addresses.addSubnet("240.0.0.0", 4, "ipv4");
  addresses.addSubnet("2001::", 32, "ipv6");
  addresses.addSubnet("2001:2::", 48, "ipv6");
  addresses.addSubnet("2001:db8::", 32, "ipv6");
  addresses.addSubnet("2002::", 16, "ipv6");
  return addresses;
}

function createPublicIpv6AddressList(): BlockList {
  const addresses = new BlockList();
  addresses.addSubnet("2000::", 3, "ipv6");
  return addresses;
}

const blockedAddresses = createBlockedAddressList();
const publicIpv6Addresses = createPublicIpv6AddressList();

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replaceAll("[", "").replaceAll("]", "");
}

function isDisallowedAddress(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  const family = isIP(host);
  if (host === "localhost") return true;
  if (family === 4) return blockedAddresses.check(host, "ipv4");
  if (family === 6) {
    return !publicIpv6Addresses.check(host, "ipv6") || blockedAddresses.check(host, "ipv6");
  }
  return false;
}

function isValidPublicResult(result: LookupResult): boolean {
  const family = isIP(normalizeHostname(result.address));
  return family !== 0 && family === result.family && !isDisallowedAddress(result.address);
}

async function resolvePublicUrl(url: string, lookup: Lookup, signal: AbortSignal): Promise<ResolvedPublicUrl> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid fetch URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Fetch URL must use http or https");
  if (parsed.username || parsed.password) throw new Error("Fetch URL must not include credentials");
  const hostname = normalizeHostname(parsed.hostname);
  if (isDisallowedAddress(hostname)) throw new Error("Fetch URL must target a public host");

  let addresses: LookupResult[];
  try {
    addresses = await abortable(lookup(hostname, { all: true, verbatim: true }), signal);
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error("Fetch URL host could not be resolved");
  }
  if (addresses.length === 0 || !addresses.every(isValidPublicResult)) {
    throw new Error("Fetch URL must target a public host");
  }
  return { parsed, hostname, addresses };
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function redirectTarget(response: IncomingMessage, currentUrl: URL, redirects: number): string | null {
  if (!REDIRECT_STATUSES.has(response.statusCode ?? 0)) return null;
  try {
    if (redirects >= MAX_REDIRECTS) throw new Error(`Fetch URL exceeded ${MAX_REDIRECTS} redirects`);
    const rawLocation = response.headers.location;
    const location = Array.isArray(rawLocation) ? rawLocation[0] : rawLocation;
    if (!location) throw new Error("Redirect response missing Location header");
    return new URL(location, currentUrl).toString();
  } finally {
    response.destroy();
  }
}

function readResponse(response: IncomingMessage, request: ClientRequest, signal: AbortSignal): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let total = 0;
    const chunks: Buffer[] = [];
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      if (error) reject(error);
      else resolve(Buffer.concat(chunks, total).toString("utf8"));
    };
    const onAbort = () => {
      const error = abortError();
      request.destroy(error);
      response.destroy(error);
      finish(error);
    };
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) {
      onAbort();
      return;
    }
    response.on("data", (chunk: Buffer | Uint8Array | string) => {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (buffer.byteLength > MAX_RESPONSE_BYTES || total + buffer.byteLength > MAX_RESPONSE_BYTES) {
        const error = new Error(`Response body exceeds ${MAX_RESPONSE_BYTES} bytes`);
        response.destroy(error);
        finish(error);
        return;
      }
      total += buffer.byteLength;
      chunks.push(buffer);
    });
    response.once("end", () => finish());
    response.once("error", (error: Error) => finish(error));
  });
}

function requestText(
  parsed: URL,
  hostname: string,
  address: LookupResult,
  request: Request,
  signal: AbortSignal
): Promise<{ request: ClientRequest; response: IncomingMessage }> {
  return new Promise<{ request: ClientRequest; response: IncomingMessage }>((resolve, reject) => {
    let clientRequest: ClientRequest | undefined;
    let response: IncomingMessage | undefined;
    let settled = false;
    const finish = (error?: Error, value?: IncomingMessage) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      if (error) reject(error);
      else resolve({ request: clientRequest!, response: value! });
    };
    const onAbort = () => {
      const error = abortError();
      clientRequest?.destroy(error);
      response?.destroy(error);
      finish(error);
    };
    try {
      clientRequest = request(parsed, {
        agent: false,
        family: address.family,
        headers: { Accept: "text/plain, text/html, */*", "Accept-Encoding": "identity", Host: parsed.host },
        hostname,
        lookup: pinnedLookup(hostname, address),
        method: "GET",
        path: `${parsed.pathname}${parsed.search}`,
        port: parsed.port || undefined,
        rejectUnauthorized: true,
        servername: isIP(hostname) === 0 ? hostname : undefined
      }, (incoming) => {
        response = incoming;
        if (settled) {
          incoming.destroy(abortError());
          return;
        }
        finish(undefined, incoming);
      });
      clientRequest.once("error", (error: Error) => finish(error));
      signal.addEventListener("abort", onAbort, { once: true });
      if (signal.aborted) onAbort();
      else clientRequest.end();
    } catch (error) {
      finish(error instanceof Error ? error : new Error("HTTP request failed"));
    }
  });
}

async function requestFirstReachableAddress(
  parsed: URL,
  hostname: string,
  addresses: LookupResult[],
  request: Request,
  signal: AbortSignal
): Promise<{ request: ClientRequest; response: IncomingMessage }> {
  let lastError: unknown;
  for (const address of addresses) {
    throwIfAborted(signal);
    try {
      return await requestText(parsed, hostname, address, request, signal);
    } catch (error: unknown) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("HTTP request failed for every resolved address");
}

function pinnedLookup(expectedHostname: string, address: LookupResult): RequestOptions["lookup"] {
  return (hostname, _options, callback) => {
    if (normalizeHostname(hostname) !== expectedHostname) {
      const error = Object.assign(new Error("Unexpected lookup hostname"), { code: "ENOTFOUND" });
      callback(error, "", 0);
      return;
    }
    callback(null, address.address, address.family);
  };
}

function abortError(): DOMException {
  return new DOMException("The operation was aborted", "AbortError");
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw abortError();
}

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(abortError());
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(abortError());
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => { signal.removeEventListener("abort", onAbort); resolve(value); },
      (error: unknown) => { signal.removeEventListener("abort", onAbort); reject(error); }
    );
  });
}

export function createFetchTextWithTimeout(dependencies: FetchTextDependencies = {}) {
  const lookup: Lookup = dependencies.lookup ?? dnsLookup as Lookup;
  const http = dependencies.httpRequest ?? httpRequest as Request;
  const https = dependencies.httpsRequest ?? httpsRequest as Request;

  return async function fetchTextWithTimeout(url: string, options?: FetchTextOptions, timeoutMs = 10_000): Promise<string> {
    const deadline = new AbortController();
    const signal = options?.signal ? AbortSignal.any([deadline.signal, options.signal]) : deadline.signal;
    const timer = setTimeout(() => deadline.abort(), timeoutMs);
    try {
      let target = url;
      for (let redirects = 0; ; redirects += 1) {
        throwIfAborted(signal);
        const { parsed, hostname, addresses } = await resolvePublicUrl(target, lookup, signal);
        const { request, response } = await requestFirstReachableAddress(
          parsed,
          hostname,
          addresses,
          parsed.protocol === "https:" ? https : http,
          signal
        );
        const nextTarget = redirectTarget(response, parsed, redirects);
        if (nextTarget) {
          target = nextTarget;
          continue;
        }
        assertSuccessfulResponse(response);
        return await readResponse(response, request, signal);
      }
    } catch (error) {
      if (deadline.signal.aborted) throw new TimeoutError(url, timeoutMs);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };
}

export const fetchTextWithTimeout = createFetchTextWithTimeout();
