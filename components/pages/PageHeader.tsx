import { GopuramMotif, KolamDivider } from "@/components/brand";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Subtle gopuram watermark behind title (About page) */
  showGopuramMotif?: boolean;
};

export function PageHeader({
  title,
  subtitle,
  showGopuramMotif = false,
}: PageHeaderProps) {
  return (
    <header className="on-brand-dark relative overflow-hidden bg-brand-green">
      {showGopuramMotif && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-4 opacity-[0.13]"
          aria-hidden
        >
          <GopuramMotif className="max-w-[180px] text-brand-gold sm:max-w-[220px]" />
        </div>
      )}
      <div className="relative mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl text-brand-cream sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl font-sans text-base leading-relaxed text-brand-cream/85 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      <KolamDivider className="text-brand-gold/80" />
    </header>
  );
}
