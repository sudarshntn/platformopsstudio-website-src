/**
 * Videos section copy and the launch lineup.
 *
 * Source: the PlatformOps_Studio_Content_Catalog workbook (Drive), which
 * holds a 24-video catalog plus a "Channel Launch Plan" tab. The five
 * entries below are the first five in that tab's *recommended launch
 * order*, which deliberately differs from catalog row order — e.g. the
 * ArgoCD video is catalog #3 but ships second because of search volume.
 * Episode numbers here are launch position, not catalog row.
 *
 * Each `teaser` is the catalog's "The Hook (first 15s promise)" column
 * verbatim — it is already written as a promise to the viewer, so it
 * reads correctly as teaser copy without a rewrite.
 *
 * Nothing is published yet (the channel's RSS feed returns zero
 * entries), so every card renders in its coming-soon state. When an
 * episode goes live, set `youtubeId` — the card already branches on it.
 */

export const videosCopy = {
  eyebrow: "Videos",
  heading: "Platform Engineering, On Screen",
  tagline: "Platforms developers love — and security teams trust.",
  intro:
    "Build secure, developer-friendly internal platforms — every episode ships a forkable, production-grade blueprint with security baked in from day one. The channel launches shortly; these are the first five episodes.",
  statusBadge: "Coming soon",
  banner: {
    src: "/assets/img/banners/banner-videos-coming-soon.svg",
    alt: "PlatformOpsStudio videos — releasing soon.",
  },
  channelUrl: "https://www.youtube.com/@PlatformOpsStudio",
  lineupHeading: "First five episodes",
  lineupIntro:
    "Every build episode ships with a repo you can fork and a diagram before a single line of YAML.",
  subscribe: {
    heading: "Get the first episode when it drops",
    body: "Subscribe on YouTube and the opening walkthrough shows up in your feed. No upload schedule noise — just the episodes.",
    cta: "Subscribe on YouTube",
  },
  meanwhile: {
    heading: "In the meantime",
    body: "Several of these topics are already written up in long form.",
    links: [
      { label: "Read the blog", href: "/blogs" },
      { label: "Browse The Platform Pulse", href: "/newsletter" },
    ],
  },
} as const;

export type PlannedVideo = {
  readonly slug: string;
  /** Launch position, per the catalog's Channel Launch Plan tab. */
  readonly episode: number;
  readonly title: string;
  /** The catalog's "first 15s promise" — used verbatim as teaser copy. */
  readonly teaser: string;
  /** Content pillar label (P1-P5 in the catalog). */
  readonly pillar: string;
  readonly format: "Build" | "Explainer" | "Comparison";
  readonly level: "Beginner" | "Intermediate" | "Senior";
  readonly runtime: string;
  /** Core stack from the catalog, used as card tags. */
  readonly tags: readonly string[];
  /** Set once the episode is live — flips the card out of its placeholder state. */
  readonly youtubeId?: string;
  /** Only set where a genuinely matching long-form piece already exists. */
  readonly companion?: { readonly label: string; readonly href: string };
};

export const plannedVideos: readonly PlannedVideo[] = [
  {
    slug: "what-is-an-internal-developer-platform",
    episode: 1,
    title: "What is an Internal Developer Platform? (And why 2026 needs one)",
    teaser:
      "In 8 minutes you'll understand exactly what an IDP is, the 5 layers it needs, and see one running.",
    pillar: "Build the Platform",
    format: "Explainer",
    level: "Beginner",
    runtime: "8–10 min",
    tags: ["Backstage", "ArgoCD", "Crossplane"],
  },
  {
    slug: "argocd-gitops-zero-to-auto-sync",
    episode: 2,
    title: "GitOps in one video: ArgoCD from zero to auto-sync",
    teaser:
      "You'll deploy an app, push a git change, and watch ArgoCD sync it live — plus how rollbacks work.",
    pillar: "Build the Platform",
    format: "Build",
    level: "Intermediate",
    runtime: "16–22 min",
    tags: ["ArgoCD", "Kubernetes", "Helm", "Git"],
    companion: {
      label: "Read the walkthrough",
      href: "/blogs/mastering-gitops-argocd-deployment-patterns",
    },
  },
  {
    slug: "build-a-developer-portal-with-backstage",
    episode: 3,
    title: "Build a Developer Portal with Backstage from scratch",
    teaser:
      "By the end you'll have a working Backstage portal with a service catalog and a golden-path template — repo included.",
    pillar: "Build the Platform",
    format: "Build",
    level: "Intermediate",
    runtime: "18–25 min",
    tags: ["Backstage", "Node", "Docker", "GitHub"],
    companion: {
      label: "Read the edition",
      href: "/newsletter/edition-11-golden-paths-developers-actually-use",
    },
  },
  {
    slug: "policy-as-code-with-kyverno",
    episode: 4,
    title: "Policy as Code with Kyverno: guardrails without saying no",
    teaser:
      "You'll block insecure deployments automatically and give devs instant, friendly feedback.",
    pillar: "Secure the Platform",
    format: "Build",
    level: "Intermediate",
    runtime: "16–22 min",
    tags: ["Kyverno", "Kubernetes", "OPA"],
    companion: {
      label: "Read the edition",
      href: "/newsletter/edition-12-policy-as-code-opa-kyverno-cedar",
    },
  },
  {
    slug: "github-actions-to-production",
    episode: 5,
    title: "GitHub Actions to production: the pipeline I actually use",
    teaser:
      "You'll build a full test-build-scan-sign-deploy pipeline and I'll defend every stage choice.",
    pillar: "Ship It",
    format: "Build",
    level: "Intermediate",
    runtime: "20–26 min",
    tags: ["GitHubActions", "Docker", "ArgoCD"],
  },
];
