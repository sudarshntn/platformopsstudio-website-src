import { z } from "zod";

/**
 * Contact form schema — used identically by react-hook-form (client)
 * and the /api/contact route handler (server). One shape, two guards.
 *
 * Two anti-bot mechanisms in the schema itself:
 *   • `website` — honeypot. Must be empty string. Real browsers submit
 *     the empty default; scrapers autofill anything that looks like an
 *     address field.
 *   • `t0` — timestamp the client injects on component mount. Server
 *     rejects if the request arrives less than 1500ms later — human
 *     typing latency is orders of magnitude above that; drive-by
 *     scripts submit immediately.
 */
export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please enter a valid email").max(200),
  phone: z
    .string()
    .max(40)
    .regex(/^$|^\+?[0-9 ()\-]{6,40}$/, "Phone must be a valid international format")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(4000, "Message can be at most 4000 characters"),
  consent: z.literal(true, {
    error: "You must agree to the privacy policy",
  }),
  // Honeypot — must be empty.
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  // Client-side mount timestamp (ms epoch) — server enforces min age.
  t0: z.number().int().nonnegative(),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

/** Server-side time-trap threshold in milliseconds. */
export const MIN_FORM_AGE_MS = 1500;
