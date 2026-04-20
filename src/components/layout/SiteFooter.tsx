import Link from "next/link";
import Image from "next/image";
import { BrandmarkWatermark } from "@/components/ui/BrandmarkWatermark";

export function SiteFooter() {
  return (
    <footer className="relative bg-ac-black text-white overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, #00FFD2, transparent 70%)",
        }}
      />

      <BrandmarkWatermark
        color="white"
        opacity={0.04}
        className="absolute bottom-[-40px] right-[-60px] w-[340px]"
      />

      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-14">
          {/* Solutions */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-ac-grey/50 mb-6">
              Solutions
            </h4>
            <ul className="space-y-4">
              <li><Link href="/solutions/able-assess" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Able Assess</Link></li>
              <li><Link href="/solutions/grip-strength" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Grip Strength</Link></li>
              <li><Link href="/solutions/functional-health" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Functional Health</Link></li>
              <li><Link href="/solutions/remote-monitoring" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Remote Monitoring</Link></li>
              <li><Link href="/product/how-it-works" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">How It Works</Link></li>
              <li><a href="https://gripable.co/" target="_blank" rel="noopener noreferrer" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Able Rehab</a></li>
            </ul>
          </div>

          {/* Segments */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-ac-grey/50 mb-6">
              Segments
            </h4>
            <ul className="space-y-4">
              <li><Link href="/home-care" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Home Care</Link></li>
              <li><Link href="/senior-living" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Senior Living</Link></li>
              <li><Link href="/skilled-nursing" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Skilled Nursing</Link></li>
              <li><Link href="/pharma" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Pharma & CROs</Link></li>
              <li><Link href="/evidence/compliance" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Compliance</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-ac-grey/50 mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Blog</Link></li>
              <li><Link href="/resources/downloads" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Downloads</Link></li>
              <li><Link href="/resources/guides" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Guides</Link></li>
              <li><Link href="/resources/evidence" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Research Library</Link></li>
              <li><Link href="/resources/case-studies" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Case Studies</Link></li>
              <li><Link href="/resources/walkthrough" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Product Walkthrough</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-ac-grey/50 mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">About</Link></li>
              <li><Link href="/meet-the-team" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Meet the Team</Link></li>
              <li><Link href="/customers" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Customers</Link></li>
              <li><Link href="/partners" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Partners</Link></li>
              <li><Link href="/careers" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-ac-grey/50 mb-6">
              Get Started
            </h4>
            <Link href="/demo">
              <button className="w-full bg-ac-blue text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-ac-aqua hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200 mb-6">
                Book a Demo
              </button>
            </Link>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:hello@able-care.co" className="block text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">
                hello@able-care.co
              </a>
              <a href="tel:+14063189624" className="block text-ac-grey/70 hover:text-ac-aqua text-sm font-light transition-colors">
                +1 406 318 9624
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/ablecarecompany/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-ac-aqua/20 flex items-center justify-center text-white hover:text-ac-aqua transition-all"
                aria-label="Able Care on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gripable_rehab/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-ac-aqua/20 flex items-center justify-center text-white hover:text-ac-aqua transition-all"
                aria-label="Able Care on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Partner / accreditation logos with APTA pledge text */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="bg-white rounded-xl p-2 h-[4.2rem] flex items-center justify-center">
                <Image
                  src="/images/apta-badge.png"
                  alt="APTA Digital Health Pledge Participant"
                  width={120}
                  height={50}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="bg-white rounded-xl p-3 h-[4.2rem] flex items-center justify-center">
                <Image
                  src="/images/partner-badge.png"
                  alt="Partner accreditation logo"
                  width={100}
                  height={38}
                  className="h-[2.4rem] w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-ac-grey/50 font-light leading-relaxed max-w-3xl">
              Able Care has signed the American Physical Therapy Association Digital Transparency pledge, illustrating our commitment to the fact that digital &ldquo;physical therapy&rdquo; services are only performed or directed by licensed physical therapists in accordance with all regulations and APTA&rsquo;s Standards of Practice for Physical Therapy.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/images/able-care-icon-white.svg"
                alt="Able Care Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-ac-grey/50 text-sm font-light">
              &copy; {new Date().getFullYear()} Able Care Ltd. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-ac-grey/50 hover:text-white text-sm font-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-ac-grey/50 hover:text-white text-sm font-light transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-ac-grey/50 hover:text-white text-sm font-light transition-colors">Cookies</Link>
            <Link href="/security" className="text-ac-grey/50 hover:text-white text-sm font-light transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
