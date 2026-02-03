"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Bike, 
  Info, 
  ShieldCheck, 
  UserCheck, 
  X, 
  Star, 
  Phone, 
  Clock,
  ExternalLink,
  Navigation,
  ShoppingCart,
  MapPin,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Partner {
  id: string;
  name: string;
  photo: string;
  plate: string;
  vehicle: string;
  orderId: string;
  status: string;
  proximity: string;
  rating: number;
  totalDeliveries: number;
  phone: string;
  network: string;
}

interface OrderDetail {
    id: string;
    customer: string;
    items: { name: string; qty: number; price: number }[];
    total: number;
    payment: string;
    address: string;
}

const MOCK_ORDER_DETAILS: Record<string, OrderDetail> = {};

// --- Stylized Map for Partner ---
const PartnerRouteMap = ({ partner }: { partner: Partner }) => (
  <div className="w-full h-full bg-slate-50 relative overflow-hidden rounded-[32px] border-4 border-white shadow-inner">
    {/* Stylized Grid */}
    <div className="absolute inset-0 opacity-10" 
         style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    
    {/* Stylized "Paths" */}
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path d="M -100 200 Q 200 100 500 200 T 1000 200" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
        <path d="M 200 -100 L 200 600" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10 10" />
    </svg>

    {/* Markers */}
    <div className="absolute top-1/4 left-1/4 flex flex-col items-center group">
        <div className="w-8 h-8 bg-slate-800 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
            <span className="text-[10px] font-black">LJ</span>
        </div>
        <div className="mt-1 px-2 py-0.5 bg-slate-800 text-[8px] font-black text-white rounded-full">Sua Loja</div>
    </div>

    <motion.div 
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-2/3 flex flex-col items-center"
    >
        <div className="w-10 h-10 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">
            <Bike size={20} />
        </div>
        <div className="w-2 h-2 bg-primary/20 rounded-full blur-lg animate-ping absolute -bottom-1" />
        <div className="mt-2 px-3 py-1 bg-white rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
            <p className="text-[10px] font-black tracking-tight">{partner.proximity}</p>
        </div>
    </motion.div>

    <div className="absolute bottom-4 right-4 group">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Conexão Segura PediAi</span>
        </div>
    </div>
  </div>
);

export function PartnerDriversView() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  const mockPartners: Partner[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12 relative">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Atendimentos Externos</h3>
          <p className="text-slate-500 font-medium">Pedidos aceitos automaticamente por parceiros externos.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <ShieldCheck size={14} />
          Parceiros Verificados
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPartners.map((partner) => (
          <Card key={`partner-card-${partner.id}`} className="p-8 border-none shadow-sm hover:shadow-xl transition-all bg-white rounded-[44px] flex flex-col md:flex-row gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-primary/5 transition-colors" />
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-lg">
                <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {partner.plate}
              </div>
            </div>

            <div className="relative z-10 flex-1 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">{partner.name}</h4>
                  <UserCheck size={18} className="text-blue-500" />
                </div>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <Bike size={14} className="text-slate-400" /> {partner.vehicle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pedido</p>
                  <p className="text-sm font-black text-primary">{partner.orderId}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-black text-slate-700">{partner.status}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-xs font-bold">{partner.proximity} de distância</span>
                </div>
                <button 
                    onClick={() => setSelectedPartner(partner)}
                    className="text-primary text-xs font-black uppercase tracking-widest hover:underline hover:translate-x-1 transition-all flex items-center gap-1"
                >
                  Detalhes <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-50 border-none rounded-[32px] flex items-start gap-4 ring-1 ring-blue-100">
        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h5 className="text-sm font-black text-blue-900 tracking-tight leading-none">Otimização Automática</h5>
          <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
            Parceiros externos são acionados automaticamente quando sua frota própria está 100% ocupada ou em horários de pico.
          </p>
        </div>
      </Card>

      {/* Modals Container */}
      <AnimatePresence>
        {/* Partner Detail Modal */}
        {selectedPartner && (
            <motion.div
              key="partner-detail-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
              onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedPartner(null);
              }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-5xl h-[640px] border-none bg-white rounded-[56px] overflow-hidden shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedPartner(null)}
                        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-300 hover:text-primary z-50 transition-all hover:rotate-90 border border-slate-50"
                    >
                        <X size={24} />
                    </button>
                    
                    {/* Modal Detail Side */}
                    <div className="w-full md:w-[380px] p-10 flex flex-col justify-between bg-slate-50/50 border-r border-slate-100">
                        <div className="space-y-10">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-28 h-28 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
                                    <img src={selectedPartner.photo} alt={selectedPartner.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedPartner.name}</h3>
                                    <p className="text-primary font-black text-xs uppercase tracking-widest">{selectedPartner.network}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-orange-400">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-lg font-black">{selectedPartner.rating}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Avaliação</p>
                                </div>
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 text-center space-y-1">
                                    <p className="text-lg font-black text-slate-700">{selectedPartner.totalDeliveries}</p>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Entregas</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-50">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Contato</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedPartner.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-50">
                                        <Navigation size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Status Atual</p>
                                        <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            {selectedPartner.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setViewingOrderId(selectedPartner.orderId)}
                                className="w-full py-5 bg-slate-800 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:translate-y-[-2px] transition-all"
                            >
                                Visualizar Pedido {selectedPartner.orderId}
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Map Side */}
                    <div className="flex-1 p-10 bg-white flex flex-col">
                        <div className="flex-1 rounded-[40px] overflow-hidden relative shadow-2xl flex items-center justify-center border border-slate-50">
                            <PartnerRouteMap partner={selectedPartner} />
                        </div>
                        
                        <div className="mt-8 grid grid-cols-2 gap-10 px-4">
                            <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Ponto de Coleta</p>
                            <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-800" />
                                Sua Loja (Indios Burger)
                            </h5>
                            </div>
                            <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Destino Final</p>
                            <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Residencial Vila do Sol...
                            </h5>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}

        {/* Order Details Modal */}
        {viewingOrderId && (
            <motion.div
                key="order-details-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md"
                onClick={(e) => {
                    if (e.target === e.currentTarget) setViewingOrderId(null);
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-xl bg-white rounded-[48px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] p-8 md:p-12 flex flex-col max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Detalhes do Pedido</h3>
                            <p className="text-primary font-black text-sm uppercase tracking-widest">{viewingOrderId}</p>
                        </div>
                        <button onClick={() => setViewingOrderId(null)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-thin">
                        {MOCK_ORDER_DETAILS[viewingOrderId] && (
                            <>
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <ShoppingCart size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Itens do Pedido</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {MOCK_ORDER_DETAILS[viewingOrderId].items.map((item, idx) => (
                                            <div key={`order-item-${viewingOrderId}-${idx}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-black text-slate-400">
                                                        {item.qty}x
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700">{item.name}</p>
                                                </div>
                                                <p className="text-sm font-black text-slate-800">R$ {(item.qty * item.price).toFixed(2).replace('.', ',')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <UserCheck size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Informações do Cliente</h4>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-slate-800 text-white space-y-4 shadow-xl">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Cliente</p>
                                            <p className="text-lg font-black">{MOCK_ORDER_DETAILS[viewingOrderId].customer}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Pagamento</p>
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} className="text-emerald-400" />
                                                <p className="text-sm font-bold">{MOCK_ORDER_DETAILS[viewingOrderId].payment}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Endereço de Entrega</p>
                                            <div className="flex items-start gap-2">
                                                <MapPin size={14} className="text-primary mt-0.5" />
                                                <p className="text-sm font-medium leading-tight">{MOCK_ORDER_DETAILS[viewingOrderId].address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="p-8 rounded-[32px] bg-primary/5 border-2 border-dashed border-primary/20 text-center space-y-2">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Valor Total</p>
                                    <p className="text-4xl font-black text-slate-800 tracking-tighter">
                                        R$ {MOCK_ORDER_DETAILS[viewingOrderId].total.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
