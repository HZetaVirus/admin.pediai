import { Database } from '@/types/database.types';

export type Store = Database['public']['Tables']['stores']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// ✅ SOURCE OF TRUTH: mappings for "Lean" Database

// 1. Store Settings (formerly separate columns/tables)
// Now stored in `stores.settings` (JSONB)
export interface StoreSettings {
    delivery_fee?: number;
    min_order_value?: number;
    logo_url?: string;
    banner_url?: string;
    theme_color?: string;
    operating_hours?: {
        [day: string]: { open: string; close: string; closed: boolean }
    };
    delivery_zones?: any[]; // Simplified for now
    payment_methods?: {
        pix?: boolean;
        card?: boolean;
        cash?: boolean;
        pix_key?: string;
    };
    notification_phone?: string;
    notification_email?: string;
}

export function getStoreSettings(store: Store | null): StoreSettings {
    if (!store || !store.settings) return {};
    return store.settings as StoreSettings;
}

// 2. Driver Info (formerly `drivers` table)
// Now stored in `profiles.metadata` or `profiles.driver_info` (JSONB)
export interface DriverInfo {
    vehicle_type?: 'motorcycle' | 'bike' | 'car';
    plate?: string;
    cnh?: string;
    is_online?: boolean; // mapped from profiles.is_online
}

export function getDriverInfo(profile: Profile): DriverInfo {
    if (!profile) return {};
    // Priority: direct column (if added) -> metadata -> null
    const meta = profile.metadata as any || {};
    return {
        ...meta,
        vehicle_type: meta.vehicle_type,
        plate: meta.plate,
        is_online: profile.is_online || false
    };
}

// 3. Address/Location
// Stores: `stores.address` (text) + `lat`/`long`
// Users: `profiles.current_lat`/`long` (for tracking) + Orders `delivery_address` (JSON)
