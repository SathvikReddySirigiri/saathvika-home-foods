import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { AdminLogoutButton } from "./AdminLogoutButton";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-brand-gold/30 bg-brand-green text-brand-cream">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link
              href="/admin"
              className="font-serif text-lg font-semibold text-brand-gold hover:text-brand-cream"
            >
              {CONFIG.businessName} — Admin
            </Link>
            {title && (
              <p className="mt-0.5 font-sans text-sm text-brand-cream/75">
                {title}
              </p>
            )}
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
