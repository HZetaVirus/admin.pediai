import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    products: Database["public"]["Tables"]["products"]["Row"] | null // products can be null if deleted
  })[];
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null; // profiles can be null (left join or optional)
};

export const orderService = {
  /**
   * Fetch active orders for a store (excluding completed/cancelled if needed, 
   * but for the board we usually want all active ones).
   */
  async getStoreOrders(storeId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        profiles (*)
      `)
      .eq("store_id", storeId)
      .order("created_at", { ascending: false }); // Newest first

    if (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }

    return data as Order[];
  },

  /**
   * Update the status of an order.
   */
  async updateOrderStatus(orderId: number, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time order updates for a specific store.
   * Returns the subscription object so it can be unsubscribed.
   */
  subscribeToOrders(storeId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => {
          console.log('Realtime Order Update:', payload);
          onUpdate(payload);
        }
      )
      .subscribe();
  }
};
