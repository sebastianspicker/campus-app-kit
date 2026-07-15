# Deploy: BFF

## Container build

Build:

```bash
docker build -f apps/bff/Dockerfile.prod -t campus-bff:local .
```

Run:

```bash
docker run --rm -p 4000:4000 \\
  -e INSTITUTION_ID=hfmt \\
  -e BFF_PORT=4000 \\
  campus-bff:local
```

## Reverse proxies

- `BFF_TRUST_PROXY` defaults to `never`, so rate limiting uses the direct socket
  address and ignores `X-Forwarded-For`/`Forwarded`.
- Configure `BFF_TRUSTED_PROXIES` with the exact proxy IPs or CIDRs (for example,
  `127.0.0.1,10.24.0.0/16`) to enable forwarded client identities. The BFF honors
  headers only from those immediate peers and walks multi-hop chains right-to-left.
  Set `BFF_TRUST_PROXY=never` to override the allowlist and use socket addresses only.
- `BFF_TRUST_PROXY=auto` is rejected. `always` is an unsafe legacy override; use
  it only if the BFF is network-isolated behind an edge that replaces forwarded headers.
- The server accepts `x-request-id` and always returns `x-request-id` in the response headers.
