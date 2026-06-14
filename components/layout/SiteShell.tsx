import { AuthFlash } from "@/components/auth/AuthFlash";
import type { ReactNode } from "react";
import { AmbientSoundProvider } from "@/context/AmbientSoundContext";
import { CartProvider } from "@/lib/cart-context";
import {
  AmbientSoundFloatingToggle,
} from "./AmbientSoundToggle";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AmbientSoundProvider>
      <CartProvider>
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <AmbientSoundFloatingToggle />
        <WhatsAppButton />
        <AuthFlash />
      </CartProvider>
    </AmbientSoundProvider>
  );
}
