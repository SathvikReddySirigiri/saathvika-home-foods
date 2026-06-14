import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/server";

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in?next=/account");
  }

  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-serif text-2xl font-semibold text-brand-green sm:text-3xl">
        My Profile
      </h1>
      <p className="mt-2 font-sans text-sm text-brand-green/70">
        Your account details for faster checkout.
      </p>

      <dl className="mt-8 space-y-4 rounded-2xl border border-brand-gold/25 bg-white/60 p-5">
        <div>
          <dt className="font-sans text-xs font-medium uppercase tracking-wide text-brand-green/55">
            Name
          </dt>
          <dd className="mt-1 font-sans text-brand-green">
            {profile?.name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="font-sans text-xs font-medium uppercase tracking-wide text-brand-green/55">
            Email
          </dt>
          <dd className="mt-1 font-sans text-brand-green">
            {profile?.email ?? user.email ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="font-sans text-xs font-medium uppercase tracking-wide text-brand-green/55">
            Phone
          </dt>
          <dd className="mt-1 font-sans text-brand-green">
            {profile?.phone ?? "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/account/orders"
          className="font-sans text-sm text-brand-gold hover:underline"
        >
          View my orders →
        </Link>
        <Link
          href="/shop"
          className="font-sans text-sm text-brand-green/70 hover:text-brand-gold"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
