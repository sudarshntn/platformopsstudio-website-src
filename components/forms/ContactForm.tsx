"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NextLink from "next/link";
import {
  Button,
  Checkbox,
  FieldError,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
} from "@/components/ui";
import { ContactSchema, type ContactPayload } from "@/lib/contact-schema";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

/**
 * Contact form: react-hook-form + zodResolver (same schema server
 * uses). Inline validation on blur; submit is disabled while invalid
 * or pending. On success, the form is replaced with a confirmation
 * panel and focus moves to that heading; on server failure, the form
 * stays intact and an aria-live region announces.
 *
 * Anti-bot: the honeypot `website` field is rendered but visually
 * hidden and marked aria-hidden; `t0` is set on mount and included
 * in every submit — the server rejects if the age is under 1.5s.
 */
export function ContactForm() {
  const t0Ref = useRef<number>(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    t0Ref.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(ContactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      // consent intentionally omitted — RHF treats as undefined and zod
      // fires the "must agree" error until the user checks the box.
      website: "",
      t0: 0,
    },
  });

  const onSubmit = async (values: ContactPayload) => {
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, t0: t0Ref.current }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (data.ok) {
        setStatus({ kind: "success" });
        reset();
        // Move focus to success heading for screen-reader users.
        setTimeout(() => successHeadingRef.current?.focus(), 50);
        return;
      }
      if (data.fieldErrors) {
        for (const [k, msg] of Object.entries(data.fieldErrors)) {
          setError(k as keyof ContactPayload, { message: msg });
        }
      }
      setStatus({
        kind: "error",
        message: data.error ?? "Something went wrong. Please try again.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  if (status.kind === "success") {
    return (
      <div className="border-success/40 bg-success/10 rounded-lg border p-6">
        <Heading
          as="h3"
          level="h4"
          className="text-success"
          {...({ ref: successHeadingRef } as unknown as { ref?: React.Ref<HTMLHeadingElement> })}
        >
          Message sent — thanks for reaching out.
        </Heading>
        <Text variant="muted" className="mt-3">
          I&apos;ll reply from ramsudarsan@gmail.com, usually within a couple of days.
        </Text>
        <Button variant="ghost" className="mt-6" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — visually hidden + aria-hidden + tab-out */}
      <div className="sr-only" aria-hidden>
        <label htmlFor="c-website">Website (leave empty)</label>
        <input
          id="c-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <Label htmlFor="c-name" required>
          Name
        </Label>
        <Input
          id="c-name"
          autoComplete="name"
          required
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? "c-name-err" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <FieldError id="c-name-err">{String(errors.name?.message ?? "")}</FieldError>
        )}
      </div>

      <div>
        <Label htmlFor="c-email" required>
          Email
        </Label>
        <Input
          id="c-email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "c-email-err" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <FieldError id="c-email-err">{String(errors.email?.message ?? "")}</FieldError>
        )}
      </div>

      <div>
        <Label htmlFor="c-phone">Phone (optional)</Label>
        <Input
          id="c-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone || undefined}
          aria-describedby={errors.phone ? "c-phone-err" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <FieldError id="c-phone-err">{String(errors.phone?.message ?? "")}</FieldError>
        )}
      </div>

      <div>
        <Label htmlFor="c-message" required>
          Message
        </Label>
        <Textarea
          id="c-message"
          required
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? "c-message-err" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <FieldError id="c-message-err">{String(errors.message?.message ?? "")}</FieldError>
        )}
      </div>

      <div>
        <Checkbox
          id="c-consent"
          aria-invalid={!!errors.consent || undefined}
          aria-describedby={errors.consent ? "c-consent-err" : undefined}
          {...register("consent")}
        >
          I agree with the{" "}
          <NextLink
            href="/privacy-policy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Privacy &amp; Cookies Policy
          </NextLink>
          .
        </Checkbox>
        {errors.consent && (
          <FieldError id="c-consent-err">{String(errors.consent?.message ?? "")}</FieldError>
        )}
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          Send Message
        </Button>
      </div>

      <div aria-live="assertive" className="min-h-[1.25rem]">
        {status.kind === "error" && (
          <Text variant="small" className="text-danger">
            {status.message}
          </Text>
        )}
      </div>
    </form>
  );
}
