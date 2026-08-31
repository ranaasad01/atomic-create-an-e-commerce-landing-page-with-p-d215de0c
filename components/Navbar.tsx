"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { navLinks, BRAND_NAME } from "@/lib/data";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navT = (Array.isArray(t.raw("nav")) ? {} : t.raw("nav")) as Record<string, string>;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === "/" && href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  }

  function getLinkHref(href: string) {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-md shadow-[0_1px_0_0_var(--color-outline-variant)]"
          : "bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-16">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl md:text-2xl font-medium tracking-[0.12em] text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors duration-200"
            aria-label={`${BRAND_NAME} — Home`}
          >
            {BRAND_NAME}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={getLinkHref(link.href)}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="font-body text-[13px] font-500 uppercase tracking-[0.06em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
              >
                {navT[link.key] ?? link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <button
              aria-label="Search"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              aria-label="Account"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              aria-label="Shopping bag, 0 items"
              className="relative text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-body font-600 flex items-center justify-center leading-none">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[var(--color-on-surface)] p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-outline-variant)]"
          >
            <nav className="px-5 py-6 flex flex-col gap-5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getLinkHref(link.href)}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="font-body text-[13px] uppercase tracking-[0.06em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
                >
                  {navT[link.key] ?? link.label}
                </Link>
              ))}
              <div className="flex items-center gap-5 pt-2 border-t border-[var(--color-outline-variant)]">
                <button aria-label="Search" className="text-[var(--color-on-surface-variant)]">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
                <button aria-label="Account" className="text-[var(--color-on-surface-variant)]">
                  <User className="h-5 w-5" aria-hidden="true" />
                </button>
                <button aria-label="Shopping bag" className="relative text-[var(--color-on-surface-variant)]">
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-body flex items-center justify-center leading-none">
                    0
                  </span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}