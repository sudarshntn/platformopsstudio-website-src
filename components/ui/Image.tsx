import NextImage, { type ImageProps as NextImageProps, type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type Aspect = "square" | "4/3" | "3/2" | "16/9" | "21/9";
type Radius = "none" | "sm" | "md" | "lg" | "xl";

type ImageBaseProps = {
  readonly src: string | StaticImageData;
  readonly alt: string;
  readonly aspect?: Aspect;
  readonly radius?: Radius;
  readonly className?: string;
};

type FillProps = ImageBaseProps & {
  readonly fill: true;
  readonly sizes: string;
  readonly width?: never;
  readonly height?: never;
  readonly priority?: boolean;
};

type FixedProps = ImageBaseProps & {
  readonly fill?: false;
  readonly width: number;
  readonly height: number;
  readonly sizes?: string;
  readonly priority?: boolean;
};

export type ImageProps = FillProps | FixedProps;

const aspectClass: Record<Aspect, string> = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
};

const radiusClass: Record<Radius, string> = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

/**
 * Thin wrapper over `next/image` that:
 *   • Requires `alt` (enforced by TS).
 *   • Supports two modes:
 *       - `fill: true` — image is absolutely-positioned to fill its
 *         parent's container. Aspect and radius are applied to a wrapping
 *         div. Requires `sizes` for `srcSet` correctness.
 *       - `fill: false` (default) — natural width/height, standard flow.
 *   • Maps `aspect` and `radius` props to token utilities so pages don't
 *     reach for arbitrary tailwind classes.
 *
 * Pages should still use `next/image` directly when they need fine-grained
 * options this primitive doesn't expose (blur placeholders, custom loaders,
 * priority-fetch on non-hero images). This wrapper covers the 90% case.
 */
export function Image(props: ImageProps) {
  const { src, alt, aspect, radius = "none", className } = props;

  // Fill mode — wrap in an aspect-locked container.
  if (props.fill === true) {
    const wrapperClasses = cn(
      "relative overflow-hidden",
      aspect ? aspectClass[aspect] : "",
      radiusClass[radius],
      className
    );

    const imageProps: NextImageProps = {
      src,
      alt,
      fill: true,
      sizes: props.sizes,
      className: "object-cover",
      ...(props.priority !== undefined ? { priority: props.priority } : {}),
    };

    return (
      <div className={wrapperClasses}>
        <NextImage {...imageProps} />
      </div>
    );
  }

  // Fixed mode — natural width/height.
  const imageProps: NextImageProps = {
    src,
    alt,
    width: props.width,
    height: props.height,
    className: cn(radiusClass[radius], aspect ? aspectClass[aspect] : "", className),
    ...(props.sizes !== undefined ? { sizes: props.sizes } : {}),
    ...(props.priority !== undefined ? { priority: props.priority } : {}),
  };

  return <NextImage {...imageProps} />;
}
