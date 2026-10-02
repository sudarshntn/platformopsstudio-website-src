/**
 * Videos section copy and the planned-episode lineup.
 *
 * The YouTube channel (UCgCGE1H5KU9AiL8Pcoc6aMg) has no published
 * videos yet, so every block here renders in a "coming soon" state.
 * When episodes go live, add `youtubeId` to the entry — the card
 * already branches on it, so a real thumbnail and watch link light up
 * without touching the page component.
 */

export const videosCopy = {
  eyebrow: "Videos",
  heading: "Platform Engineering, On Screen",
  intro:
    "Hands-on walkthroughs of the same ground the blog and newsletter cover — built live, in a real cluster, with the mistakes left in. The channel is spinning up now; the lineup below is what lands first.",
  statusBadge: "Releasing soon",
  banner: {
    src: "/assets/img/banners/banner-videos-coming-soon.svg",
    alt: "PlatformOpsStudio videos — releasing soon.",
  },
  channelUrl: "https://www.youtube.com/@PlatformOpsStudio",
  subscribe: {
    heading: "Get the first episode when it drops",
    body: "Subscribe on YouTube and the opening walkthrough shows up in your feed. No upload schedule noise — just the episodes.",
    cta: "Subscribe on YouTube",
  },
  meanwhile: {
    heading: "In the meantime",
    body: "The written versions of most of these topics are already published.",
    links: [
      { label: "Read the blog", href: "/blogs" },
      { label: "Browse The Platform Pulse", href: "/newsletter" },
    ],
  },
} as const;

export type PlannedVideo = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  /** Rough runtime so the lineup sets expectations before anything ships. */
  readonly runtime: string;
  /** Set once the episode is live — flips the card out of its placeholder state. */
  readonly youtubeId?: string;
  /** Companion long-form piece already on the site, when one exists. */
  readonly companion?: { readonly label: string; readonly href: string };
};

export const plannedVideos: readonly PlannedVideo[] = [
  {
    slug: "private-llm-platform-aks-vllm",
    title: "Building a Private LLM Platform on Azure AKS",
    description:
      "The full build: a tainted GPU node pool, the NVIDIA device plugin, Key Vault secrets, cached model weights, and vLLM serving an OpenAI-compatible endpoint that never leaves your VNet.",
    tags: ["LLMOps", "AKS", "vLLM"],
    runtime: "~35 min",
    companion: {
      label: "Read the walkthrough",
      href: "/blogs/private-llm-platform-on-azure-aks-with-vllm",
    },
  },
  {
    slug: "argo-cd-deployment-patterns",
    title: "Argo CD Deployment Patterns That Survive Scale",
    description:
      "App-of-apps, ApplicationSets, and the repo structures that stop working past fifty clusters — demonstrated against a real multi-cluster setup rather than a single kind node.",
    tags: ["GitOps", "ArgoCD", "Kubernetes"],
    runtime: "~28 min",
    companion: {
      label: "Read the walkthrough",
      href: "/blogs/mastering-gitops-argocd-deployment-patterns",
    },
  },
  {
    slug: "policy-as-code-kyverno-opa",
    title: "Policy as Code: Kyverno vs OPA, Hands On",
    description:
      "Writing the same three admission policies twice — once in Kyverno, once in Rego — then comparing what each is actually good at instead of arguing about it on a slide.",
    tags: ["PolicyAsCode", "Kyverno", "OPA"],
    runtime: "~25 min",
    companion: {
      label: "Read the edition",
      href: "/newsletter/edition-12-policy-as-code-opa-kyverno-cedar",
    },
  },
  {
    slug: "istio-ambient-mesh",
    title: "Istio Ambient Mesh Without the Sidecar Tax",
    description:
      "Standing up ambient mode from scratch, watching ztunnel handle mTLS, and measuring what the sidecar removal actually buys you in a workload that isn't a demo app.",
    tags: ["ServiceMesh", "Istio", "Kubernetes"],
    runtime: "~30 min",
    companion: {
      label: "Read the walkthrough",
      href: "/blogs/seamless-api-management-istio-ambient-with-azure-apim",
    },
  },
  {
    slug: "zero-trust-spiffe-spire",
    title: "Workload Identity with SPIFFE and SPIRE",
    description:
      "Replacing static Kubernetes secrets with attested, auto-rotating workload identity — the piece that makes zero trust real instead of a vendor slide.",
    tags: ["ZeroTrust", "SPIFFE", "DevSecOps"],
    runtime: "~32 min",
    companion: {
      label: "Read the edition",
      href: "/newsletter/edition-17-zero-trust-for-platform-teams",
    },
  },
  {
    slug: "golden-paths-backstage",
    title: "Golden Paths Developers Actually Use",
    description:
      "Building a scaffolder template end to end in Backstage, then the harder half: instrumenting adoption so you can tell whether anyone is really using it.",
    tags: ["PlatformEngineering", "Backstage", "DevEx"],
    runtime: "~27 min",
    companion: {
      label: "Read the edition",
      href: "/newsletter/edition-11-golden-paths-developers-actually-use",
    },
  },
] as const;
