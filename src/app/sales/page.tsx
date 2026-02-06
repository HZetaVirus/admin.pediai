"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Database } from "@/types/database.types";

// --- Types ---

interface DailySales {
  date: string;
  total: number;
  orders: number;
}

interface OrderSummary {
  id: number;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name?: string;
}

type Period = '7d' | '30d' | 'month' | 'today';

// --- Empty States ---
const EMPTY_SALES: DailySales[] = [
  { date: "Seg", total: 0, orders: 0 },
  { date: "Ter", total: 0, orders: 0 },
  { date: "Qua", total: 0, orders: 0 },
  { date: "Qui", total: 0, orders: 0 },
  { date: "Sex", total: 0, orders: 0 },
  { date: "Sáb", total: 0, orders: 0 },
  { date: "Dom", total: 0, orders: 0 },
];

export default function SalesReportsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7d');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // First get the user's store
      const session = authService.getSession();
      const user = session?.user;

      if (!user) {
        console.error("User not authenticated");
        router.push('/login');
        return;
      }

      // --- AGGRESSIVE STORE DISCOVERY ---
      console.log(`[AUTH] Checking store for user: ${user.id}`);

      let { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, owner_id')
        .eq('owner_id', user.id)
        .single();

      if (storeError) console.warn("[AUTH] Primary store lookup error:", storeError.message);

      // 2. Fallback: Any visible store
      if (!store) {
        console.warn("[AUTH] Store not found by owner_id, trying any visible store...");
        const { data: anyStore } = await supabase.from('stores').select('id, owner_id').limit(1).single();
        if (anyStore) {
          console.log("[AUTH] Found a store via fallback:", anyStore.id);
          store = anyStore;
        }
      }

      let discoveredStore: { id: string } | null = null;

      // 3. Fallback: Discover from Orders
      if (!store) {
        console.warn("[AUTH] Still no store, checking orders table...");
        const { data: orderWithStore } = await supabase.from('orders').select('store_id').limit(1).single();
        if (orderWithStore?.store_id) {
          console.log("[AUTH] Discovered store ID from orders:", orderWithStore.store_id);
          discoveredStore = { id: orderWithStore.store_id };
        }
      }

      // 4. Fallback: Discover from Products
      if (!store && !discoveredStore) {
        console.warn("[AUTH] Still no store, checking products table...");
        const { data: productWithStore } = await supabase.from('products').select('store_id').limit(1).single();
        if (productWithStore?.store_id) {
          console.log("[AUTH] Discovered store ID from products:", productWithStore.store_id);
          discoveredStore = { id: productWithStore.store_id };
        }
      }

      const finalStore = store || discoveredStore;

      if (!finalStore) {
        console.warn("Nenhuma loja encontrada para o usuário:", user.id);
        setSalesData(EMPTY_SALES);
        setLoading(false);
        return;
      }

      const storeId = finalStore.id;
      console.log("[AUTH] Final store ID being used:", storeId);
      // ------------------------------------

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Now fetch orders for this store with date filter
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          customer_id
        `)
        .eq('store_id', finalStore.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      if (orders && orders.length > 0) {
        // Process sales trend
        const dailyMap: Record<string, DailySales> = {};
        orders.forEach(order => {
          const date = new Date(order.created_at || new Date().toISOString()).toLocaleDateString('pt-BR', { weekday: 'short' });
          if (!dailyMap[date]) {
            dailyMap[date] = { date, total: 0, orders: 0 };
          }
          dailyMap[date].total += order.total_amount || 0;
          dailyMap[date].orders += 1;
        });

        const processedSales = Object.values(dailyMap).slice(0, 7).reverse();
        setSalesData(processedSales.length > 0 ? processedSales : EMPTY_SALES);
        setRecentOrders(orders as unknown as OrderSummary[]);
      } else {
        setSalesData(EMPTY_SALES);
      }

    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData(EMPTY_SALES);
    } finally {
      setLoading(false);
    }
  }, [period, router]);

  useEffect(() => {
    fetchData();
  }, [period, fetchData]);

  const metrics = useMemo(() => {
    const totalRevenue = salesData.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = salesData.reduce((acc, curr) => acc + curr.orders, 0);
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return [
      {
        label: "Faturamento Total",
        value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        icon: <DollarSign size={20} />,
        color: "bg-emerald-500",
        trend: "+12.5%",
        isUp: true
      },
      {
        label: "Total de Pedidos",
        value: totalOrders,
        icon: <ShoppingBag size={20} />,
        color: "bg-primary",
        trend: "+8.2%",
        isUp: true
      },
      {
        label: "Ticket Médio",
        value: avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        icon: <TrendingUp size={20} />,
        color: "bg-blue-500",
        trend: "-2.4%",
        isUp: false
      },
    ];
  }, [salesData]);

  const filteredOrders = useMemo(() => {
    return recentOrders.filter(o =>
      o.id.toString().includes(searchTerm) ||
      (o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [recentOrders, searchTerm]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <TrendingUp size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Relatório de Vendas</h1>
            </div>
            <p className="text-slate-500 font-medium">Acompanhe o desempenho do seu negócio em tempo real.</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto hide-scrollbar">
            {(['today', '7d', '30d'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  period === p ? "bg-slate-800 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p === 'today' ? 'Hoje' : p === '7d' ? '7 Dias' : '30 Dias'}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <button
              onClick={() => setShowDatePicker(true)}
              className="p-2.5 text-slate-400 hover:text-primary transition-colors"
            >
              <Calendar size={20} />
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-8 border-none shadow-sm bg-white rounded-[32px] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5", metric.color)}>
                    {metric.icon}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    metric.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {metric.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {metric.trend}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{metric.label}</p>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{metric.value}</h2>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 p-8 border-none shadow-xl bg-white rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Tendência de Faturamento</h3>
                <p className="text-sm font-medium text-slate-400">Distribuição financeira no período selecionado.</p>
              </div>
              <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                <Download size={20} />
              </button>
            </div>

            <div className="h-[350px] w-full pt-4">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '16px',
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ef4444"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm bg-white rounded-[40px] flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-800">Pedidos / Dia</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Volume Operacional</p>
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <Bar
                      dataKey="orders"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                      animationDuration={2000}
                    />
                    <XAxis dataKey="date" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#1e293b'
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                      labelStyle={{ display: 'none' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-slate-100 mt-8">
              <div className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Status Médio</p>
                  <p className="text-xl font-black text-slate-800">94% Eficiência</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Pedidos Recentes</h3>
                <p className="text-sm font-medium text-slate-400">Detalhamento das últimas transações.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 placeholder:text-slate-300 w-full focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all shrink-0">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="md:hidden divide-y divide-slate-50">
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-400 font-bold">Nenhum pedido encontrado.</p>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-black text-slate-800 text-sm">#{order.id}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')} • {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight",
                      order.status === 'delivered' || order.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                        order.status === 'pending' ? "bg-amber-50 text-amber-600" :
                          "bg-slate-50 text-slate-500"
                    )}>
                      {order.status === 'delivered' || order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Processando'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[9px]">
                        {order.customer_name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{order.customer_name || 'Usuário App'}</span>
                    </div>
                    <span className="font-black text-slate-800 text-sm">
                      {order.total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Pedido</th>
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Data / Hora</th>
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Valor</th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <ShoppingBag size={32} />
                        </div>
                        <p className="text-slate-400 font-bold">Nenhum pedido encontrado no período.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-800 text-sm">#{order.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">
                            {order.customer_name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{order.customer_name || 'Usuário App'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          order.status === 'delivered' || order.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                            order.status === 'pending' ? "bg-amber-50 text-amber-600" :
                              "bg-slate-50 text-slate-500"
                        )}>
                          {order.status === 'delivered' || order.status === 'completed' ? <CheckCircle2 size={12} /> : order.status === 'pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                          {order.status === 'delivered' || order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Processando'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="font-black text-slate-800 text-sm">
                          {order.total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">Mostrando {filteredOrders.length} pedidos recentemente capturados.</p>
              <div className="flex items-center gap-2">
                <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Anterior</button>
                <button className="px-6 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-900 transition-all shadow-lg shadow-black/10">Próximo</button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Período Personalizado</h3>
              </div>
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Data Início
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/40 focus:bg-white rounded-xl text-slate-800 font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/40 focus:bg-white rounded-xl text-slate-800 font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-sm uppercase tracking-wider transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (customStartDate && customEndDate) {
                    // Here we would filter by custom dates
                    setPeriod('7d'); // Reset to default for now
                    setShowDatePicker(false);
                    // TODO: Implement custom date filtering
                  }
                }}
                disabled={!customStartDate || !customEndDate}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
