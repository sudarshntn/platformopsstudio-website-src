/**
 * Homepage copy — every visible string on `/` lives here so a content
 * edit doesn't need to touch a component. Sections in
 * `components/sections/*` import the slice they render.
 *
 * Ported from the live static site with light editorial tightening;
 * the "Dynamic Engineering Hub" and "Authentic Learning" sections keep
 * the exact wording. Copy that reads awkwardly on the current live
 * site (the CTA-band + split-cards overlap noted in discovery.md §3.1)
 * has been consolidated into a single Subscribe section and a single
 * DualCTA — deliberate simplification for the rebuild.
 */

export const heroCopy = {
  eyebrow: "Platform Engineering · DevSecOps · AI",
  headline:
    "Empowering Your Platform Engineering & DevSecOps Journey With Insightful Content and Expert Tutorials",
  subhead:
    "Blogs, videos, and a weekly newsletter for platform teams shipping in Kubernetes, cloud-native, and agentic-AI environments.",
  primaryCta: { label: "Learn With Me", href: "/contact" },
  secondaryCta: { label: "Send Message", href: "/contact" },
} as const;

export const aboutCopy = {
  eyebrow: "About",
  heading: "Dynamic Engineering Hub in Texas",
  body: "PlatformOpsStudio is my passion project, a digital haven where I share the art and science of Platform Engineering and DevSecOps through engaging blogs, videos, and tutorials. My aim is to spark curiosity and consistently engage a global audience of practitioners.",
  emailLink: { label: "email me", href: "mailto:ramsudarsan@gmail.com" },
} as const;

export const approachCopy = {
  eyebrow: "Approach",
  heading: "Authentic Learning and Connection",
  body: "My platform thrives on authenticity and practical learning. I guide you through the intricacies of the tech world by sharing hard-won expertise. My mission is to transform complex concepts into digestible learning experiences — join me where passion meets community.",
  cta: { label: "See the Details", href: "/contact" },
} as const;

export const newsletterLatestCopy = {
  eyebrow: "The Platform Pulse",
  heading: "Latest Newsletter",
  body: "A weekly briefing on what's actually changing across Platform Engineering, DevSecOps, AI, and SRE. New issue every Monday on LinkedIn; archived here after.",
  archiveCta: { label: "Browse Full Archive", href: "/newsletter" },
  linkedInCta: {
    label: "Subscribe on LinkedIn",
    href: "https://www.linkedin.com/newsletters/the-platform-pulse-7468764234068369410/",
  },
} as const;

export const subscribeCopy = {
  heading: "Unlock Advanced Tech Knowledge Instantly",
  body: "Dive into exclusive subscription content — comprehensive tutorials, insightful videos, and virtual workshops covering the Platform Engineering and DevSecOps landscape end to end.",
  cta: { label: "Subscribe Now", href: "/contact" },
} as const;

export const dualCtaCopy = {
  contact: {
    heading: "Connect Directly With Me",
    body: "Reach out for personalized guidance or answers to your PlatformOpsStudio inquiries anytime you need.",
    cta: { label: "Contact Me Now", href: "/contact" },
  },
  read: {
    heading: "Uncover the World of PlatformOps",
    body: "Discover insights and tutorials crafted to expand your Platform Engineering and DevSecOps expertise.",
    cta: { label: "Read More Here", href: "/blogs" },
  },
} as const;
