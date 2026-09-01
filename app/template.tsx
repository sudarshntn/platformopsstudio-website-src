import { PageTransition } from "@/components/motion/PageTransition";

/**
 * `template.tsx` (vs `layout.tsx`) re-mounts on every route change,
 * which gives PageTransition a fresh mount to animate `initial → animate`.
 */
export default function Template({ children }: { readonly children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
