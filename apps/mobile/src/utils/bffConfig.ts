export function resolveBffBaseUrl(): string {
  const fromExpoPublic = process.env.EXPO_PUBLIC_BFF_BASE_URL;
  const fromLegacy = process.env.MOBILE_PUBLIC_BFF_URL;
  const fromConfig = fromExpoPublic ?? fromLegacy;

  if (fromConfig) {
    return normalizeBaseUrl(fromConfig);
  }

  const nodeEnv = process.env.NODE_ENV;
  const isDev = typeof __DEV__ === "boolean" ? __DEV__ : nodeEnv !== "production";
  if (isDev) {
    return "http://localhost:4000";
  }

  throw new Error(
    "Missing BFF base URL. Set EXPO_PUBLIC_BFF_BASE_URL for the mobile app build."
  );
}

function normalizeBaseUrl(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "");
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`Invalid BFF base URL: ${input}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Invalid BFF base URL protocol: ${url.protocol}`);
  }
  return trimmed;
}
