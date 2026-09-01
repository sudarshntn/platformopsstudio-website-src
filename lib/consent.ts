/**
 * Consent state stored in localStorage under a single key. Values are
 * "accepted", "declined", or absent (no choice made yet — banner is
 * shown). No analytics or third-party scripts are loaded today, so
 * "accepted" is a placeholder for future opt-in: if we ever add
 * analytics, the loader will gate on `getConsent() === "accepted"`.
 *
 * A `consentchange` CustomEvent is dispatched on window when the value
 * changes so any subscribed loader can react in the same tab; the
 * `storage` event handles cross-tab sync for free.
 */
export const CONSENT_KEY = "pos:cookie-consent";
export type ConsentValue = "accepted" | "declined" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<ConsentValue, null>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("consentchange", { detail: value }));
  } catch {
    // localStorage unavailable (private mode, quota) — silently no-op.
  }
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent("consentchange", { detail: null }));
  } catch {
    // no-op
  }
}
