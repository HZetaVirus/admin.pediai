export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          key: string
          value: Json | null
        }
        Insert: {
          key: string
          value?: Json | null
        }
        Update: {
          key?: string
          value?: Json | null
        }
        Relationships: []
      }
      auth_otps: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          identifier: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          id: string
          media_url: string | null
          message: string | null
          name: string | null
          sent_count: number | null
          status: string | null
          store_id: string | null
          total_contacts: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          name?: string | null
          sent_count?: number | null
          status?: string | null
          store_id?: string | null
          total_contacts?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          name?: string | null
          sent_count?: number | null
          status?: string | null
          store_id?: string | null
          total_contacts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          position: number | null
          store_id: string | null
        }
        Insert: {
          id?: number
          name: string
          position?: number | null
          store_id?: string | null
        }
        Update: {
          id?: number
          name?: string
          position?: number | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          order_id: number | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          order_id?: number | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          order_id?: number | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          latitude: number
          longitude: number
          name: string
          radius_km: number
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          latitude: number
          longitude: number
          name: string
          radius_km?: number
          state: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          latitude?: number
          longitude?: number
          name?: string
          radius_km?: number
          state?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          profile_id: string | null
          source: string | null
          store_id: string | null
          total_orders: number | null
          total_spent: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_id?: string | null
          source?: string | null
          store_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_id?: string | null
          source?: string | null
          store_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          options_selected: Json | null
          order_id: number | null
          product_name: string
          quantity: number | null
          unit_price: number
        }
        Insert: {
          id?: number
          options_selected?: Json | null
          order_id?: number | null
          product_name: string
          quantity?: number | null
          unit_price: number
        }
        Update: {
          id?: number
          options_selected?: Json | null
          order_id?: number | null
          product_name?: string
          quantity?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivery_address: Json
          delivery_fee: number | null
          driver_earnings: number | null
          driver_id: string | null
          id: number
          payment_method: string | null
          pickup_address: Json | null
          status: string | null
          store_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address: Json
          delivery_fee?: number | null
          driver_earnings?: number | null
          driver_id?: string | null
          id?: number
          payment_method?: string | null
          pickup_address?: Json | null
          status?: string | null
          store_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json
          delivery_fee?: number | null
          driver_earnings?: number | null
          driver_id?: string | null
          id?: number
          payment_method?: string | null
          pickup_address?: Json | null
          status?: string | null
          store_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          description: string | null
          id: number
          image_url: string | null
          is_available: boolean | null
          name: string
          options: Json | null
          price: number
          store_id: string | null
        }
        Insert: {
          category_id?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          name: string
          options?: Json | null
          price: number
          store_id?: string | null
        }
        Update: {
          category_id?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          options?: Json | null
          price?: number
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_lat: number | null
          current_long: number | null
          driver_info: Json | null
          email: string
          full_name: string | null
          id: string
          is_online: boolean | null
          phone: string | null
          role: string | null
          status: string | null
          wallet_balance: number | null
        }
        Insert: {
          created_at?: string | null
          current_lat?: number | null
          current_long?: number | null
          driver_info?: Json | null
          email: string
          full_name?: string | null
          id: string
          is_online?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          wallet_balance?: number | null
        }
        Update: {
          created_at?: string | null
          current_lat?: number | null
          current_long?: number | null
          driver_info?: Json | null
          email?: string
          full_name?: string | null
          id?: string
          is_online?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_open: boolean | null
          lat: number | null
          long: number | null
          name: string
          owner_id: string | null
          settings: Json | null
          slug: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_open?: boolean | null
          lat?: number | null
          long?: number | null
          name: string
          owner_id?: string | null
          settings?: Json | null
          slug: string
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_open?: boolean | null
          lat?: number | null
          long?: number | null
          name?: string
          owner_id?: string | null
          settings?: Json | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_exists: { Args: { identifier: string }; Returns: boolean }
      delete_own_account: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      verify_custom_otp: {
        Args: { p_code: string; p_identifier: string }
        Returns: Json
      }
    }
    Enums: {
      profile_status: "pending" | "active" | "rejected"
      user_role:
        | "admin"
        | "restaurant_owner"
        | "driver"
        | "customer"
        | "courier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      profile_status: ["pending", "active", "rejected"],
      user_role: ["admin", "restaurant_owner", "driver", "customer", "courier"],
    },
  },
} as const
