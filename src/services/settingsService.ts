import { supabase } from "@/lib/supabase";
import { authService } from "./authService";
import { Database } from "@/types/database.types";

type Store = Database["public"]["Tables"]["stores"]["Row"];
type StoreUpdate = Database["public"]["Tables"]["stores"]["Update"];

export interface StoreSettings extends Partial<Store> {
  operating_hours?: OperatingHours;
  delivery_fee?: number;
  min_order_value?: number;
  delivery_radius_km?: number;
  estimated_delivery_time?: number;
  accepts_cash?: boolean;
  accepts_card?: boolean;
  accepts_pix?: boolean;
  pix_key?: string;
  notification_phone?: string;
  notification_email?: string;
  banner_url?: string;
}

export interface OperatingHours {
  monday?: { open: string; close: string; closed: boolean };
  tuesday?: { open: string; close: string; closed: boolean };
  wednesday?: { open: string; close: string; closed: boolean };
  thursday?: { open: string; close: string; closed: boolean };
  friday?: { open: string; close: string; closed: boolean };
  saturday?: { open: string; close: string; closed: boolean };
  sunday?: { open: string; close: string; closed: boolean };
}

export const settingsService = {
  /**
   * Get current store settings for the authenticated user
   */
  async getStoreSettings(): Promise<Store | null> {
    const session = authService.getSession();
    const user = session?.user;
    
    if (!user) {
      console.warn("User not authenticated");
      return null;
    }

    // 1. Primary lookup
    const { data: store, error } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (!error && store) return store;

    // 2. Fallback: Any visible store
    console.warn("[AUTH] Store settings not found by owner_id, trying fallback...");
    const { data: anyStore } = await supabase.from("stores").select("*").limit(1).single();
    
    return anyStore || null;
  },

  /**
   * Update store settings
   */
  async updateStoreSettings(settings: StoreUpdate): Promise<void> {
    const session = authService.getSession();
    const user = session?.user;
    
    if (!user) {
      console.warn("User not authenticated");
      return;
    }

    const { error } = await supabase
      .from("stores")
      .update(settings)
      .eq("owner_id", user.id);

    if (error) {
      console.error("Error updating store settings:", error);
      throw error;
    }
  },

  /**
   * Upload image to Supabase Storage
   */
  async uploadImage(file: File, bucket: string = "store-images"): Promise<string> {
    const session = authService.getSession();
    const user = session?.user;
    
    if (!user) {
      console.warn("User not authenticated");
      throw new Error("User not authenticated");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
