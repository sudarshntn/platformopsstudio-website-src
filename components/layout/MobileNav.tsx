"use client";

import { useEffect, useRef } from "react";
import { Button, Icon, VisuallyHidden } from "@/components/ui";
import { primaryNav } from "@/lib/nav";
import { NavLink } from "./NavLink";

type MobileNavProps = {
  readonly open: boolean;
  readonly onClose: () => void;
};

/**
 * Full-screen mobile nav drawer.
 *
 * Built on the native <dialog> element via .showModal() — the browser
 * handles focus trap, ESC-to-close, initial focus on the first focusable
 * child, and inert siblings automatically. No third-party focus-trap dep
 * needed.
 *
 * Body scroll lock: <dialog>.showModal() sets `overflow: hidden` on the
 * root scroll container implicitly on most browsers, but to be safe we
 * also toggle `overflow: hidden` on <html> while open — belt and braces
 * for iOS Safari.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  // Native "close" event fires on ESC, backdrop click (if wired), or
  // programmatic .close() — funnel all of them through onClose so the
  // parent's `open` state stays truthful.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-nav"
      aria-modal
      aria-label="Site navigation"
      className="bg-bg text-text m-0 h-full max-h-none w-full max-w-none backdrop:bg-black/60"
    >
      <div className="flex h-full w-full flex-col">
        {/* Drawer header */}
        <div className="border-border flex h-16 items-center justify-between border-b px-6 md:h-20">
          <span className="font-display text-lg font-bold">Menu</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="border-border text-text hover:border-primary/60 inline-flex h-10 w-10 items-center justify-center rounded-md border"
          >
            <Icon name="X" size={22} />
            <VisuallyHidden>Close navigation</VisuallyHidden>
          </button>
        </div>

        {/* Nav items */}
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-6">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  variant="drawer"
                  onNavigate={() => dialogRef.current?.close()}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer CTA */}
        <div className="border-border border-t p-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              dialogRef.current?.close();
              window.location.href = "/contact";
            }}
          >
            Learn With Me
          </Button>
        </div>
      </div>
    </dialog>
  );
}
