import { Container, Icon, Section, Text, VisuallyHidden } from "@/components/ui";

/**
 * Route-level suspense fallback. Kept intentionally minimal: a small
 * spinner and a status message, no skeleton screens — those live at the
 * page level once specific loading shapes are known (stage 3+).
 *
 * The spinner uses `Loader2` (lucide) which is already loaded elsewhere,
 * so no extra bundle cost.
 */
export default function Loading() {
  return (
    <Section spacing="lg">
      <Container>
        <div role="status" className="text-muted flex items-center gap-3">
          <Icon name="Loader2" size={20} className="animate-spin" />
          <Text variant="small" className="text-muted">
            Loading…
          </Text>
          <VisuallyHidden>Content is loading, please wait.</VisuallyHidden>
        </div>
      </Container>
    </Section>
  );
}
