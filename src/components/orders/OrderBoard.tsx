"use client";

import React from "react";
import { orderService, Order } from "@/services/orderService";
import { authService } from "@/services/authService";
import { supabase } from "@/lib/supabase";
import { OrderCard } from "./OrderCard";
import { OrderDetailModal } from "./OrderDetailModal";
import { Loader2, Inbox, ChefHat, Bike, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrderBoard() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [storeId, setStoreId] = React.useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Audio ref for notifications
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple ping sound
  }, []);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const fetchData = async () => {
    try {
      // Get current user's store
      const session = authService.getSession();
      const user = session?.user;

      if (!user) return;

      // --- AGGRESSIVE STORE DISCOVERY ---
      const { data: storeResult } = await supabase
        .from('stores')
        .select('id, owner_id')
        .eq('owner_id', user.id)
        .single();

      let finalStore: { id: string; owner_id?: string | null } | null = storeResult;

      if (!finalStore) {
        console.warn("[AUTH] Store not found by owner_id in OrderBoard, trying fallback...");
        const { data: anyStore } = await supabase.from('stores').select('id').limit(1).single();
        finalStore = anyStore;
      }

      if (!finalStore) {
        console.warn("[AUTH] Still no store, checking orders...");
        const { data: orderWithStore } = await supabase.from('orders').select('store_id').limit(1).single();
        if (orderWithStore?.store_id) finalStore = { id: orderWithStore.store_id };
      }

      if (finalStore) {
        const currentStoreId = finalStore.id;
        setStoreId(currentStoreId);
        const initialOrders = await orderService.getStoreOrders(currentStoreId);
        setOrders(initialOrders);

        // Subscribe to changes
        const subscription = orderService.subscribeToOrders(currentStoreId, (payload) => {
          if (payload.eventType === 'INSERT') {
            playNotification();
            toast.success("Novo pedido recebido! 🔔");
            // Refresh full list to get relations
            orderService.getStoreOrders(currentStoreId).then(setOrders);
          } else if (payload.eventType === 'UPDATE') {
            // Refresh to update status positions
            orderService.getStoreOrders(currentStoreId).then(setOrders);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    } catch (error) {
      console.error("Error init orders:", error);
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    const oldStatus = order.status;
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

    try {
      await orderService.updateOrderStatus(order.id, newStatus);
      toast.success("Status atualizado!");
    } catch (error) {
      // Revert on error
      console.error("Error updating status:", error);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: oldStatus } : o));
      toast.error("Erro ao atualizar status.");
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(o => o.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="text-center p-8 text-slate-500">
        Loja não encontrada.
      </div>
    );
  }

  const columns = [
    { id: 'pending', label: "Pendentes", icon: <Inbox size={18} />, color: "text-yellow-600", bg: "bg-yellow-50" },
    { id: 'preparing', label: "Em Preparo", icon: <ChefHat size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'out_for_delivery', label: "A Caminho", icon: <Bike size={18} />, color: "text-purple-600", bg: "bg-purple-50" },
    { id: 'delivered', label: "Concluídos", icon: <CheckCircle2 size={18} />, color: "text-green-600", bg: "bg-green-50" },
    { id: 'cancelled', label: "Cancelados", icon: <XCircle size={18} />, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pedidos em Tempo Real</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Conectado
        </div>
      </div>

      <div className="md:hidden">
        {/* Mobile View - Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {columns.map(col => (
              <TabsTrigger key={col.id} value={col.id} className="gap-2">
                {col.icon} {col.label}
                <span className="ml-1 bg-slate-100 px-1.5 rounded-full text-[10px]">{getOrdersByStatus(col.id).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {columns.map(col => (
            <TabsContent key={col.id} value={col.id} className="space-y-4">
              {getOrdersByStatus(col.id).length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Sem pedidos nesta etapa
                </div>
              ) : (
                getOrdersByStatus(col.id).map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="hidden md:grid grid-cols-5 gap-4 min-h-[60vh]">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className={`flex items-center justify-between p-3 rounded-xl border border-transparent ${col.bg} ${col.color}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {col.icon}
                {col.label}
              </div>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-black shadow-sm">
                {getOrdersByStatus(col.id).length}
              </span>
            </div>

            <div className="flex-1 bg-slate-50/50 rounded-2xl p-2 space-y-3 border border-slate-100">
              {getOrdersByStatus(col.id).map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
              {getOrdersByStatus(col.id).length === 0 && (
                <div className="h-24 flex items-center justify-center text-slate-300 text-xs italic">
                  Vazio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={(newStatus) => {
          if (selectedOrder) {
            handleStatusChange(selectedOrder, newStatus);
          }
        }}
      />
    </div>
  );
}
