type GopuramMotifProps = {
  className?: string;
  /** Optional fixed width in px; height scales from viewBox ratio */
  size?: number;
};

/**
 * South Indian gopuram silhouette — decorative watermark (brand-gold @ low opacity).
 * viewBox width:height = 1:1.4
 */
export function GopuramMotif({ className = "", size }: GopuramMotifProps) {
  return (
    <svg
      viewBox="0 0 100 140"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
      className={`block h-auto shrink-0 ${size ? "" : "w-full"} ${className}`}
      style={size ? { width: size, height: "auto" } : undefined}
      aria-hidden
    >
      <g transform="scale(1 0.777777778)">
      {/* Kalasham spire */}
      <path d="M50 2 L56 16 L50 20 L44 16 Z" />
      {/* Dome below spire */}
      <path d="M38 18 Q50 12 62 18 L62 26 Q50 32 38 26 Z" />

      {/* Tier 7 */}
      <path d="M34 28 H66 L64 36 H36 Z" />
      <rect x="36" y="26" width="2" height="4" />
      <rect x="42" y="26" width="2" height="4" />
      <rect x="48" y="26" width="2" height="4" />
      <rect x="54" y="26" width="2" height="4" />
      <rect x="60" y="26" width="2" height="4" />

      {/* Tier 6 */}
      <path d="M30 36 H70 L68 46 H32 Z" />
      <rect x="32" y="34" width="2" height="4" />
      <rect x="38" y="34" width="2" height="4" />
      <rect x="44" y="34" width="2" height="4" />
      <rect x="50" y="34" width="2" height="4" />
      <rect x="56" y="34" width="2" height="4" />
      <rect x="62" y="34" width="2" height="4" />

      {/* Tier 5 */}
      <path d="M26 46 H74 L72 58 H28 Z" />
      <rect x="28" y="44" width="2" height="4" />
      <rect x="35" y="44" width="2" height="4" />
      <rect x="42" y="44" width="2" height="4" />
      <rect x="49" y="44" width="2" height="4" />
      <rect x="56" y="44" width="2" height="4" />
      <rect x="63" y="44" width="2" height="4" />
      <rect x="70" y="44" width="2" height="4" />

      {/* Tier 4 */}
      <path d="M22 58 H78 L76 72 H24 Z" />
      <rect x="24" y="56" width="2" height="4" />
      <rect x="31" y="56" width="2" height="4" />
      <rect x="38" y="56" width="2" height="4" />
      <rect x="45" y="56" width="2" height="4" />
      <rect x="52" y="56" width="2" height="4" />
      <rect x="59" y="56" width="2" height="4" />
      <rect x="66" y="56" width="2" height="4" />
      <rect x="74" y="56" width="2" height="4" />

      {/* Tier 3 */}
      <path d="M18 72 H82 L80 88 H20 Z" />
      <rect x="20" y="70" width="2" height="4" />
      <rect x="27" y="70" width="2" height="4" />
      <rect x="34" y="70" width="2" height="4" />
      <rect x="41" y="70" width="2" height="4" />
      <rect x="48" y="70" width="2" height="4" />
      <rect x="55" y="70" width="2" height="4" />
      <rect x="62" y="70" width="2" height="4" />
      <rect x="69" y="70" width="2" height="4" />
      <rect x="78" y="70" width="2" height="4" />

      {/* Tier 2 */}
      <path d="M14 88 H86 L84 106 H16 Z" />
      <rect x="16" y="86" width="2" height="4" />
      <rect x="24" y="86" width="2" height="4" />
      <rect x="32" y="86" width="2" height="4" />
      <rect x="40" y="86" width="2" height="4" />
      <rect x="48" y="86" width="2" height="4" />
      <rect x="56" y="86" width="2" height="4" />
      <rect x="64" y="86" width="2" height="4" />
      <rect x="72" y="86" width="2" height="4" />
      <rect x="82" y="86" width="2" height="4" />

      {/* Tier 1 (widest) */}
      <path d="M10 106 H90 L88 128 H12 Z" />
      <rect x="12" y="104" width="2" height="4" />
      <rect x="20" y="104" width="2" height="4" />
      <rect x="28" y="104" width="2" height="4" />
      <rect x="36" y="104" width="2" height="4" />
      <rect x="44" y="104" width="2" height="4" />
      <rect x="52" y="104" width="2" height="4" />
      <rect x="60" y="104" width="2" height="4" />
      <rect x="68" y="104" width="2" height="4" />
      <rect x="76" y="104" width="2" height="4" />
      <rect x="86" y="104" width="2" height="4" />

      {/* Base with dwara (doorway opening) */}
      <path
        fillRule="evenodd"
        d="M6 128 H94 V180 H6 Z M38 148 H62 V180 H38 Z"
      />

      {/* Flanking entrance pillars */}
      <rect x="30" y="128" width="5" height="52" />
      <rect x="65" y="128" width="5" height="52" />
      </g>
    </svg>
  );
}
