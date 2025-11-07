export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          slug: string
          images: string[]
          price: number
          compare_at_price: number | null
          rating: number
          rating_count: number
          badges: string[] | null
          category: string
          description: string
          specs: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          images: string[]
          price: number
          compare_at_price?: number | null
          rating?: number
          rating_count?: number
          badges?: string[] | null
          category: string
          description: string
          specs?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          images?: string[]
          price?: number
          compare_at_price?: number | null
          rating?: number
          rating_count?: number
          badges?: string[] | null
          category?: string
          description?: string
          specs?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          color: string | null
          size: string | null
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          color?: string | null
          size?: string | null
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          color?: string | null
          size?: string | null
          stock?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

