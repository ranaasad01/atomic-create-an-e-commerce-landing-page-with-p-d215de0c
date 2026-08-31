"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Camera as Instagram, Globe as Facebook } from 'lucide-react';
import { BRAND_NAME, BRAND_DESCRIPTION } from "@/lib/data";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const footerSections = (
    Array.isArray(t.raw("footer")) ? t.raw("footer") : []
  ) as Array<{ heading: string; links: string[] }>;

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer className="bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-20">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <p className="font-display text-2xl font-medium tracking-[0.12em] text-[var(--color-inverse-on-surface)] mb-4">
                {BRAND_NAME}
              </p>
              <p className="font-body text-sm leading-relaxed text-[var(--color-inverse-on-surface)]/60 max-w-xs">
                {BRAND_DESCRIPTION}
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[var(--color-inverse-on-surface)]/50 hover:text-[var(--color-inverse-on-surface)] transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[var(--color-inverse-on-surface)]/50 hover:text-[var(--color-inverse-on-surface)] transition-colors duration-200"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {footerSections.map((section, i) => (
              <div key={i}>
                <p className="font-body text-[11px] uppercase tracking-[0.1em] font-600 text-[var(--color-inverse-on-surface)]/40 mb-4">
                  {section.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {section.links.map((linkLabel, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="font-body text-sm text-[var(--color-inverse-on-surface)]/70 hover:text-[var(--color-inverse-on-surface)] transition-colors duration-200"
                      >
                        {linkLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bottom Bar */}
        <Reveal delay={0.1}>
          <div className="mt-12 pt-6 border-t border-[var(--color-inverse-on-surface)]/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-[var(--color-inverse-on-surface)]/40">
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="font-body text-xs text-[var(--color-inverse-on-surface)]/40 hover:text-[var(--color-inverse-on-surface)]/70 transition-colors duration-200"
              >
                {t("footer.privacy")}
              </a>
              <a
                href="#"
                className="font-body text-xs text-[var(--color-inverse-on-surface)]/40 hover:text-[var(--color-inverse-on-surface)]/70 transition-colors duration-200"
              >
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}