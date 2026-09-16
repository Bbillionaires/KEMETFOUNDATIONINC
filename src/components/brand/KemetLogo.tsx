import type { SVGProps } from "react";

/**
 * PLACEHOLDER BRAND ASSET
 * ------------------------------------------------------------------
 * The organization's official logo SVG has not yet been supplied to this
 * build. This component is a stand-in winged-sun-disk mark rendered in the
 * brand palette so the site is fully navigable and on-brand in the
 * meantime.
 *
 * To install the real logo: replace the markup below with the official
 * SVG's contents, keeping the same four named groups so the homepage intro
 * animation (see components/brand/LogoIntro.tsx) continues to work:
 *   - id="kemet-sundisk"    the winged sun disk / central emblem
 *   - id="kemet-wing-left"  the left wing
 *   - id="kemet-wing-right" the right wing
 *   - id="kemet-wordmark"   the "KEMET / FOUNDATION / INC" text lockup
 * Do not otherwise redesign, recolor, or simplify the official artwork.
 * ------------------------------------------------------------------
 */

type KemetLogoProps = SVGProps<SVGSVGElement> & {
  /** Render only the winged emblem, without the wordmark lockup. */
  emblemOnly?: boolean;
  /** Render only the wordmark lockup, without the emblem. */
  wordmarkOnly?: boolean;
  title?: string;
};

export function KemetLogo({
  emblemOnly = false,
  wordmarkOnly = false,
  title = "Kemet Foundation Inc",
  ...props
}: KemetLogoProps) {
  return (
    <svg
      viewBox="0 0 480 220"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>

      {!wordmarkOnly && (
        <g id="kemet-emblem">
          <g id="kemet-wing-left">
            <path
              d="M240 62
                 C 205 40, 150 34, 96 46
                 C 60 54, 30 66, 8 78
                 C 42 82, 78 84, 108 92
                 C 140 100, 168 104, 196 100
                 C 214 97, 228 88, 240 78 Z"
              fill="#0b3d2e"
              stroke="#c9a13b"
              strokeWidth="2"
            />
            <path
              d="M196 100 C 168 104, 140 100, 108 92 C 78 84, 42 82, 8 78 C 34 88, 62 96, 92 102 C 122 108, 152 110, 178 106 Z"
              fill="#a11d1d"
              opacity="0.85"
            />
            <path
              d="M108 92 C 78 84, 42 82, 8 78"
              fill="none"
              stroke="#e3c877"
              strokeWidth="1.5"
              opacity="0.8"
            />
          </g>

          <g id="kemet-wing-right">
            <path
              d="M240 62
                 C 275 40, 330 34, 384 46
                 C 420 54, 450 66, 472 78
                 C 438 82, 402 84, 372 92
                 C 340 100, 312 104, 284 100
                 C 266 97, 252 88, 240 78 Z"
              fill="#0b3d2e"
              stroke="#c9a13b"
              strokeWidth="2"
            />
            <path
              d="M284 100 C 312 104, 340 100, 372 92 C 402 84, 438 82, 472 78 C 446 88, 418 96, 388 102 C 358 108, 328 110, 302 106 Z"
              fill="#a11d1d"
              opacity="0.85"
            />
            <path
              d="M372 92 C 402 84, 438 82, 472 78"
              fill="none"
              stroke="#e3c877"
              strokeWidth="1.5"
              opacity="0.8"
            />
          </g>

          <g id="kemet-sundisk">
            <circle cx="240" cy="58" r="30" fill="#0a0a0a" />
            <circle cx="240" cy="58" r="26" fill="url(#kemet-gold-radial)" />
            <circle cx="240" cy="58" r="26" fill="none" stroke="#0a0a0a" strokeWidth="2" />
            <path
              d="M222 92 L240 78 L258 92 L240 106 Z"
              fill="#a11d1d"
              stroke="#0a0a0a"
              strokeWidth="1.5"
            />
          </g>
        </g>
      )}

      {!emblemOnly && (
        <g id="kemet-wordmark" fill="#0a0a0a" textAnchor="middle" fontFamily="Georgia, 'Playfair Display', serif">
          <text x="240" y="150" fontSize="34" fontWeight="700" letterSpacing="6">
            KEMET
          </text>
          <text
            x="240"
            y="176"
            fontSize="15"
            fontWeight="500"
            letterSpacing="7"
            fill="#0b3d2e"
          >
            FOUNDATION
          </text>
          <text x="240" y="196" fontSize="11" fontWeight="500" letterSpacing="8" fill="#a11d1d">
            INC
          </text>
        </g>
      )}

      <defs>
        <radialGradient id="kemet-gold-radial" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f0d78c" />
          <stop offset="55%" stopColor="#c9a13b" />
          <stop offset="100%" stopColor="#9c7a26" />
        </radialGradient>
      </defs>
    </svg>
  );
}
