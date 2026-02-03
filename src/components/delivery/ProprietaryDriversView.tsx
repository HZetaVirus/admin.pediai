"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  UserRound, 
  Bike, 
  Activity, 
  MapPin, 
  Navigation2, 
  X, 
  Maximize2,
  Navigation,
  Send
} from "lucide-react";
import { MOCK_INTERNAL_DRIVERS } from "@/lib/delivery-constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Mocks ---

interface Message {
    id: string;
    sender: 'user' | 'driver';
    text: string;
    timestamp: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {};

// --- Stylized Map Components ---

const TeamMiniMap = () => (
  <div className="w-full h-full bg-slate-100 relative overflow-hidden flex items-center justify-center group/map">
    <div className="absolute inset-0 opacity-20" 
         style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    
    <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-4 bg-white/40 -translate-y-1/2" />
        <div className="absolute top-0 left-1/3 w-4 h-full bg-white/40" />
        <div className="absolute top-0 right-1/4 w-4 h-full bg-white/40 rotate-12" />
    </div>

    {MOCK_INTERNAL_DRIVERS.map((driver, idx) => (
      <motion.div
        key={`mini-map-driver-${driver.id}`}
        initial={{ x: (idx - 1) * 30, y: (idx - 1) * 20 }}
        animate={{ 
          x: [(idx - 1) * 30, (idx - 1) * 30 + 10, (idx - 1) * 30 - 5, (idx - 1) * 30],
          y: [(idx - 1) * 20, (idx - 1) * 20 - 10, (idx - 1) * 20 + 5, (idx - 1) * 20]
        }}
        transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20"
      >
        <div className="relative">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-slate-800 text-[8px] font-black text-white rounded-full whitespace-nowrap opacity-0 group-hover/map:opacity-100 transition-opacity">
                {driver.name.split(' ')[0]}
            </div>
        </div>
      </motion.div>
    ))}

    <div className="relative z-30 flex flex-col items-center gap-2 text-center px-4">
      <div className="w-10 h-10 bg-primary/20 backdrop-blur-md text-primary rounded-full flex items-center justify-center shadow-xl">
        <Navigation size={20} className="animate-pulse" />
      </div>
      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg text-slate-700">Frota Ativa</span>
    </div>
  </div>
);

const DriverDetailMap = ({ driver }: { driver: any }) => (
  <div className="w-full h-full bg-slate-900 relative overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
    <div className="absolute inset-0 opacity-10" 
         style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-8 bg-slate-800/50" />
        <div className="absolute top-0 left-1/2 w-8 h-full bg-slate-800/50" />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/20" />
    </div>

    <motion.div 
      animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
    >
      <div className="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">
        <Bike size={24} />
      </div>
      <div className="w-3 h-3 bg-primary/20 rounded-full blur-xl mt-2 animate-ping" />
      
      <div className="mt-4 px-4 py-2 bg-white rounded-2xl shadow-2xl border border-slate-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Localização Atual</p>
        <p className="text-sm font-black text-slate-800">{driver.name}</p>
      </div>
    </motion.div>

    <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-40">
        <motion.path
            d="M 0 300 Q 150 150 300 300 T 600 300"
            fill="transparent"
            stroke="white"
            strokeWidth="4"
            strokeDasharray="10 10"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </svg>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-slate-800/80 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-white/10 flex items-center gap-4 text-white">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={`pending-order-icon-prop-${i}`} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-slate-800 flex items-center justify-center">
                        <UserRound size={12} className="text-primary" />
                    </div>
                ))}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pedidos na Caixa</p>
                <p className="text-sm font-bold">{driver.activeOrders} entregas pendentes</p>
            </div>
        </div>
    </div>
  </div>
);

// --- Chat Component ---

const DriverChat = ({ driverId }: { driverId: string }) => {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES[driverId] || []);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText("");

        // Mock Driver Reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'driver',
                text: "Entendido! Estou a caminho.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Chat Direto</span>
            </div>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-0"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={`msg-${msg.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "flex flex-col max-w-[90%]",
                            msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                        )}
                    >
                        <div className={cn(
                            "px-3 py-2 rounded-2xl text-[11px] font-medium shadow-xs",
                            msg.sender === 'user' 
                                ? "bg-primary text-white rounded-tr-none" 
                                : "bg-white text-slate-700 border border-slate-50 rounded-tl-none"
                        )}>
                            {msg.text}
                        </div>
                        <span className="text-[8px] font-bold text-slate-300 uppercase mt-0.5 px-1">
                            {msg.timestamp}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="pt-1">
                <div className="relative">
                    <input 
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Enviar mensagem..."
                        className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-4 pr-12 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-xs"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export function ProprietaryDriversView() {
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_INTERNAL_DRIVERS.map((driver) => (
          <Card key={`proprietary-card-${driver.id}`} className="p-6 border-none shadow-sm bg-white rounded-[32px] space-y-6 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <UserRound size={32} />
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                driver.status === 'online' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", driver.status === 'online' ? "bg-emerald-500 animate-pulse" : "bg-orange-500")} />
                {driver.status === 'online' ? 'Em Rota' : 'Ocupado'}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">{driver.name}</h4>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <Bike size={14} /> {driver.vehicle} • {driver.plate}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">Pedidos Atuais</p>
                <p className="text-lg font-black text-slate-700">{driver.activeOrders}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">Total Global</p>
                <p className="text-lg font-black text-slate-400">{driver.totalOrders}</p>
              </div>
            </div>

            <button 
                onClick={() => setSelectedDriver(driver)}
                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
            >
              <MapPin size={14} />
              Ver no Mapa
            </button>
          </Card>
        ))}
      </div>

      {/* Stats Summary with Mini Map */}
      <Card className="p-8 border-none shadow-sm bg-white rounded-[40px] border border-slate-50 overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-between h-full relative z-10">
          <div className="space-y-8 flex-1 py-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Activity size={20} />
                </div>
                Resumo da Equipe
              </h3>
              <p className="text-slate-500 font-medium">Equipe em campo com monitoramento redundante via GPS.</p>
            </div>
            
            <div className="flex gap-16">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Ativos Agora</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">04</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Taxas do Dia</p>
                <p className="text-4xl font-black text-emerald-600 tracking-tighter">R$ 452,00</p>
              </div>
            </div>

            <div className="pt-2">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Em entrega</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> Aguardando Coleta</span>
                </div>
            </div>
          </div>

          <div className="w-full md:w-[450px] shrink-0 h-[280px] md:h-auto rounded-[32px] overflow-hidden border-4 border-white shadow-2xl relative">
            <TeamMiniMap />
            <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl text-slate-400 hover:text-primary shadow-sm hover:rotate-90 transition-all">
                <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </Card>

      {/* Driver Detail Modal Overlay */}
      <AnimatePresence>
        {selectedDriver && (
            <motion.div
              key="proprietary-driver-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
              onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedDriver(null);
              }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-5xl h-[700px] border-none bg-white rounded-[48px] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedDriver(null)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-primary z-50 transition-all hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                    
                    {/* Modal Detail & Chat Side */}
                    <div className="w-full md:w-[380px] p-10 border-r border-slate-50 flex flex-col min-h-0 bg-slate-50/30">
                        <div className="space-y-8 flex-1 flex flex-col min-h-0">
                            {/* Driver Profile Info (Restored) */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl flex items-center justify-center text-primary border-2 border-primary/5">
                                        <UserRound size={40} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{selectedDriver.name}</h3>
                                        <p className="text-slate-500 font-medium text-xs">Entregador Proprietário</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-50/50">
                                            <Bike size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Veículo</p>
                                            <p className="text-xs font-bold text-slate-700">{selectedDriver.vehicle} • {selectedDriver.plate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-50/50">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Status Global</p>
                                            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                                Eficiência Alta 
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Compact Chat Section */}
                            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[32px] p-6 border border-white shadow-inner flex flex-col min-h-0">
                                <DriverChat driverId={selectedDriver.id} />
                            </div>
                        </div>
                    </div>

                    {/* Modal Map Side */}
                    <div className="flex-1 p-8 bg-white flex flex-col">
                        <div className="flex-1 rounded-[40px] overflow-hidden relative shadow-2xl flex items-center justify-center border border-slate-50">
                            <DriverDetailMap driver={selectedDriver} />
                        </div>
                        <div className="mt-8 flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PediAi Fleet Tracker Ativo</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                 <Navigation2 size={12} className="text-primary" />
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lat: -23.550 | Log: -46.633</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
