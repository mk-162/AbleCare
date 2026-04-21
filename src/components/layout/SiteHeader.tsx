"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

/* ─── Navigation data matching Site Navigation spec ─── */

type NavItem = { label: string; href: string; desc?: string; external?: boolean };

const solutionsMenu: { platform: NavItem[]; capabilities: NavItem[] } = {
  platform: [
    { label: "Able Assess", href: "/solutions/able-assess", desc: "Best in class assessment of strength and falls risk." },
    { label: "Able Assess — Falls Prevention Application", href: "/solutions/falls-prevention", desc: "Upstream screening for early and accurate identification of risk of falling." },
    { label: "Able Assess — Grip Strength Application", href: "/solutions/grip-strength", desc: "Unlocking the fifth vital sign for application in data-driven healthcare." },
    { label: "The GripAble Sensor", href: "/solutions/sensor", desc: "One best-in-class sensor, many applications." },
  ],
  capabilities: [],
};

const segmentsMenu = {
  homeCare: [
    { label: "Home Care", href: "/home-care", desc: "Reduce client falls and protect retention across every branch." },
    { label: "PE-Backed Home Care", href: "/home-care/pe-backed", desc: "One screening workflow, every branch." },
    { label: "Independent Home Care", href: "/home-care/independent", desc: "Evidence-led quality differentiation for referrers and families." },
  ],
  seniorLiving: [
    { label: "Senior Living", href: "/senior-living", desc: "Protect residents, occupancy and NOI." },
    { label: "CCRCs & Life Plan", href: "/senior-living/ccrc-life-plan", desc: "Coordinated screening across care levels." },
    { label: "Independent Living", href: "/senior-living/independent-living", desc: "Proactive wellness and early risk identification." },
    { label: "Assisted Living", href: "/senior-living/assisted-living", desc: "Standardised assessment for elevated-risk residents." },
  ],
  clinical: [
    { label: "Skilled Nursing", href: "/skilled-nursing", desc: "Standardised screening across every facility." },
    { label: "Pharma & CROs", href: "/pharma", desc: "Digital endpoints for clinical trials." },
  ],
};

const resourcesMenu = {
  learn: [
    { label: "Blog", href: "/blog", desc: "The topics that we are talking about." },
    { label: "Knowledge Base", href: "/knowledge-base", desc: "Our published papers, research summaries, and white papers." },
    { label: "Research Library", href: "/resources/research-library", desc: "A searchable library of the academic papers we are excited about." },
  ],
  tools: [
    { label: "Technical Documentation", href: "/resources/technical-documentation", desc: "Integration documents and other technical documentation relating to our product." },
    { label: "Case Studies and Customer Testimonials", href: "/resources/case-studies", desc: "What our customers are saying about us." },
    { label: "Buyers Guide", href: "/resources/buyers-guide", desc: "Everything you need to brief procurement." },
  ],
};

const companyItems = [
  { label: "About Able Care", href: "/about", desc: "The story behind Able Care." },
  { label: "Contact Us", href: "/contact", desc: "Get in touch with us." },
];

type MenuKey = "solutions" | "segments" | "resources" | "company";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the open mega-menu when tapping/clicking outside of it (needed for touch devices).
  useEffect(() => {
    if (!openMenu) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (desktopNavRef.current && target && !desktopNavRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [openMenu]);

  // Hover only applies to true mouse pointers. Touch devices (iPad) fire synthetic
  // mouseenter/leave around a tap, which made the menu flash open then closed.
  const handlePointerEnter = (menu: MenuKey, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const toggleMenu = (menu: MenuKey) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm py-3 border-b border-black/5"
            : "bg-white/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/able-care-logo-horizontal.svg"
              alt="Able Care Logo"
              width={160}
              height={36}
              className="h-8 md:h-9 w-auto"
              priority
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav ref={desktopNavRef} className="hidden lg:flex items-center space-x-0.5">
            {/* Solutions mega-menu */}
            <div className="relative" onPointerEnter={(e) => handlePointerEnter("solutions", e)} onPointerLeave={handlePointerLeave}>
              <button
                type="button"
                onClick={() => toggleMenu("solutions")}
                aria-expanded={openMenu === "solutions"}
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ac-black hover:text-ac-blue transition-colors"
              >
                Solutions <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "solutions" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "solutions" && (
                <div className="absolute top-full left-0 w-[520px] bg-white shadow-xl rounded-xl border border-black/5 p-4 mt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="row-span-4">
                      <Link
                        href="/solutions/able-assess"
                        className="relative flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-ac-blue to-ac-aqua p-6 hover:opacity-95 transition-opacity overflow-hidden"
                        onClick={() => setOpenMenu(null)}
                      >
                        <img src="/images/nav-gradient-1.svg" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                        <div className="relative z-10">
                        <div className="mb-2 text-lg font-bold text-white">Able Assess</div>
                        <p className="text-sm leading-tight text-white/90 font-light">Four validated metrics in under five minutes.</p>
                        </div>
                      </Link>
                    </div>
                    {[...solutionsMenu.platform, ...solutionsMenu.capabilities].map((item) => (
                      item.external ? (
                        <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                          <div className="text-sm font-bold text-ac-black">{item.label}</div>
                          <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                        </a>
                      ) : (
                        <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                          <div className="text-sm font-bold text-ac-black">{item.label}</div>
                          <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Who We Help mega-menu */}
            <div className="relative" onPointerEnter={(e) => handlePointerEnter("segments", e)} onPointerLeave={handlePointerLeave}>
              <button
                type="button"
                onClick={() => toggleMenu("segments")}
                aria-expanded={openMenu === "segments"}
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ac-black hover:text-ac-blue transition-colors"
              >
                Who We Help <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "segments" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "segments" && (
                <div className="absolute top-full right-0 w-[640px] bg-white shadow-xl rounded-xl border border-black/5 p-4 mt-1">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-ac-black/40 px-3 mb-2">Home Care</div>
                      {segmentsMenu.homeCare.map((item) => (
                        <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                          <div className="text-sm font-bold text-ac-black">{item.label}</div>
                          <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-ac-black/40 px-3 mb-2">Senior Living</div>
                      {segmentsMenu.seniorLiving.map((item) => (
                        <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                          <div className="text-sm font-bold text-ac-black">{item.label}</div>
                          <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-ac-black/40 px-3 mb-2">Clinical</div>
                      {segmentsMenu.clinical.map((item) => (
                        <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                          <div className="text-sm font-bold text-ac-black">{item.label}</div>
                          <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources mega-menu */}
            <div className="relative" onPointerEnter={(e) => handlePointerEnter("resources", e)} onPointerLeave={handlePointerLeave}>
              <button
                type="button"
                onClick={() => toggleMenu("resources")}
                aria-expanded={openMenu === "resources"}
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ac-black hover:text-ac-blue transition-colors"
              >
                Resources <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "resources" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "resources" && (
                <div className="absolute top-full right-0 w-[520px] bg-white shadow-xl rounded-xl border border-black/5 p-4 mt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="row-span-4">
                      <Link
                        href="/blog"
                        className="relative flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-ac-blue to-ac-aqua p-6 hover:opacity-95 transition-opacity overflow-hidden"
                        onClick={() => setOpenMenu(null)}
                      >
                        <img src="/images/nav-gradient-3.svg" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                        <div className="relative z-10">
                        <div className="mb-2 text-lg font-bold text-white">Resources</div>
                        <p className="text-sm leading-tight text-white/90 font-light">Research, guides and insights on falls prevention.</p>
                        </div>
                      </Link>
                    </div>
                    {[...resourcesMenu.learn, ...resourcesMenu.tools].map((item) => (
                      <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                        <div className="text-sm font-bold text-ac-black">{item.label}</div>
                        <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company mega-menu */}
            <div className="relative" onPointerEnter={(e) => handlePointerEnter("company", e)} onPointerLeave={handlePointerLeave}>
              <button
                type="button"
                onClick={() => toggleMenu("company")}
                aria-expanded={openMenu === "company"}
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ac-black hover:text-ac-blue transition-colors"
              >
                Company <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "company" ? "rotate-180" : ""}`} />
              </button>
              {openMenu === "company" && (
                <div className="absolute top-full right-0 w-[520px] bg-white shadow-xl rounded-xl border border-black/5 p-4 mt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="row-span-5">
                      <Link
                        href="/about"
                        className="relative flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-br from-ac-blue to-ac-aqua p-6 hover:opacity-95 transition-opacity overflow-hidden"
                        onClick={() => setOpenMenu(null)}
                      >
                        <img src="/images/nav-gradient-2.svg" alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                        <div className="relative z-10">
                        <div className="mb-2 text-lg font-bold text-white">About Able Care</div>
                        <p className="text-sm leading-tight text-white/90 font-light">Our mission, story and the team making care safer.</p>
                        </div>
                      </Link>
                    </div>
                    {companyItems.map((item) => (
                      <Link key={item.href} href={item.href} className="block rounded-lg p-3 hover:bg-ac-grey/50 transition-colors" onClick={() => setOpenMenu(null)}>
                        <div className="text-sm font-bold text-ac-black">{item.label}</div>
                        <p className="text-xs text-ac-black/60 font-light mt-0.5">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop + Cart */}
            <Link href="/shop" className="px-3 py-2 text-sm font-medium text-ac-black hover:text-ac-blue transition-colors">
              Shop
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-ac-grey/40 rounded-full transition-colors" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 text-ac-black" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-ac-blue text-white text-[10px] font-bold rounded-full leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* CTAs */}
            <Link href="/demo" className="ml-2">
              <Button className="bg-ac-blue text-white rounded-full px-6 font-bold shadow-sm hover:bg-ac-aqua hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                Book a demo
              </Button>
            </Link>
          </nav>

          {/* ── Mobile Toggle ── */}
          <button
            className="lg:hidden text-ac-black p-2 -mr-2"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile Nav ── */}
        {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-ac-grey/40 max-h-[80vh] overflow-y-auto">
            <ul className="divide-y divide-ac-grey/40">
              {/* Solutions */}
              <MobileAccordion label="Solutions" expanded={expandedMobileItem} onToggle={setExpandedMobileItem}>
                {[...solutionsMenu.platform, ...solutionsMenu.capabilities].map((item) => (
                  <MobileSubLink key={item.href} href={item.href} label={item.label} desc={item.desc} external={item.external} onClose={closeMobile} />
                ))}
              </MobileAccordion>

              {/* Who We Help */}
              <MobileAccordion label="Who We Help" expanded={expandedMobileItem} onToggle={setExpandedMobileItem}>
                {[...segmentsMenu.homeCare, ...segmentsMenu.seniorLiving, ...segmentsMenu.clinical].map((item) => (
                  <MobileSubLink key={item.href} href={item.href} label={item.label} desc={item.desc} onClose={closeMobile} />
                ))}
              </MobileAccordion>

              {/* Resources */}
              <MobileAccordion label="Resources" expanded={expandedMobileItem} onToggle={setExpandedMobileItem}>
                {[...resourcesMenu.learn, ...resourcesMenu.tools].map((item) => (
                  <MobileSubLink key={item.href} href={item.href} label={item.label} desc={item.desc} onClose={closeMobile} />
                ))}
              </MobileAccordion>

              {/* Company */}
              <MobileAccordion label="Company" expanded={expandedMobileItem} onToggle={setExpandedMobileItem}>
                {companyItems.map((item) => (
                  <MobileSubLink key={item.href} href={item.href} label={item.label} onClose={closeMobile} />
                ))}
              </MobileAccordion>
            </ul>
            <div className="px-5 py-4 border-t border-ac-grey/40 space-y-3">
              <Link href="/shop" onClick={closeMobile} className="flex items-center gap-2 text-sm font-semibold text-ac-black hover:text-ac-blue transition-colors">
                <ShoppingBag className="w-4 h-4" />
                Shop
                {itemCount > 0 && (
                  <span className="ml-auto bg-ac-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link href="/demo" onClick={closeMobile}>
                <Button className="w-full bg-ac-blue text-white rounded-full font-bold hover:bg-ac-aqua hover:text-white hover:shadow-lg transition-all duration-200">
                  Book a demo
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </header>
    </div>
  );
}

/* ─── Mobile helpers ─── */

function MobileAccordion({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: string | null;
  onToggle: (val: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded === label;
  return (
    <li>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-ac-black font-semibold text-left"
        onClick={() => onToggle(isOpen ? null : label)}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown size={18} className={`text-ac-black/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <ul className="bg-ac-grey/20 border-t border-ac-grey/40">
          {children}
        </ul>
      )}
    </li>
  );
}

function MobileSubLink({
  href,
  label,
  desc,
  external,
  onClose,
}: {
  href: string;
  label: string;
  desc?: string;
  external?: boolean;
  onClose: () => void;
}) {
  const content = (
    <>
      <span className="text-sm font-bold text-ac-black">{label}</span>
      {desc && <span className="text-xs text-ac-black/55 font-light mt-0.5">{desc}</span>}
    </>
  );
  const className = "flex flex-col px-7 py-3.5 border-b border-ac-grey/30 last:border-b-0 hover:bg-ac-grey/40 transition-colors";
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClose}>
          {content}
        </a>
      ) : (
        <Link href={href} className={className} onClick={onClose}>
          {content}
        </Link>
      )}
    </li>
  );
}
