import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/server";

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const profile = await getCurrentProfile();
  const name =
    profile?.name?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    "there";

  return (
    <AuthShell
      title={`Welcome to Saathvika Home Foods, ${name}!`}
      subtitle="Your account is ready. Browse our pickles, sweets, and snacks — everything is made fresh after you order."
    >
      <Link
        href="/shop"
        className="flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-4 py-2.5 font-sans text-sm font-semibold text-brand-green-deep transition-colors hover:bg-brand-gold/90"
      >
        Start shopping
      </Link>
    </AuthShell>
  );
}
