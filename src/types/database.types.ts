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
      addresses: {
        Row: {
          city: string | null
          complement: string | null
          created_at: string
          district: string | null
          id: number
          number: string | null
          state: string | null
          street: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          created_at?: string
          district?: string | null
          id?: number
          number?: string | null
          state?: string | null
          street: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          created_at?: string
          district?: string | null
          id?: number
          number?: string | null
          state?: string | null
          street?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          name: string
          photo_url: string | null
          slug: string
          store_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name: string
          photo_url?: string | null
          slug: string
          store_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
          photo_url?: string | null
          slug?: string
          store_id?: number | null
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
      category_option_groups: {
        Row: {
          category_id: number
          created_at: string
          option_group_id: number
        }
        Insert: {
          category_id: number
          created_at?: string
          option_group_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          option_group_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_option_groups_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_option_groups_option_group_id_fkey"
            columns: ["option_group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: number
          last_interaction: string | null
          notes: string | null
          phone: string | null
          profile_id: string | null
          source: string | null
          store_id: number
          total_orders: number | null
          total_spent: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          last_interaction?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          source?: string | null
          store_id: number
          total_orders?: number | null
          total_spent?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          last_interaction?: string | null
          notes?: string | null
          phone?: string | null
          profile_id?: string | null
          source?: string | null
          store_id?: number
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
      delivery_zones: {
        Row: {
          active: boolean | null
          created_at: string
          delivery_cost: number
          id: number
          min_order_amount: number | null
          name: string
          store_id: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          delivery_cost: number
          id?: number
          min_order_amount?: number | null
          name: string
          store_id?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          delivery_cost?: number
          id?: number
          min_order_amount?: number | null
          name?: string
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_zones_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      option_groups: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_mandatory: boolean | null
          max_selections: number | null
          min_selections: number
          name: string
          store_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_mandatory?: boolean | null
          max_selections?: number | null
          min_selections?: number
          name: string
          store_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_mandatory?: boolean | null
          max_selections?: number | null
          min_selections?: number
          name?: string
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_groups_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          menu_item_id: number
          notes: string | null
          order_id: number
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          menu_item_id: number
          notes?: string | null
          order_id: number
          price: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          menu_item_id?: number
          notes?: string | null
          order_id?: number
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
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
          created_at: string
          id: number
          payment_type_id: number | null
          status_id: number | null
          store_id: number | null
          total: number
          tracking_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          payment_type_id?: number | null
          status_id?: number | null
          store_id?: number | null
          total: number
          tracking_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          payment_type_id?: number | null
          status_id?: number | null
          store_id?: number | null
          total?: number
          tracking_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_payment_type_id_fkey"
            columns: ["payment_type_id"]
            isOneToOne: false
            referencedRelation: "payment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "order_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_types: {
        Row: {
          active: boolean | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: number
          name: string
        }
        Relationships: []
      }
      product_option_groups: {
        Row: {
          created_at: string
          option_group_id: number
          product_id: number
        }
        Insert: {
          created_at?: string
          option_group_id: number
          product_id: number
        }
        Update: {
          created_at?: string
          option_group_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_option_groups_option_group_id_fkey"
            columns: ["option_group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_option_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          cost_price: number | null
          created_at: string
          id: number
          max_quantity: number | null
          name: string
          option_group_id: number
          price: number
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          id?: number
          max_quantity?: number | null
          name: string
          option_group_id: number
          price: number
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          id?: number
          max_quantity?: number | null
          name?: string
          option_group_id?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_options_option_group_id_fkey"
            columns: ["option_group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: number
          cost_price: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          photo_url: string | null
          price: number
          store_id: number
        }
        Insert: {
          active?: boolean | null
          category_id: number
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          photo_url?: string | null
          price: number
          store_id: number
        }
        Update: {
          active?: boolean | null
          category_id?: number
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          photo_url?: string | null
          price?: number
          store_id?: number
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
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: number
          logo_url: string | null
          name: string
          owner_id: string
          slug: string
          status: string | null
          theme_color: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name: string
          owner_id: string
          slug: string
          status?: string | null
          theme_color?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name?: string
          owner_id?: string
          slug?: string
          status?: string | null
          theme_color?: string | null
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
      order_statuses: {
        Row: {
          created_at: string | null
          id: number | null
          name: string | null
          sequence: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "customer" | "restaurant_owner" | "driver" | "admin"
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
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["customer", "restaurant_owner", "driver", "admin"],
    },
  },
} as const
