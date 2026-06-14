import { WhatsAppIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-brand-cream shadow-lg transition-transform hover:scale-105 focus-visible:outline-offset-4 active:scale-95 sm:bottom-6 sm:right-6"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
