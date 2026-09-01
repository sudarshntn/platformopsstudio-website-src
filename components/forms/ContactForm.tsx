"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
  consent: "Privacy consent",
};

export function ContactForm() {
  const t0Ref = useRef<number>(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [submitAttempted, setSubmitAttempted] = useState(false);

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

  // Fields with an active error, in DOM order. Used to render an error
  // summary above the form after a failed submit — clicking a summary
  // link jumps focus straight to the offending input.
  const errorList = useMemo(() => {
    const order: Array<keyof typeof FIELD_LABELS> = [
      "name",
      "email",
      "phone",
      "message",
      "consent",
    ];
    return order
      .filter((k) => errors[k])
      .map((k) => ({
        field: k,
        label: FIELD_LABELS[k] ?? k,
        message: String(errors[k]?.message ?? ""),
        targetId: `c-${k}`,
      }));
  }, [errors]);

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
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        setSubmitAttempted(true);
        // Focus the error summary so screen readers announce it and
        // sighted keyboard users can tab to the offending field link.
        setTimeout(() => summaryRef.current?.focus(), 50);
      })}
      noValidate
      className="space-y-5"
    >
      {submitAttempted && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="c-error-summary-title"
          className="border-danger/40 bg-danger/10 text-danger rounded-lg border p-4"
        >
          <p id="c-error-summary-title" className="font-sans text-sm font-semibold">
            {errorList.length === 1
              ? "There is 1 problem with this form"
              : `There are ${errorList.length} problems with this form`}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            {errorList.map((e) => (
              <li key={e.field}>
                <a
                  href={`#${e.targetId}`}
                  className="underline underline-offset-4"
                  onClick={(evt) => {
                    evt.preventDefault();
                    const el = document.getElementById(e.targetId);
                    if (el) {
                      (el as HTMLInputElement | HTMLTextAreaElement).focus();
                      el.scrollIntoView({ block: "center", behavior: "smooth" });
                    }
                  }}
                >
                  {e.label}: {e.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
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
