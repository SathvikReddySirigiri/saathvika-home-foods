import Image from "next/image";
import { SITE } from "@/lib/site";

const LOGO_PATH = "/logo.png";

type LogoProps = {
  /** Display size in CSS pixels — width/height attributes match to prevent layout shift */
  size: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size, className = "", priority = false }: LogoProps) {
  return (
    <Image
      src={LOGO_PATH}
      alt={`${SITE.name} logo`}
      width={size}
      height={size}
      className={`object-contain ${className}`.trim()}
      priority={priority}
    />
  );
}

export { LOGO_PATH };
