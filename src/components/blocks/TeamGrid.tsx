"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamGridProps {
  heading?: string;
  team?: Array<{
    name: string;
    role: string;
    credentials?: string;
    bio?: string;
    photo?: string;
  }>;
}

export function TeamGrid({ heading, team }: TeamGridProps) {
  if (!team || team.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ac-black">{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full mx-auto mb-5 overflow-hidden bg-ac-grey relative">
                {member.photo ? (
                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-ac-blue/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-ac-blue/40">
                      {member.name.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-ac-black">{member.name}</h3>
              {member.credentials && (
                <p className="text-sm text-ac-blue font-medium">{member.credentials}</p>
              )}
              <p className="text-sm text-ac-black/60 font-light">{member.role}</p>
              {member.bio && (
                <p className="text-sm text-ac-black/50 font-light mt-2">{member.bio}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
