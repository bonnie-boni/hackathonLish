// Auto-generated Supabase Database types
// In production, generate with:  npx supabase gen types typescript --project-id <id> > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          initials: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          initials?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          initials?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string | null;
          image: string | null;
          category: string | null;
          badge: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE' | null;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price?: number;
          description?: string | null;
          image?: string | null;
          category?: string | null;
          badge?: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE' | null;
          in_stock?: boolean;
        };
        Update: {
          name?: string;
          price?: number;
          description?: string | null;
          image?: string | null;
          category?: string | null;
          badge?: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE' | null;
          in_stock?: boolean;
        };
      };
      shops: {
        Row: {
          id: string;
          name: string;
          created_by: string | null;
          last_active: string;
          cart_total: number;
          cart_goal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by?: string | null;
          cart_total?: number;
          cart_goal?: number;
        };
        Update: {
          name?: string;
          created_by?: string | null;
          last_active?: string;
          cart_total?: number;
          cart_goal?: number;
        };
      };
      collaborators: {
        Row: {
          id: string;
          shop_id: string;
          user_id: string;
          status: 'active' | 'pending';
          joined_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          user_id: string;
          status?: 'active' | 'pending';
        };
        Update: {
          status?: 'active' | 'pending';
        };
      };
      shop_products: {
        Row: {
          id: string;
          shop_id: string;
          product_id: string;
          added_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          product_id: string;
          added_by?: string | null;
        };
        Update: {
          shop_id?: string;
          product_id?: string;
          added_by?: string | null;
        };
      };
      product_votes: {
        Row: {
          id: string;
          shop_product_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_product_id: string;
          user_id: string;
        };
        Update: {
          shop_product_id?: string;
          user_id?: string;
        };
      };
      invites: {
        Row: {
          id: string;
          shop_id: string;
          email: string;
          invited_by: string | null;
          status: 'pending' | 'accepted' | 'expired';
          token: string;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          shop_id: string;
          email: string;
          invited_by?: string | null;
          status?: 'pending' | 'accepted' | 'expired';
          token?: string;
        };
        Update: {
          status?: 'pending' | 'accepted' | 'expired';
          accepted_at?: string | null;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
        };
        Update: {
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
        };
        Update: {
          quantity?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          date: string | null;
          time: string | null;
          status: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
          subtotal: number;
          shipping: number;
          tax: number;
          total: number;
          thumbnail: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          date?: string | null;
          time?: string | null;
          status?: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          thumbnail?: string | null;
        };
        Update: {
          status?: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
          subtotal?: number;
          shipping?: number;
          tax?: number;
          total?: number;
          thumbnail?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          name: string;
          quantity: number;
          price: number;
          icon: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          name: string;
          quantity?: number;
          price?: number;
          icon?: string | null;
        };
        Update: {
          name?: string;
          quantity?: number;
          price?: number;
          icon?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string | null;
          provider: string;
          provider_payment_id: string | null;
          amount: number;
          currency: string;
          status: 'pending' | 'success' | 'failed' | 'cancelled';
          raw_response: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          provider?: string;
          provider_payment_id?: string | null;
          amount: number;
          currency?: string;
          status?: 'pending' | 'success' | 'failed' | 'cancelled';
          raw_response?: Json | null;
        };
        Update: {
          provider_payment_id?: string | null;
          amount?: number;
          status?: 'pending' | 'success' | 'failed' | 'cancelled';
          raw_response?: Json | null;
        };
      };
      mpesa_transactions: {
        Row: {
          id: string;
          order_id: string | null;
          checkout_request_id: string | null;
          merchant_request_id: string | null;
          phone_number: string | null;
          amount: number | null;
          result_code: number | null;
          result_desc: string | null;
          mpesa_receipt_number: string | null;
          callback_payload: Json | null;
          status: 'pending' | 'success' | 'failed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          checkout_request_id?: string | null;
          merchant_request_id?: string | null;
          phone_number?: string | null;
          amount?: number | null;
          result_code?: number | null;
          result_desc?: string | null;
          mpesa_receipt_number?: string | null;
          callback_payload?: Json | null;
          status?: 'pending' | 'success' | 'failed' | 'cancelled';
        };
        Update: {
          checkout_request_id?: string | null;
          merchant_request_id?: string | null;
          result_code?: number | null;
          result_desc?: string | null;
          mpesa_receipt_number?: string | null;
          callback_payload?: Json | null;
          status?: 'pending' | 'success' | 'failed' | 'cancelled';
        };
      };
      webhooks_log: {
        Row: {
          id: number;
          provider: string | null;
          event_type: string | null;
          payload: Json | null;
          received_at: string;
        };
        Insert: {
          provider?: string | null;
          event_type?: string | null;
          payload?: Json | null;
        };
        Update: {
          provider?: string | null;
          event_type?: string | null;
          payload?: Json | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_badge: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE';
      order_status: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
      payment_status: 'pending' | 'success' | 'failed' | 'cancelled';
      collaborator_status: 'active' | 'pending';
      invite_status: 'pending' | 'accepted' | 'expired';
    };
  };
}
