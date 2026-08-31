"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Star, Check, ChevronRight, Sparkles, Package, RefreshCw, Shield } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_DESCRIPTION } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];

const FILTERS = ["All", "Outerwear", "Knitwear", "Trousers", "Accessories"] as const;
type Filter = (typeof FILTERS)[number];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Margot L.",
    location: "Paris",
    quote: "Every piece I own from LUMINA has outlasted three trend cycles. The quality is simply unmatched.",
    rating: 5,
  },
  {
    id: "t2",
    name: "James O.",
    location: "London",
    quote: "I stopped buying fast fashion the day I found this brand. Considered, beautiful, and built to last.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Selin A.",
    location: "Istanbul",
    quote: "The cashmere coat I bought two winters ago still looks brand new. Worth every penny.",
    rating: 5,
  },
];

const VALUE_PROPS = [
  {
    id: "v1",
    icon: Package,
    title: "Considered Materials",
    description: "Every fabric is sourced from certified mills with a commitment to environmental stewardship and fair labor.",
  },
  {
    id: "v2",
    icon: RefreshCw,
    title: "Timeless by Design",
    description: "We release two collections per year, not fifty. Each piece is designed to remain relevant for a decade.",
  },
  {
    id: "v3",
    icon: Shield,
    title: "Lifetime Repair Promise",
    description: "If a seam splits or a button loosens, we repair it free of charge. Forever. That is our guarantee.",
  },
  {
    id: "v4",
    icon: Sparkles,
    title: "Curated, Not Crowded",
    description: "Our edit is intentionally small. We would rather offer thirty perfect pieces than three hundred mediocre ones.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[var(--brand-accent)] text-[var(--brand-accent)]" />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  wishlisted,
  onWishlist,
}: {
  product: ProductRow;
  wishlisted: boolean;
  onWishlist: (id: string) => void;
}) {
  const price = parseFloat(product.price);
  const compareAt = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : null;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col bg-[var(--card-surface)] rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--image-bg)]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-black/20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-[var(--brand-accent)] text-black">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-black text-white">
              -{discount}%
            </span>
          )}
          {!product.in_stock && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-black/60 text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => onWishlist(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${wishlisted ? "fill-rose-500 text-rose-500" : "text-black/50"}`}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
          <button
            disabled={!product.in_stock}
            className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[var(--brand-accent)] hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.in_stock ? "Quick Add" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted-text)]">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-[var(--primary-text)] leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-semibold text-[var(--primary-text)]">
            ${price.toFixed(2)}
          </span>
          {compareAt && (
            <span className="text-xs text-[var(--muted-text)] line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const supabase = createClient();

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
      if (data) setCategories(data);
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase.from("collections").select("*").order("display_order", { ascending: true });
      if (data) setCollections(data);
      setLoadingCollections(false);
    }
    fetchCollections();
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const featuredProducts = products.filter((p) => p.is_featured);
  const newArrivals = products.filter((p) => p.is_new_arrival);

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await supabase.from("newsletter_subscribers").insert({ email: email.trim(), subscribed_at: new Date().toISOString() });
      setSubscribed(true);
      setEmail("");
    } catch {
      setSubscribed(true);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--page-bg)]">
      {/* ── HERO ── */}
      <Reveal>
        <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-[var(--hero-bg)]">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/images/lumina-hero-editorial-fashion.jpg"
              alt="LUMINA editorial hero"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.p
                variants={fadeInUp}
                className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-4"
              >
                {BRAND_NAME} — New Season
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.05] text-balance mb-6"
              >
                {BRAND_TAGLINE}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg mb-10 text-pretty"
              >
                {BRAND_DESCRIPTION}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <a
                  href="#featured-products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--brand-accent)] text-black text-sm font-semibold tracking-wide hover:bg-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore the Collection
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-semibold tracking-wide hover:border-white/70 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  View Lookbook
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 md:right-12 z-10 flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/50 rotate-90 origin-center translate-y-4">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
            />
          </div>
        </section>
      </Reveal>

      {/* ── VALUE PROPS ── */}
      <Reveal>
        <section className="bg-[var(--page-bg)] py-20 md:py-28 border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
            >
              {VALUE_PROPS.map((vp, i) => {
                const Icon = vp.icon;
                return (
                  <motion.div key={vp.id} variants={fadeInUp} className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--primary-text)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--primary-text)] mb-1.5">{vp.title}</h3>
                      <p className="text-sm text-[var(--muted-text)] leading-relaxed">{vp.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── FEATURED PRODUCTS ── */}
      <Reveal>
        <section id="featured-products" className="py-24 md:py-32 bg-[var(--page-bg)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-3">
                  Curated Edit
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--primary-text)] tracking-tight">
                  Featured Pieces
                </h2>
              </div>
              <a
                href="#shop-by-category"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary-text)] hover:text-[var(--brand-accent)] transition-colors duration-200 group"
              >
                View all
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-black/5 animate-pulse" />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-black/5 flex items-center justify-center">
                    <Package className="w-8 h-8 text-black/20" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-5"
              >
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlist.has(product.id)}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── COLLECTIONS BENTO ── */}
      <Reveal>
        <section id="collections" className="py-24 md:py-32 bg-[var(--tinted-bg)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-14">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-3">
                Editorial
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[var(--primary-text)] tracking-tight">
                The Collections
              </h2>
            </div>

            {loadingCollections ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 aspect-[16/10] rounded-2xl bg-black/5 animate-pulse" />
                <div className="aspect-[16/10] md:aspect-auto rounded-2xl bg-black/5 animate-pulse" />
              </div>
            ) : collections.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Autumn Atelier", sub: "Warmth, refined.", span: "md:col-span-2", aspect: "aspect-[16/10]" },
                  { label: "The Minimal Edit", sub: "Less, always more.", span: "", aspect: "aspect-[4/5]" },
                  { label: "Evening Quiet", sub: "Understated luxury.", span: "", aspect: "aspect-[4/5]" },
                  { label: "Structured Days", sub: "Tailoring for life.", span: "md:col-span-2", aspect: "aspect-[16/10]" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`${c.span} ${c.aspect} rounded-2xl bg-black/5 flex items-end p-6`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--primary-text)]">{c.label}</p>
                      <p className="text-xs text-[var(--muted-text)]">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collections.slice(0, 4).map((col, i) => {
                  const isLarge = i === 0 || i === 3;
                  return (
                    <motion.div
                      key={col.id}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${isLarge ? "md:col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
                    >
                      {col.cover_image_url ? (
                        <img
                          src={col.cover_image_url}
                          alt={col.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--image-bg)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-lg font-medium text-white mb-1">{col.title}</h3>
                        {col.subtitle && (
                          <p className="text-sm text-white/70">{col.subtitle}</p>
                        )}
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--brand-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Explore <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── SHOP BY CATEGORY ── */}
      <Reveal>
        <section id="shop-by-category" className="py-24 md:py-32 bg-[var(--page-bg)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-3">
                  Browse
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--primary-text)] tracking-tight">
                  Shop by Category
                </h2>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] ${
                      activeFilter === f
                        ? "bg-[var(--primary-text)] text-[var(--page-bg)] border-[var(--primary-text)]"
                        : "bg-transparent text-[var(--muted-text)] border-black/15 hover:border-[var(--primary-text)] hover:text-[var(--primary-text)]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Category thumbnails (from DB) */}
            {!loadingCategories && categories.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                {categories.slice(0, 4).map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  >
                    {cat.thumbnail_url ? (
                      <img
                        src={cat.thumbnail_url}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--image-bg)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-sm font-semibold text-white">{cat.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Filtered products grid */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-black/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  {(filteredProducts.length > 0 ? filteredProducts : products).slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      wishlisted={wishlist.has(product.id)}
                      onWishlist={toggleWishlist}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── NEW ARRIVALS STRIP ── */}
      {newArrivals.length > 0 && (
        <Reveal>
          <section id="new-arrivals" className="py-24 md:py-32 bg-[var(--dark-section-bg)]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-3">
                    Just In
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                    New Arrivals
                  </h2>
                </div>
                <a
                  href="#shop-by-category"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
                >
                  See everything new
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-5"
              >
                {newArrivals.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlist.has(product.id)}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ── TESTIMONIALS ── */}
      <Reveal>
        <section className="py-24 md:py-32 bg-[var(--page-bg)] border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-3">
                Voices
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[var(--primary-text)] tracking-tight">
                What Our Customers Say
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.id}
                  variants={fadeInUp}
                  className={`flex flex-col gap-5 p-7 rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] bg-[var(--card-surface)] ${i === 1 ? "md:translate-y-4" : ""}`}
                >
                  <StarRating count={t.rating} />
                  <p className="text-sm text-[var(--primary-text)] leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto pt-4 border-t border-black/5">
                    <p className="text-xs font-semibold text-[var(--primary-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--muted-text)]">{t.location}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── ABOUT STRIP ── */}
      <Reveal>
        <section id="about" className="py-24 md:py-32 bg-[var(--tinted-bg)] border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="/images/lumina-atelier-craftsmanship-detail.jpg"
                  alt="LUMINA atelier craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--brand-accent)] mb-1">
                    Founded 2014
                  </p>
                  <p className="text-sm font-medium text-[var(--primary-text)]">
                    Crafted in small batches. Designed to endure.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-4">
                    Our Philosophy
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-[var(--primary-text)] tracking-tight leading-snug mb-6">
                    Fashion that does not shout
                  </h2>
                  <p className="text-base text-[var(--muted-text)] leading-relaxed mb-4">
                    LUMINA was born from a simple frustration: the fashion industry moves too fast, wastes too much, and asks too little of itself. We set out to build something different.
                  </p>
                  <p className="text-base text-[var(--muted-text)] leading-relaxed">
                    Every piece in our collection is designed with a ten-year horizon in mind. We work with a small network of family-run mills in Portugal, Italy, and Japan — partners who share our belief that making something well is the most radical act in fashion today.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    "Certified organic and recycled materials",
                    "Carbon-neutral shipping on all orders",
                    "Free lifetime repairs on every garment",
                    "No seasonal sales — fair pricing always",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--brand-accent)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[var(--primary-text)]" />
                      </div>
                      <p className="text-sm text-[var(--primary-text)]">{point}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#featured-products"
                  className="self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--primary-text)] text-[var(--page-bg)] text-sm font-semibold tracking-wide hover:bg-[var(--brand-accent)] hover:text-black transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                >
                  Shop the Collection
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── NEWSLETTER ── */}
      <Reveal>
        <section className="py-24 md:py-32 bg-[var(--dark-section-bg)]">
          <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[var(--brand-accent)] mb-4">
              Stay Close
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-4">
              The LUMINA Letter
            </h2>
            <p className="text-base text-white/60 leading-relaxed mb-10">
              Slow fashion news, new arrivals, and occasional essays on craft and style. No noise. Unsubscribe any time.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--brand-accent)] flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
                <p className="text-white font-medium">You are on the list. Thank you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[var(--brand-accent)] transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-7 py-3.5 rounded-full bg-[var(--brand-accent)] text-black text-sm font-semibold tracking-wide hover:bg-white transition-colors duration-300 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {subscribing ? "Joining..." : "Join"}
                </button>
              </form>
            )}
          </div>
        </section>
      </Reveal>
    </main>
  );
}