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
    Tables: {}
    Views: {}
    Enums: {}
    CompositeTypes: {}
  }
  public: {
    Tables: {
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
          description: string | null
          icon: string | null
          id: number
          name: string
          position: number | null
          slug: string
          store_id: string | null
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: number
          name: string
          position?: number | null
          slug: string
          store_id?: string | null
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
          position?: number | null
          slug?: string
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
          accepted_by: string | null
          created_at: string | null
          customer_id: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          id: number
          notes: string | null
          payment_method: string | null
          status: string
          store_id: string | null
          total_amount: number
        }
        Insert: {
          accepted_by?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          id?: number
          notes?: string | null
          payment_method?: string | null
          status?: string
          store_id?: string | null
          total_amount: number
        }
        Update: {
          accepted_by?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          id?: number
          notes?: string | null
          payment_method?: string | null
          status?: string
          store_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
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
          cost_price: number | null
          description: string | null
          id: number
          image_url: string | null
          is_available: boolean
          name: string
          price: number
          store_id: string | null
        }
        Insert: {
          category_id?: number | null
          cost_price?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean
          name: string
          price: number
          store_id?: string | null
        }
        Update: {
          category_id?: number | null
          cost_price?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean
          name?: string
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
      option_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_mandatory: boolean
          max_selections: number | null
          min_selections: number
          name: string
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_mandatory?: boolean
          max_selections?: number | null
          min_selections?: number
          name: string
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_mandatory?: boolean
          max_selections?: number | null
          min_selections?: number
          name?: string
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "option_groups_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
        ]
      }
      product_options: {
        Row: {
          id: number
          name: string
          option_group_id: number | null
          price: number
        }
        Insert: {
          id?: number
          name: string
          option_group_id?: number | null
          price: number
        }
        Update: {
          id?: number
          name?: string
          option_group_id?: number | null
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_options_option_group_id_fkey"
            columns: ["option_group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      category_option_groups: {
        Row: {
          category_id: number
          option_group_id: number
        }
        Insert: {
          category_id: number
          option_group_id: number
        }
        Update: {
          category_id?: number
          option_group_id?: number
        }
        Relationships: []
      }
      product_option_groups: {
        Row: {
          product_id: number
          option_group_id: number
        }
        Insert: {
          product_id: number
          option_group_id: number
        }
        Update: {
          product_id?: number
          option_group_id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned_until: string | null
          created_at: string | null
          current_lat: number | null
          current_long: number | null
          driver_info: Json | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          metadata: Json | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          banned_until?: string | null
          created_at?: string | null
          current_lat?: number | null
          current_long?: number | null
          driver_info?: Json | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_online?: boolean | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          banned_until?: string | null
          created_at?: string | null
          current_lat?: number | null
          current_long?: number | null
          driver_info?: Json | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
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
          is_open: boolean
          lat: number | null
          long: number | null
          name: string
          operating_hours?: Json | null
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
          is_open?: boolean
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
          is_open?: boolean
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
      check_user_exists: {
        Args: {
          identifier: string
        }
        Returns: boolean
      }
      verify_custom_otp: {
        Args: {
          p_identifier: string
          p_code: string
        }
        Returns: Json
      }
    }
    Enums: {
      profile_status: "pending" | "active" | "rejected"
      user_role: "admin" | "restaurant_owner" | "driver" | "customer" | "courier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never
