export interface NavLink {
  label: string;
  href: string;
  key: string;
}

export const BRAND_NAME = "LUMINA";
export const BRAND_TAGLINE = "Quiet Complexity. Enduring Grace.";
export const BRAND_DESCRIPTION =
  "A curated house of considered fashion. We believe in fewer, better things — pieces that outlast trends and outlive seasons.";

export const navLinks: NavLink[] = [
  { label: "New Arrivals", href: "#featured-products", key: "new-arrivals" },
  { label: "Collections", href: "#collections", key: "collections" },
  { label: "Shop", href: "#shop-by-category", key: "shop" },
  { label: "About", href: "#about", key: "about" },
];

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compare_at_price?: number;
  badge?: string;
  image_url?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  in_stock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
  display_order: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle?: string;
  cover_image_url?: string;
  display_order: number;
}