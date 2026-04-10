import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BackToTop } from "@/components/ui/BackToTop";
import { PasswordGate } from "@/components/ui/PasswordGate";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Able Care | Falls Prevention Technology",
    template: "%s | Able Care",
  },
  description:
    "Digital, objective falls risk screening in under 5 minutes. Trusted by home care, senior living and clinicians across the US and UK.",
  metadataBase: new URL("https://www.able-care.co"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Able Care",
              url: "https://www.able-care.co",
              logo: "https://www.able-care.co/images/able-care-logo.svg",
              description:
                "Digital, objective falls risk screening in under 5 minutes. Trusted by home care, senior living and clinicians across the US and UK.",
              email: "hello@able-care.co",
              telephone: "+44 20 7946 0958",
              sameAs: [
                "https://linkedin.com/company/able-care",
                "https://twitter.com/ablecarehealth",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-ac-black">
        <PasswordGate>
          <SiteHeader />
          <main className="flex-grow">{children}</main>
          <SiteFooter />
          <BackToTop />
        </PasswordGate>
      </body>
    </html>
  );
}
