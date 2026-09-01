import type { Metadata } from "next";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  FieldError,
  Heading,
  Icon,
  Input,
  Label,
  Link,
  Section,
  Text,
  Textarea,
  VisuallyHidden,
} from "@/components/ui";
import type { ButtonSize, ButtonVariant } from "@/components/ui";

export const metadata: Metadata = {
  title: "Design system · PlatformOpsStudio",
  description:
    "Design tokens, primitives, and every variant/state. QA surface for the site rebuild.",
  robots: { index: false, follow: false },
};

const colorTokens: ReadonlyArray<{ name: string; varName: string; note?: string }> = [
  { name: "bg", varName: "--color-bg", note: "Page background" },
  { name: "surface", varName: "--color-surface", note: "Card, input, form fields" },
  { name: "surface-2", varName: "--color-surface-2", note: "Elevated surfaces" },
  { name: "border", varName: "--color-border" },
  { name: "text", varName: "--color-text", note: "Body text" },
  { name: "text-muted", varName: "--color-text-muted", note: "Secondary text" },
  { name: "primary", varName: "--color-primary", note: "CTAs, links, focus" },
  { name: "primary-fg", varName: "--color-primary-fg", note: "Text on primary fill" },
  { name: "accent", varName: "--color-accent" },
  { name: "danger", varName: "--color-danger" },
  { name: "success", varName: "--color-success" },
  { name: "focus", varName: "--color-focus" },
];

const buttonVariants: readonly ButtonVariant[] = ["primary", "ghost", "link"];
const buttonSizes: readonly ButtonSize[] = ["sm", "md", "lg"];

function ButtonMatrix() {
  return (
    <div className="space-y-6">
      {buttonSizes.map((size) => (
        <div key={size} className="space-y-2">
          <Text variant="small" as="div" className="text-muted font-mono tracking-wider uppercase">
            size: {size}
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant} default
              </Button>
            ))}
            {buttonVariants.map((variant) => (
              <Button key={`${variant}-loading`} variant={variant} size={size} isLoading>
                {variant} loading
              </Button>
            ))}
            {buttonVariants.map((variant) => (
              <Button key={`${variant}-disabled`} variant={variant} size={size} disabled>
                {variant} disabled
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * QA surface for the design system. Renders every primitive in every
 * variant/state on both surfaces so a reviewer can spot regressions
 * without opening components individually.
 *
 * Reviewer flow:
 *  1. Run `pnpm dev` and open /design.
 *  2. Tab through interactive elements to check :focus-visible rings.
 *  3. Toggle OS dark/light to check the palette swap.
 *  4. Resize to 375px to check no horizontal overflow.
 */
export default function DesignSystemPage() {
  return (
    <main>
      {/* HEADER */}
      <Section spacing="md">
        <Text
          variant="small"
          as="div"
          className="text-primary mb-2 font-mono tracking-widest uppercase"
        >
          Stage 1 · design system
        </Text>
        <Heading as="h1" level="h1">
          Design system
        </Heading>
        <Text variant="muted" className="mt-3 max-w-2xl">
          Every design token and UI primitive currently in the rebuild. Compare against
          <code className="bg-surface mx-1 rounded px-1 font-mono">docs/design-system.md</code>
          for API contracts and rationale.
        </Text>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* COLORS */}
      <Section spacing="md" ariaLabelledby="colors-heading">
        <Heading as="h2" level="h2" id="colors-heading" className="mb-6">
          Colors
        </Heading>
        <Text variant="muted" className="mb-6 max-w-2xl">
          Values swap automatically when the OS switches between dark and light appearance (via{" "}
          <code className="font-mono text-sm">prefers-color-scheme</code>). Contrast ratios are
          documented in the design-system doc.
        </Text>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Color tokens">
          {colorTokens.map((token) => (
            <li key={token.name}>
              <Card padding="sm">
                <div
                  className="border-border h-16 w-full rounded-sm border"
                  style={{ backgroundColor: `var(${token.varName})` }}
                  aria-hidden
                />
                <div className="text-text mt-3 font-mono text-sm">{token.name}</div>
                <div className="text-muted font-mono text-xs">{token.varName}</div>
                {token.note && (
                  <Text variant="small" className="text-muted mt-1">
                    {token.note}
                  </Text>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* TYPOGRAPHY */}
      <Section spacing="md" ariaLabelledby="type-heading">
        <Heading as="h2" level="h2" id="type-heading" className="mb-6">
          Typography
        </Heading>
        <div className="space-y-4">
          <Heading as="h3" level="h1">
            H1 — Display heading
          </Heading>
          <Heading as="h3" level="h2">
            H2 — Display heading
          </Heading>
          <Heading as="h3" level="h3">
            H3 — Section heading
          </Heading>
          <Heading as="h4" level="h4">
            H4 — Sub-section heading
          </Heading>
          <Heading as="h5" level="h5">
            H5 — Small heading
          </Heading>
          <Heading as="h6" level="h6">
            H6 — Micro heading
          </Heading>
          <Text>
            Body — 16px Inter, 1.6 line-height. Long enough to demonstrate wrap behavior on narrower
            viewports. Pairs with the display face above for hero copy, and reads comfortably at
            whatever width the container allows.
          </Text>
          <Text variant="small">Small — 14px. For dates, form hints, and secondary metadata.</Text>
          <Text variant="muted">
            Muted — same size as body, in <code className="font-mono">--color-text-muted</code>.
          </Text>
          <Text as="div" className="font-mono">
            Mono — JetBrains Mono, for code and technical labels. <code>const x = 42;</code>
          </Text>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* BUTTONS */}
      <Section spacing="md" ariaLabelledby="buttons-heading">
        <Heading as="h2" level="h2" id="buttons-heading" className="mb-6">
          Buttons
        </Heading>
        <Text variant="muted" className="mb-6 max-w-2xl">
          Every variant × every size × every state. Tab through to see the shared
          <code className="bg-surface mx-1 rounded px-1 font-mono">:focus-visible</code>
          ring in <code className="font-mono">--color-focus</code>.
        </Text>

        <Card padding="lg" className="mb-6">
          <Text variant="small" className="text-muted mb-4 font-mono tracking-wider uppercase">
            Surface: bg (default)
          </Text>
          <ButtonMatrix />
        </Card>

        <Card padding="lg" elevated>
          <Text variant="small" className="text-muted mb-4 font-mono tracking-wider uppercase">
            Surface: surface-2 (elevated)
          </Text>
          <ButtonMatrix />
        </Card>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* LINKS */}
      <Section spacing="md" ariaLabelledby="links-heading">
        <Heading as="h2" level="h2" id="links-heading" className="mb-6">
          Links
        </Heading>
        <div className="space-y-4">
          <Text>
            Internal: <Link href="/">Home</Link> ·{" "}
            <Link href="#colors-heading">jump to colors</Link>
          </Text>
          <Text>
            External: <Link href="https://nextjs.org">Next.js docs</Link> (gets external icon
            automatically and opens in a new tab).
          </Text>
          <Text variant="muted">
            Same visual pattern applies inline in body copy — the link primitive figures out
            internal-vs-external from the href.
          </Text>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* CARDS */}
      <Section spacing="md" ariaLabelledby="cards-heading">
        <Heading as="h2" level="h2" id="cards-heading" className="mb-6">
          Cards
        </Heading>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Heading as="h3" level="h4" className="mb-2">
              Default card
            </Heading>
            <Text variant="muted">
              Uses <code className="font-mono">--color-surface</code>. Sits flush on the page
              background.
            </Text>
          </Card>
          <Card elevated>
            <Heading as="h3" level="h4" className="mb-2">
              Elevated card
            </Heading>
            <Text variant="muted">
              Uses <code className="font-mono">--color-surface-2</code> and{" "}
              <code className="font-mono">shadow-md</code>. Use for popovers, modals, hover-lifts.
            </Text>
          </Card>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* BADGES */}
      <Section spacing="md" ariaLabelledby="badges-heading">
        <Heading as="h2" level="h2" id="badges-heading" className="mb-6">
          Badges
        </Heading>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* FORM PRIMITIVES */}
      <Section spacing="md" ariaLabelledby="form-heading">
        <Heading as="h2" level="h2" id="form-heading" className="mb-6">
          Form primitives
        </Heading>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <Heading as="h3" level="h4" className="mb-4">
              Default state
            </Heading>
            <div className="mb-4">
              <Label htmlFor="demo-name" required>
                Name
              </Label>
              <Input id="demo-name" name="name" placeholder="Ada Lovelace" required />
            </div>
            <div className="mb-4">
              <Label htmlFor="demo-email">Email</Label>
              <Input id="demo-email" name="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="mb-4">
              <Label htmlFor="demo-msg">Message</Label>
              <Textarea id="demo-msg" name="msg" placeholder="Tell me about your project…" />
            </div>
            <Checkbox id="demo-agree" name="agree">
              I agree with the Privacy &amp; Cookies Policy.
            </Checkbox>
            <div className="mt-6 flex gap-3">
              <Button variant="primary">Submit</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </Card>

          <Card>
            <Heading as="h3" level="h4" className="mb-4">
              Invalid + disabled states
            </Heading>
            <div className="mb-4">
              <Label htmlFor="demo-invalid">Email</Label>
              <Input
                id="demo-invalid"
                name="email"
                type="email"
                defaultValue="not-an-email"
                aria-invalid="true"
                aria-describedby="demo-invalid-err"
              />
              <FieldError id="demo-invalid-err">Please enter a valid email address.</FieldError>
            </div>
            <div className="mb-4">
              <Label htmlFor="demo-disabled">Locked field</Label>
              <Input id="demo-disabled" name="locked" defaultValue="Read-only value" disabled />
            </div>
            <Checkbox id="demo-disabled-check" name="check" disabled defaultChecked>
              Disabled checkbox (checked)
            </Checkbox>
          </Card>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* ICONS + VISUALLY HIDDEN */}
      <Section spacing="md" ariaLabelledby="icons-heading">
        <Heading as="h2" level="h2" id="icons-heading" className="mb-6">
          Icons
        </Heading>
        <Text variant="muted" className="mb-6 max-w-2xl">
          Wrapped from <code className="font-mono">lucide-react</code>. Decorative by default (
          <code className="font-mono">aria-hidden</code>); pass a{" "}
          <code className="font-mono">label</code> prop for semantic use.
        </Text>
        <Text variant="small" className="text-muted mb-4">
          Brand marks (GitHub, LinkedIn, X, YouTube, Facebook, Instagram) live in the footer as
          inline SVG — lucide-react dropped brand icons for trademark reasons. Below is a generic
          sample.
        </Text>
        <div className="text-text mb-6 flex flex-wrap items-center gap-4">
          <Icon name="Mail" />
          <Icon name="Send" />
          <Icon name="Rss" />
          <Icon name="Newspaper" />
          <Icon name="Bookmark" />
          <Icon name="Sparkles" />
          <Icon name="ExternalLink" />
          <Icon name="Loader2" className="animate-spin" />
          <Icon name="Check" />
          <Icon name="AlertTriangle" />
        </div>
        <div>
          <Text variant="small" className="text-muted mb-2 font-mono tracking-wider uppercase">
            Icon-only button (accessible via VisuallyHidden)
          </Text>
          <Button variant="ghost" size="sm">
            <Icon name="Menu" />
            <VisuallyHidden>Open navigation</VisuallyHidden>
          </Button>
        </div>
      </Section>

      <Divider className="mx-auto max-w-[var(--container-max)]" />

      {/* FOOTNOTE */}
      <Section spacing="sm">
        <Text variant="small" className="text-muted">
          This page is <code className="font-mono">robots: noindex, nofollow</code> — it&apos;s a QA
          surface, not marketing content. Never linked from the main nav.
        </Text>
      </Section>
    </main>
  );
}
