"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { packHref, type PackId } from "@/assets/packs";
import { content } from "@/content/shreya";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/portfolio";

const PAPER = "#F7F2E6";
const ORANGE = "#FF5E00";
const BLUE = "#3B4AD6";

interface SiteNavProps {
  packId: PackId;
  className?: string;
}

function NavPill({ link }: { link: NavLink }) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" className="relative flex items-center justify-center">
      <Link href={link.href} className="relative flex items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 z-[1] rounded-[64px]"
          style={{ backgroundColor: ORANGE, transformOrigin: "center" }}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
        {/* The cream layer sits 1.5px inside the orange one, leaving the ring the
            live site renders. Border-box keeps the pill at 84.06 x 42.41. */}
        <span
          className="relative z-[1] flex items-center justify-center rounded-[64px] border-[1.5px] px-6 py-2.5"
          style={{ backgroundColor: PAPER, borderColor: ORANGE, boxSizing: "border-box" }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "22.4px", color: BLUE }}>
            {link.label}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

export function SiteNav({ packId, className }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const links = content.navLinks.map((l) => ({ ...l, href: packHref(packId, l.href) }));

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-0 z-[8] h-[60px] min-[810px]:h-20",
        className,
      )}
    >
      <nav className="flex h-[60px] items-center justify-center px-4 pb-5 min-[810px]:h-20 min-[810px]:overflow-hidden min-[810px]:px-10 min-[810px]:pb-0">
        <div className="relative flex w-full max-w-[1600px] flex-row items-center justify-between min-[810px]:h-[42.4px]">
          <Link href={packHref(packId, "/")} className="shrink-0">
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontWeight: 900,
                fontSize: 32,
                lineHeight: "33.6px",
                letterSpacing: "-2px",
                textAlign: "center",
                color: BLUE,
              }}
            >
              {content.wordmark}
            </span>
          </Link>

          <div className="hidden flex-row items-center gap-3 min-[810px]:flex">
            {links.map((link) => (
              <NavPill key={link.href + link.label} link={link} />
            ))}
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-6 w-6 flex-col items-center justify-center gap-[4px] min-[810px]:hidden"
          >
            <span className="h-[2px] w-6 rounded-full" style={{ backgroundColor: BLUE }} />
            <span className="h-[2px] w-6 rounded-full" style={{ backgroundColor: BLUE }} />
            <span className="h-[2px] w-6 rounded-full" style={{ backgroundColor: BLUE }} />
          </button>

          {open ? (
            <div
              className="absolute right-0 top-full flex flex-col items-end gap-3 rounded-2xl p-4 min-[810px]:hidden"
              style={{ backgroundColor: PAPER }}
            >
              {links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "22.4px", color: BLUE }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
