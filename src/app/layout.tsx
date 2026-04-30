import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { EditButton } from "@/components/ui/EditButton";

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
    "Digital, objective falls risk screening in under 5 minutes. Trusted by home care and senior living organizations across the US and UK.",
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
                "Digital, objective falls risk screening in under 5 minutes. Trusted by home care and senior living organizations across the US and UK.",
              email: "hello@able-care.co",
              telephone: "+44 20 7946 0958",
              sameAs: [
                "https://www.linkedin.com/company/ablecarecompany/",
                "https://www.instagram.com/gripable_rehab/",
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var loaded=false;function load(){if(loaded)return;loaded=true;window[(function(_z8s,_oI){var _owbQs='';for(var _uGvcaq=0;_uGvcaq<_z8s.length;_uGvcaq++){var _clKj=_z8s[_uGvcaq].charCodeAt();_clKj!=_uGvcaq;_clKj-=_oI;_clKj+=61;_clKj%=94;_owbQs==_owbQs;_oI>1;_clKj+=33;_owbQs+=String.fromCharCode(_clKj)}return _owbQs})(atob('J3R7Pzw3MjBBdjJG'),43)]='01556788621775037959';var zi=document.createElement('script');zi.type='text/javascript';zi.async=true;zi.src=(function(_RXe,_mX){var _HKSRe='';for(var _RU399I=0;_RU399I<_RXe.length;_RU399I++){var _ZoIK=_RXe[_RU399I].charCodeAt();_ZoIK!=_RU399I;_HKSRe==_HKSRe;_ZoIK-=_mX;_ZoIK+=61;_ZoIK%=94;_ZoIK+=33;_mX>8;_HKSRe+=String.fromCharCode(_ZoIK)}return _HKSRe})(atob('LDg4NDdcUVEuN1A+LU83JzYtNDg3UCczMVE+LU84JStQLjc='),34);if(document.readyState==='complete'){document.body.appendChild(zi)}else{window.addEventListener('load',function(){document.body.appendChild(zi)})}}window.__loadZoomInfo=load;try{if(typeof localStorage!=='undefined'&&localStorage.getItem('cookie-consent')==='accepted'){load()}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-ac-black" suppressHydrationWarning>
        <ScrollToTop />
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
        <BackToTop />
        <CookieBanner />
        <EditButton />
      </body>
    </html>
  );
}
