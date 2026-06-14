type KolamDividerProps = {
  className?: string;
  /** Flip for bottom edge of a section */
  flip?: boolean;
};

const BRAND_GOLD = "#C9A227";
const GOLD_OPACITY = 0.7;

/** Simple tiered gopuram — ~24px tall, iconic silhouette only */
function GopuramSilhouetteMini() {
  return (
    <svg
      viewBox="0 0 20 24"
      className="h-6 w-5 shrink-0"
      fill={BRAND_GOLD}
      fillOpacity={GOLD_OPACITY}
      aria-hidden
    >
      <path d="M10 0.5 12.2 4.2 10 5.2 7.8 4.2Z" />
      <path d="M8.5 5 H11.5 L11 6.8 H9Z" />
      <path d="M7.5 6.8 H12.5 L12 8.8 H8Z" />
      <path d="M6.5 8.8 H13.5 L13 11.2 H7Z" />
      <path d="M5.5 11.2 H14.5 L14 14 H6Z" />
      <path d="M4.5 14 H15.5 L15 17 H5Z" />
      <path d="M3.5 17 H16.5 V22 H3.5 Z" />
    </svg>
  );
}

function GopuramSlot() {
  return (
    <div className="flex w-5 shrink-0 items-center justify-center md:w-7">
      <GopuramSilhouetteMini />
    </div>
  );
}

function KolamDiamond() {
  return (
    <svg
      viewBox="0 0 10 10"
      className="h-2.5 w-2.5 shrink-0"
      fill={BRAND_GOLD}
      fillOpacity={GOLD_OPACITY}
      aria-hidden
    >
      <path d="M5 1 8.5 5 5 9 1.5 5Z" />
    </svg>
  );
}

function GoldLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-px shrink-0 ${className}`}
      style={{ backgroundColor: BRAND_GOLD, opacity: GOLD_OPACITY }}
      aria-hidden
    />
  );
}

/** [d d] — two diamonds with a gold line between them */
function DiamondPairCluster({ lineClassName }: { lineClassName: string }) {
  return (
    <div className="flex shrink-0 items-center gap-0" aria-hidden>
      <KolamDiamond />
      <GoldLine className={lineClassName} />
      <KolamDiamond />
    </div>
  );
}

const bandRow =
  "flex h-8 w-full flex-nowrap items-center justify-between";

/**
 * Temple-village section divider — gopuram silhouettes and kolam diamond pairs.
 * Symmetric row distributed with flexbox space-between (no centre flourish).
 */
export function KolamDivider({ className = "", flip = false }: KolamDividerProps) {
  return (
    <div
      className={`w-full ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      {/* Desktop: [G] [d d] [G] [d d] [G] [d d] [G] */}
      <div className={`${bandRow} hidden px-6 md:flex`}>
        <GopuramSlot />
        <DiamondPairCluster lineClassName="w-16 lg:w-20" />
        <GopuramSlot />
        <DiamondPairCluster lineClassName="w-16 lg:w-20" />
        <GopuramSlot />
        <DiamondPairCluster lineClassName="w-16 lg:w-20" />
        <GopuramSlot />
      </div>

      {/* Mobile: [G] [d d] [G] [d d] [G] */}
      <div className={`${bandRow} px-4 md:hidden`}>
        <GopuramSlot />
        <DiamondPairCluster lineClassName="w-12 min-[400px]:w-14" />
        <GopuramSlot />
        <DiamondPairCluster lineClassName="w-12 min-[400px]:w-14" />
        <GopuramSlot />
      </div>
    </div>
  );
}
