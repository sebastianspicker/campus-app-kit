import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { parsePort } from "./serve-expo-export-port.mjs";

const exportRoot = resolve(process.argv[2] ?? join(tmpdir(), "campus-app-kit-playwright-web"));
const port = parsePort(process.env.PORT);
const serverRoot = join(exportRoot, "server");
const clientRoot = join(exportRoot, "client");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
};

const clientPathPrefixes = ["/_expo/static/", "/assets/"];

function safeJoin(root, requestedPath) {
  const resolved = resolve(root, `.${normalize(requestedPath)}`);
  return resolved === root || resolved.startsWith(`${root}/`) ? resolved : null;
}

function existingFile(candidate) {
  try {
    return statSync(candidate).isFile() ? candidate : null;
  } catch {
    return null;
  }
}

function resolveFile(pathname) {
  if (clientPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const clientFile = safeJoin(clientRoot, pathname);
    return clientFile ? existingFile(clientFile) : null;
  }
  if (pathname === "/") return existingFile(join(serverRoot, "(tabs)", "index.html"));

  const direct = safeJoin(serverRoot, pathname);
  if (!direct) return null;
  const candidates = extname(direct)
    ? [direct, join(direct, "index.html")]
    : [direct, `${direct}.html`, join(direct, "index.html")];
  return candidates.map(existingFile).find(Boolean) ?? null;
}

function sendText(response, status, message) {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
}

function parsePathname(requestUrl) {
  try {
    return decodeURIComponent(new URL(requestUrl ?? "/", `http://127.0.0.1:${port}`).pathname);
  } catch {
    return null;
  }
}

function sendFile(request, response, file) {
  const headers = {
    "content-type": contentTypes[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  };
  if (request.method === "HEAD") {
    response.writeHead(200, headers);
    response.end();
    return;
  }
  const stream = createReadStream(file);
  stream.once("error", () => {
    if (!response.headersSent) sendText(response, 404, "Not found");
    else response.destroy();
  });
  stream.once("open", () => {
    response.writeHead(200, headers);
    stream.pipe(response);
  });
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("allow", "GET, HEAD");
    sendText(response, 405, "Method not allowed");
    return;
  }

  const pathname = parsePathname(request.url);
  if (!pathname) {
    sendText(response, 400, "Bad request");
    return;
  }
  const file = resolveFile(pathname);
  if (!file) {
    sendText(response, 404, "Not found");
    return;
  }
  sendFile(request, response, file);
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Expo export listening on http://127.0.0.1:${port}\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
