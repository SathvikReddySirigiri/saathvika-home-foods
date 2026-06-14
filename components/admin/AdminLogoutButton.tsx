"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-brand-gold/50 px-4 py-2 font-sans text-sm text-brand-cream transition-colors hover:bg-brand-green-light"
    >
      Log out
    </button>
  );
}
