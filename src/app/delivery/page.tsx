"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Bike, 
  History, 
  Plus, 
  ArrowRight,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DELIVERY_OPTIONS } from "@/lib/delivery-constants";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProprietaryDriversView } from "@/components/delivery/ProprietaryDriversView";
import { BroadcastView } from "@/components/delivery/BroadcastView";
import { PartnerDriversView } from "@/components/delivery/PartnerDriversView";
import { DeliveryHistoryView } from "@/components/delivery/DeliveryHistoryView";
import { NewDriverView } from "@/components/delivery/NewDriverView";

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "proprietary":
        return <ProprietaryDriversView />;
      case "negotiate":
      case "bulk_call":
        return <BroadcastView type={activeTab} onSuccess={() => setActiveTab(null)} />;
      case "partners":
        return <PartnerDriversView />;
      case "history":
        return <DeliveryHistoryView />;
      case "new":
        return <NewDriverView onSuccess={() => setActiveTab(null)} />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DELIVERY_OPTIONS.map((option, idx) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className={cn(
                    "group relative p-8 border-none shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden rounded-[32px] bg-white h-full",
                    activeTab === option.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setActiveTab(option.id)}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <option.icon size={120} />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", option.color)}>
                      <option.icon size={28} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {option.title}
                        <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                        {option.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                        <p className="text-xs font-bold text-slate-600">Disponível</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Configuração</p>
                        <p className="text-xs font-bold text-primary">Ajustar automático</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'history') return "Histórico de Entregas";
    if (activeTab === 'new') return "Cadastrar Entregador";
    return activeTab ? DELIVERY_OPTIONS.find(o => o.id === activeTab)?.title : "Entregadores";
  };

  const getHeaderDescription = () => {
    if (activeTab === 'history') return "Visualize o registro completo de todas as entregas realizadas.";
    if (activeTab === 'new') return "Adicione novos membros à sua equipe de entregadores proprietários ou parceiros.";
    return activeTab 
      ? DELIVERY_OPTIONS.find(o => o.id === activeTab)?.description
      : "Escolha o modo de operação e gerencie sua frota em tempo real.";
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                <Bike size={12} />
                Gestão de Logística
              </div>
              <div className="flex items-center gap-4">
                {activeTab && (
                  <button 
                    onClick={() => setActiveTab(null)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                  {getHeaderTitle()}
                </h1>
              </div>
              <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[600px]">
                {getHeaderDescription()}
              </p>
            </div>

            {!activeTab && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <History size={16} />
                  Histórico
                </button>
                <button 
                  onClick={() => setActiveTab('new')}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={16} />
                  Novo Entregador
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab || "main"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {!activeTab && (
            <Card className="p-8 border-none shadow-sm bg-slate-800 rounded-[32px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-white">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Desempenho Geral</h4>
                    <p className="text-slate-400 text-sm">Visão consolidada da sua logística</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Entregas Hoje</p>
                    <p className="text-3xl font-black">24</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Tempo Médio</p>
                    <p className="text-3xl font-black">18 min</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
    </AppLayout>
  );
}
