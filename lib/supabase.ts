import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string
          name: string
          phone: string
          inquiry_type: string
          message: string
          status: 'new' | 'read' | 'responded' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          inquiry_type: string
          message: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          inquiry_type?: string
          message?: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          image_url: string
          caption: string
          category: string
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          caption?: string
          category?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          caption?: string
          category?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          guest_name: string
          quote: string
          guest_role: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          guest_name: string
          quote: string
          guest_role?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          guest_name?: string
          quote?: string
          guest_role?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      footer_settings: {
        Row: {
          id: string
          email: string
          phone: string
          address: string
          additional_info: string
          instagram_handle: string
          instagram_url: string
          availability_text: string
          transport_text: string
          copyright_text: string
          powered_by_text: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string
          phone?: string
          address?: string
          additional_info?: string
          instagram_handle?: string
          instagram_url?: string
          availability_text?: string
          transport_text?: string
          copyright_text?: string
          powered_by_text?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          address?: string
          additional_info?: string
          instagram_handle?: string
          instagram_url?: string
          availability_text?: string
          transport_text?: string
          copyright_text?: string
          powered_by_text?: string
          updated_at?: string
        }
      }
    }
  }
}
