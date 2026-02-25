/**
 * Date formatting utilities for consistent date/time display across the app.
 */

/**
 * Format a date string for event display.
 * Shows locale-specific date and time.
 * 
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "24.02.2026, 14:30")
 */
export function formatEventDate(date: string): string {
  return new Date(date).toLocaleString();
}

/**
 * Format a time string for schedule display.
 * Shows locale-specific time only.
 * 
 * @param date - ISO date string
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatScheduleTime(date: string): string {
  return new Date(date).toLocaleTimeString();
}

/**
 * Format a date for display in headers or labels.
 * Shows locale-specific date without time.
 * 
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "24.02.2026")
 */
export function formatDateOnly(date: string): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Format a relative time (e.g., "in 2 hours", "yesterday").
 * Useful for "today" view and notifications.
 * 
 * @param date - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 1) return "now";
  if (Math.abs(diffMins) < 60) {
    return diffMins > 0 ? `in ${diffMins}m` : `${Math.abs(diffMins)}m ago`;
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
  }
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
  }
  
  return formatDateOnly(date);
}

/**
 * Check if a date is today.
 * 
 * @param date - ISO date string
 * @returns true if the date is today
 */
export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date.startsWith(today);
}

/**
 * Format a date range for display.
 * 
 * @param start - Start ISO date string
 * @param end - End ISO date string (optional)
 * @returns Formatted range string (e.g., "14:30 - 16:00")
 */
export function formatTimeRange(start: string, end?: string): string {
  const startTime = formatScheduleTime(start);
  if (!end) return startTime;
  const endTime = formatScheduleTime(end);
  return `${startTime} - ${endTime}`;
}
