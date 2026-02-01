export type BffEnv = {
  port: number;
  institutionId: string;
  corsOrigins: string[];
};

export function getBffEnv(): BffEnv {
  return {
    port: parsePort(process.env.BFF_PORT),
    institutionId: requireNonEmpty(process.env.INSTITUTION_ID, "INSTITUTION_ID"),
    corsOrigins: parseCsv(process.env.CORS_ORIGINS)
  };
}

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
