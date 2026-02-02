"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Users,
  Download,
  MoreVertical,
  MessageCircle,
  Smartphone,
  UserPlus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { whatsappService } from "@/services/whatsappService";

type Customer = Database["public"]["Tables"]["customers"]["Row"];

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState<string | null>(null);
  const [store, setStore] = React.useState<Database["public"]["Tables"]["stores"]["Row"] | null>(null);
  const [syncing, setSyncing] = React.useState(false);

  const fetchCustomers = React.useCallback(async (storeId: number) => {
    setLoading(true);
    try {
      let query = supabase
        .from('customers')
        .select('*')
        .eq('store_id', storeId)
        .order('last_interaction', { ascending: false });

      if (sourceFilter) {
        query = query.eq('source', sourceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  }, [sourceFilter]);

  React.useEffect(() => {
    async function fetchStore() {
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .single();
      
      if (storeData) {
        setStore(storeData);
        fetchCustomers(storeData.id);
      } else {
        setLoading(false);
      }
    }
    fetchStore();
  }, [fetchCustomers]);

  const handleSyncWhatsApp = async () => {
    if (!store) return;
    setSyncing(true);
    try {
      // 1. Check WhatsApp connection
      const status = await whatsappService.getInstanceStatus();
      if (status !== 'open') {
        alert("O WhatsApp precisa estar conectado para sincronizar contatos.");
        setSyncing(false);
        return;
      }

      // 2. Fetch chats from Evolution API
      const chats = await whatsappService.getChats();
      console.log(`Found ${chats.length} chats`);

      let newCount = 0;
      let updateCount = 0;

      // 3. Process each chat
      for (const chat of chats) {
        const remoteJid = chat.remoteJid || chat.id;
        if (!remoteJid || remoteJid.includes('@g.us')) continue; // Skip groups
        
        const phone = remoteJid.split('@')[0];
        const name = chat.pushName || chat.name || phone;

        // Check if customer exists
        const { data: existing } = await supabase
          .from('customers')
          .select('id')
          .eq('store_id', store.id)
          .eq('phone', phone)
          .single();

        if (existing) {
            // Optional: Update last interaction or name if cleaner
            // For now, we assume user might have edited the name, so we don't overwrite unless empty
            updateCount++;
        } else {
          // Insert new customer
          const { error: insertError } = await supabase
            .from('customers')
            .insert({
               store_id: store.id,
               full_name: name,
               phone: phone,
               source: 'whatsapp',
               last_interaction: new Date().toISOString(), // Use current time as proxy for last known interaction if chat has no timestamp
               total_orders: 0,
               total_spent: 0
            });
          
          if (!insertError) newCount++;
        }
      }

      alert(`Sincronização concluída!\nNovos contatos: ${newCount}\nAtualizados: ${updateCount}`);
      fetchCustomers(store.id);

    } catch (err) {
      console.error("Sync error:", err);
      alert("Erro ao sincronizar contatos.");
    } finally {
      setSyncing(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.phone?.includes(searchQuery))
  );

  const getSourceIcon = (source: string | null) => {
    switch (source) {
      case 'whatsapp': return <MessageCircle size={16} className="text-green-500" />;
      case 'app_menu': return <Smartphone size={16} className="text-primary" />;
      default: return <Users size={16} className="text-slate-400" />;
    }
  };

  return (
    <AppLayout>
       <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Base de Clientes</h1>
            <p className="text-slate-500 mt-2 font-medium">Gerencie seus contatos do WhatsApp e App em um só lugar.</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleSyncWhatsApp}
              disabled={syncing || !store}
              className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-bold rounded-2xl border border-green-100 hover:bg-green-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download size={18} className={syncing ? "animate-bounce" : ""} />
              {syncing ? "Sincronizando..." : "Importar do WhatsApp"}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              <UserPlus size={18} />
              Novo Cliente
            </button>
          </div>
        </header>

        <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
          {/* Filters & Search */}
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou telefone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600 placeholder:text-slate-300"
                />
             </div>
             
             <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button 
                  onClick={() => setSourceFilter(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${!sourceFilter ? "bg-slate-800 text-white shadow-lg shadow-slate-200" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setSourceFilter('whatsapp')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${sourceFilter === 'whatsapp' ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-white text-slate-400 border border-slate-100 hover:bg-green-50 hover:text-green-600"}`}
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
                <button 
                   onClick={() => setSourceFilter('app_menu')}
                   className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${sourceFilter === 'app_menu' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-400 border border-slate-100 hover:bg-red-50 hover:text-primary"}`}
                >
                  <Smartphone size={14} /> App / Menu
                </button>
             </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-5 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
            <div className="col-span-4 text-left pl-4">Cliente</div>
            <div className="col-span-3">Origem</div>
            <div className="col-span-2">Pedidos</div>
            <div className="col-span-2">Gasto Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-50">
            {loading ? (
               <div className="p-12 text-center text-slate-400 text-sm font-medium">Carregando clientes...</div>
            ) : filteredCustomers.length === 0 ? (
               <div className="p-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                    <Users size={32} />
                  </div>
                  <p className="text-slate-800 font-bold">Nenhum cliente encontrado</p>
                  <p className="text-slate-400 text-sm">Tente sincronizar com o WhatsApp ou ajustar os filtros.</p>
               </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/50 transition-colors group">
                  <div className="col-span-4 pl-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm">
                      {customer.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700">{customer.full_name || "Sem nome"}</h3>
                      <p className="text-xs text-slate-400 font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      customer.source === 'whatsapp' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      customer.source === 'app_menu' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {getSourceIcon(customer.source)}
                      {customer.source === 'whatsapp' ? 'WhatsApp' : customer.source === 'app_menu' ? 'App' : 'Manual'}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-slate-600">
                    {customer.total_orders || 0}
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.total_spent || 0)}
                  </div>
                  <div className="col-span-1 flex justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer Pagination (Visual only for now) */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
            <p>Mostrando {filteredCustomers.length} clientes</p>
            <div className="flex gap-2">
               <button disabled className="px-4 py-2 bg-slate-50 rounded-xl opacity-50 cursor-not-allowed">Anterior</button>
               <button disabled className="px-4 py-2 bg-slate-50 rounded-xl opacity-50 cursor-not-allowed">Próxima</button>
            </div>
          </div>
        </Card>
       </div>
    </AppLayout>
  );
}
