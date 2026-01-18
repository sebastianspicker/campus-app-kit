export function getBffBaseUrl(): string {
  const baseUrl = process.env.MOBILE_PUBLIC_BFF_URL ?? "http://localhost:4000";
  return baseUrl.replace(/\/$/, "");
}
