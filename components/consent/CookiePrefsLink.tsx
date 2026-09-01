"use client";

/**
 * Footer link that re-opens the cookie banner. Isolated in its own
 * client component so the Footer itself stays a server component.
 * The banner listens for the `manage-cookies` window event and
 * re-mounts the dialog.
 */
export function CookiePrefsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("manage-cookies"))}
      className="text-text duration-fast hover:text-primary text-left text-sm transition-colors"
    >
      Cookie preferences
    </button>
  );
}
