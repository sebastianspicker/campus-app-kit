export type BffEnv = {
  port: number;
  institutionId: string;
  corsOrigins: string[];
  trustProxy: TrustProxyMode;
};

export function getBffEnv(): BffEnv {
  return {
    port: parsePort(process.env.BFF_PORT),
    institutionId: requireNonEmpty(process.env.INSTITUTION_ID, "INSTITUTION_ID"),
    corsOrigins: parseCsv(process.env.CORS_ORIGINS),
    trustProxy: parseTrustProxy(process.env.BFF_TRUST_PROXY)
  };
}

export type TrustProxyMode = "never" | "auto" | "always";

function parsePort(raw: string | undefined): number {
  if (!raw) return 4000;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Invalid BFF_PORT: ${raw}`);
  }
  return value;
}

function parseCsv(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function requireNonEmpty(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${name} is required`);
  }
  return trimmed;
}

function parseTrustProxy(value: string | undefined): TrustProxyMode {
  if (!value) return "auto";
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "always"].includes(normalized)) return "always";
  if (["0", "false", "no", "never"].includes(normalized)) return "never";
  if (normalized === "auto") return "auto";
  throw new Error(`Invalid BFF_TRUST_PROXY: ${value}`);
}
