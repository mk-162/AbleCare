"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  credentials?: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  tier?: "leadership" | "team" | "advisory";
}

interface TeamShowcaseProps {
  heading?: string;
  subtitle?: string;
  team?: TeamMember[];
  layout?: "featured" | "grid" | "compact";
}

export function TeamShowcase({
  heading = "Meet the team",
  subtitle,
  team,
  layout = "featured",
}: TeamShowcaseProps) {
  if (!team || team.length === 0) return null;

  const leadership = team.filter((m) => m.tier === "leadership" || (!m.tier && layout === "featured"));
  const advisory = team.filter((m) => m.tier === "advisory");
  const rest = team.filter((m) => m.tier === "team");

  const hasMultipleTiers = advisory.length > 0 || rest.length > 0;

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ac-black mb-4">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-lg text-ac-black/60 font-light max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Leadership — large cards */}
        {layout === "featured" && leadership.length > 0 && (
          <div className="mb-20">
            {hasMultipleTiers && (
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-8">
                Leadership
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((member, i) => (
                <LeadershipCard key={i} member={member} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Grid layout — uniform cards */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <LeadershipCard key={i} member={member} index={i} />
            ))}
          </div>
        )}

        {/* Compact layout — smaller cards */}
        {layout === "compact" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <CompactCard key={i} member={member} index={i} />
            ))}
          </div>
        )}

        {/* Broader team */}
        {rest.length > 0 && (
          <div className="mb-20">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-8">
              Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rest.map((member, i) => (
                <CompactCard key={i} member={member} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Advisory board */}
        {advisory.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue mb-8">
              Advisory Board
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisory.map((member, i) => (
                <AdvisoryCard key={i} member={member} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Leadership Card ─── */

function LeadershipCard({ member, index }: { member: TeamMember; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative bg-white rounded-2xl border border-black/6 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Photo area */}
      <div className="relative aspect-square bg-gradient-to-br from-ac-blue/5 to-ac-aqua/5 overflow-hidden">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-ac-blue/8 flex items-center justify-center">
              <span className="text-3xl font-bold text-ac-blue/30">{initials}</span>
            </div>
          </div>
        )}

        {/* Gradient overlay at bottom of photo */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent" />

        {/* LinkedIn icon */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-ac-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-ac-blue hover:text-white"
            aria-label={`${member.name} on LinkedIn`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-ac-black leading-tight">{member.name}</h3>
        {member.credentials && (
          <p className="text-sm font-medium text-ac-blue mt-0.5">{member.credentials}</p>
        )}
        <p className="text-sm text-ac-black/55 font-light mt-1">{member.role}</p>

        {member.bio && (
          <>
            <p
              className={`text-sm text-ac-black/65 font-light mt-3 leading-relaxed ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {member.bio}
            </p>
            {member.bio.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-medium text-ac-blue mt-2 hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Compact Card ─── */

function CompactCard({ member, index }: { member: TeamMember; index: number }) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group text-center"
    >
      <div className="relative w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-ac-blue/8 to-ac-aqua/8">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold text-ac-blue/30">{initials}</span>
          </div>
        )}
      </div>
      <h4 className="text-sm font-bold text-ac-black">{member.name}</h4>
      {member.credentials && (
        <p className="text-xs font-medium text-ac-blue mt-0.5">{member.credentials}</p>
      )}
      <p className="text-xs text-ac-black/55 font-light mt-0.5">{member.role}</p>
    </motion.div>
  );
}

/* ─── Advisory Card ─── */

function AdvisoryCard({ member, index }: { member: TeamMember; index: number }) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex gap-5 p-5 rounded-xl bg-ac-grey/20 border border-black/5 hover:border-ac-blue/15 transition-colors"
    >
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-ac-blue/8 to-ac-aqua/8 flex-shrink-0">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-bold text-ac-blue/30">{initials}</span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-ac-black text-sm">{member.name}</h4>
        {member.credentials && (
          <p className="text-xs font-medium text-ac-blue">{member.credentials}</p>
        )}
        <p className="text-xs text-ac-black/55 font-light">{member.role}</p>
        {member.bio && (
          <p className="text-xs text-ac-black/55 font-light mt-2 leading-relaxed">{member.bio}</p>
        )}
      </div>
    </motion.div>
  );
}
