/** @deprecated Prefer EXPO_PUBLIC_BFF_BASE_URL; MOBILE_PUBLIC_BFF_URL is not Expo-public and may be unavailable in bundled builds */

let memoizedBffBaseUrl: string | null = null;

export function resolveBffBaseUrl(): string {
  if (memoizedBffBaseUrl) return memoizedBffBaseUrl;

  const result = ((): string => {
    // Try various ways to get the BFF URL
    const fromConfig = process.env.EXPO_PUBLIC_BFF_BASE_URL;
    
    // For web, also check window location
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _isWeb = typeof window !== "undefined" && typeof document !== "undefined";
    
    // For development, always use localhost:4000
    // This is the safest fallback for local development
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      return "http://localhost:4000";
    }
    
    // In production, require the env var
    if (fromConfig) {
      return normalizeBaseUrl(fromConfig);
    }

    throw new Error(
      "Missing BFF base URL. Set EXPO_PUBLIC_BFF_BASE_URL for the mobile app build."
    );
  })();

  memoizedBffBaseUrl = result;
  return result;
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
