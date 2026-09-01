import { describe, expect, it } from "vitest";
import { ContactSchema } from "@/lib/contact-schema";

describe("ContactSchema", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "This is a long enough message to satisfy the minimum length rule.",
    consent: true,
    website: "",
    t0: Date.now() - 5_000,
  };

  it("accepts a well-formed payload", () => {
    const result = ContactSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = ContactSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "email")).toBe(true);
    }
  });

  it("rejects a short message", () => {
    const result = ContactSchema.safeParse({ ...base, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects missing consent", () => {
    const result = ContactSchema.safeParse({ ...base, consent: false });
    expect(result.success).toBe(false);
  });
});
