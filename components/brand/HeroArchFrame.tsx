import type { ReactNode } from "react";

type HeroArchFrameProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Gentle pointed-arch framing for hero imagery only.
 * Gold stroke border; content clipped to arch shape.
 */
export function HeroArchFrame({ children, className = "" }: HeroArchFrameProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-brand-gold"
        viewBox="0 0 400 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M20 460V120Q20 40 200 40Q380 40 380 120V460"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.85"
        />
        <path
          d="M32 460V128Q32 56 200 56Q368 56 368 128V460"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.35"
        />
      </svg>
      <div
        className="relative overflow-hidden shadow-gold"
        style={{
          clipPath:
            "path('M 4% 100%, L 4% 26%, Q 50% 3%, 96% 26%, L 96% 100%, Z')",
        }}
      >
        {children}
      </div>
    </div>
  );
}
