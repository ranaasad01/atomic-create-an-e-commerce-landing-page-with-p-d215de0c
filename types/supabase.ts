// Auto-generated from the connected Supabase schema. Do not edit by hand.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: string
          compare_at_price: string | null
          category: string
          badge: string | null
          image_url: string | null
          is_featured: boolean
          is_new_arrival: boolean
          in_stock: boolean
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          thumbnail_url: string | null
          display_order: number
          created_at: string
        }
      }
      collections: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          cover_image_url: string | null
          display_order: number
          created_at: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
      }
    }
  }
}