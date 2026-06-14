import { Cormorant_Garamond, Great_Vibes, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ConditionalShell } from "@/components/layout/ConditionalShell";
import { defaultSiteMetadata } from "@/lib/seo";
import "./globals.css";

const fontDisplay = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontSerif = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontSans = Source_Sans_3({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = defaultSiteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSerif.variable} ${fontSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <AuthProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </AuthProvider>
      </body>
    </html>
  );
}
