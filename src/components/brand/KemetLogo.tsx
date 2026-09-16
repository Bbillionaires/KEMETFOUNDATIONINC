import type { ImgHTMLAttributes } from "react";

/**
 * OFFICIAL BRAND ASSET
 * ------------------------------------------------------------------
 * Renders the organization's official logo, supplied as a single raster
 * PNG (public/logo/kemet-foundation-logo.png). That source file is kept
 * byte-for-byte untouched.
 *
 * `emblemOnly` / `wordmarkOnly` render public/logo/kemet-emblem.png and
 * public/logo/kemet-wordmark.png respectively — plain rectangular crops
 * of the same source (no redrawing, recoloring, or simplification of the
 * artwork itself) so the homepage intro animation (see
 * components/brand/LogoIntro.tsx) can animate the winged emblem
 * separately from the wordmark. `object-fit: contain` is used throughout
 * so the artwork's proportions are always preserved, however the
 * consumer's className constrains the box.
 * ------------------------------------------------------------------
 */

type KemetLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  /** Render only the winged emblem, without the wordmark lockup. */
  emblemOnly?: boolean;
  /** Render only the wordmark lockup, without the emblem. */
  wordmarkOnly?: boolean;
  title?: string;
};

const SOURCES = {
  full: "/logo/kemet-foundation-logo.png",
  emblem: "/logo/kemet-emblem.png",
  wordmark: "/logo/kemet-wordmark.png",
};

export function KemetLogo({
  emblemOnly = false,
  wordmarkOnly = false,
  title = "Kemet Foundation Inc",
  style,
  ...props
}: KemetLogoProps) {
  const src = emblemOnly ? SOURCES.emblem : wordmarkOnly ? SOURCES.wordmark : SOURCES.full;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} style={{ objectFit: "contain", ...style }} {...props} />
  );
}
