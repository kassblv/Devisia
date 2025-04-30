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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          full_name: string | null
          company_name: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          company_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          company_name?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          client_name: string
          client_email: string
          total_amount: number
          status: 'draft' | 'sent' | 'approved' | 'rejected'
          expiry_date: string | null
          quote_number: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          client_name: string
          client_email: string
          total_amount: number
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          expiry_date?: string | null
          quote_number: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          client_name?: string
          client_email?: string
          total_amount?: number
          status?: 'draft' | 'sent' | 'approved' | 'rejected'
          expiry_date?: string | null
          quote_number?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          created_at: string
          quote_id: string
          description: string
          quantity: number
          unit_price: number
          tax_rate: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          quote_id: string
          description: string
          quantity: number
          unit_price: number
          tax_rate?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          quote_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          tax_rate?: number | null
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
