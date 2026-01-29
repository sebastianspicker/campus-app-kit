// Placeholder: BFF base URL resolution for Expo (no process.env in prod)
// TODO:
// - Read from Constants.expoConfig?.extra?.BFF_BASE_URL
// - Provide fallback for dev only (localhost)
// - Validate format and strip trailing slash

export function resolveBffBaseUrl(): string {
  throw new Error("TODO: resolveBffBaseUrl implementieren");
}
