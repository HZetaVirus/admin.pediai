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
      option_groups: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_mandatory: boolean | null
          max_selections: number | null
          min_selections: number | null
          name: string
          store_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_mandatory?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name: string
          store_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_mandatory?: boolean | null
          max_selections?: number | null
          min_selections?: number | null
          name?: string
          store_id?: number | null
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
          order_id: bigint | null
          price: number
          product_id: bigint | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id?: bigint | null
          price: number
          product_id?: bigint | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: bigint | null
          price?: number
          product_id?: bigint | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_statuses: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: bigint
          payment_type_id: bigint | null
          status_id: number | null
          store_id: bigint | null
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: bigint
          payment_type_id?: bigint | null
          status_id?: number | null
          store_id?: bigint | null
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: bigint
          payment_type_id?: bigint | null
          status_id?: number | null
          store_id?: bigint | null
          total?: number
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
            referencedRelation: "orders"
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
      payment_types: {
        Row: {
          created_at: string
          id: number
          name: string
          receive: string | null
          slug: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          receive?: string | null
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          receive?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      product_option_groups: {
        Row: {
          option_group_id: number
          product_id: number
        }
        Insert: {
          option_group_id: number
          product_id: number
        }
        Update: {
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
          created_at: string
          id: number
          name: string
          option_group_id: number | null
          price: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          option_group_id?: number | null
          price?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          option_group_id?: number | null
          price?: number | null
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
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          photo_url: string | null
          price: number
          store_id: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          photo_url?: string | null
          price: number
          store_id?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          photo_url?: string | null
          price?: number
          store_id?: number | null
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
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          logo_url: string | null
          name: string
          owner_id: string | null
          slug: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name: string
          owner_id?: string | null
          slug?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals["public"]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"] &
        DatabaseWithoutInternals["public"]["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof DatabaseWithoutInternals["public"]["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof DatabaseWithoutInternals["public"]["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][PublicTableNameOrOptions] extends {
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
      user_role: ["customer", "restaurant_owner", "driver", "admin"],
    },
  },
} as const
