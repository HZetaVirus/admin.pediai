"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  Bell, 
  Settings2, 
  Info, 
  Edit3, 
  Save, 
  Plus, 
  Minus,
  CheckCircle2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BroadcastViewProps {
  type: "negotiate" | "bulk_call";
  onSuccess?: () => void;
}

export function BroadcastView({ type, onSuccess }: BroadcastViewProps) {
  const isNegotiate = type === "negotiate";
  
  // State for interactivity
  const [template, setTemplate] = useState(isNegotiate 
    ? "Olá! Temos uma entrega disponível saindo de {loja}. Valor: R$ {valor}. Destino: {bairro}. Aceita?" 
    : "⚠️ URGENTE: Precisamos de entregadores agora no {loja}. Vários pedidos prontos para saída!"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [radius, setRadius] = useState(0.1);
  const [priority, setPriority] = useState<"Baixa" | "Média" | "Alta">("Alta");
  const [isDispatching, setIsDispatching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => textAreaRef.current?.focus(), 100);
    } else {
      setIsEditing(false);
    }
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    // Simulate API call
    setTimeout(() => {
      setIsDispatching(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 800);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="space-y-4 text-center">
        <div className={cn(
          "w-20 h-20 rounded-[32px] mx-auto flex items-center justify-center text-white shadow-xl mb-6 transition-transform hover:scale-110 duration-300",
          isNegotiate ? "bg-blue-500 shadow-blue-200" : "bg-orange-500 shadow-orange-200"
        )}>
          {isNegotiate ? <MessageSquare size={32} /> : <Bell size={32} />}
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {isNegotiate ? "Nova Negociação" : "Chamada de Emergência"}
        </h2>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          {isNegotiate 
            ? "Envie uma proposta de entrega para os entregadores disponíveis na sua região." 
            : "Chame imediatamente entregadores próximos para carregar pedidos pendentes."}
        </p>
      </div>

      <Card className="p-10 border-none shadow-2xl bg-white rounded-[48px] space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        
        {/* Template Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Mensagem Pré-configurada</label>
            <button 
              onClick={handleEditToggle}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                isEditing ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100 hover:text-primary"
              )}
            >
              {isEditing ? <><Save size={12} /> Salvar</> : <><Edit3 size={12} /> Editar Template</>}
            </button>
          </div>
          
          <div className="relative group">
            <textarea 
              ref={textAreaRef}
              readOnly={!isEditing}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className={cn(
                "w-full min-h-[160px] p-8 border-none rounded-[32px] text-slate-700 font-medium leading-relaxed transition-all resize-none shadow-inner",
                isEditing ? "bg-white ring-2 ring-primary/20" : "bg-slate-50 cursor-default"
              )}
            />
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radius Selector */}
          <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4 group hover:bg-white transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Info size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Raio de Alcance</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setRadius(Math.max(0.1, radius - 0.1))} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-primary shadow-sm border border-slate-100"><Minus size={14} /></button>
                <button onClick={() => setRadius(radius + 0.1)} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-primary shadow-sm border border-slate-100"><Plus size={14} /></button>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-800">{radius.toFixed(1)}</p>
              <p className="text-lg font-bold text-slate-400">km</p>
            </div>
            <p className="text-xs text-slate-400 font-medium">~ {Math.round(radius * 120)} entregadores na área</p>
          </div>
          
          {/* Priority Selector */}
          <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4 group hover:bg-white transition-all">
            <div className="flex items-center gap-2 text-primary">
              <Settings2 size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Prioridade</p>
            </div>
            <div className="flex gap-2">
              {(["Baixa", "Média", "Alta"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    priority === p 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Zap size={12} className={priority === 'Alta' ? "text-orange-500" : "text-slate-300"} />
              {priority === 'Alta' ? 'Máxima velocidade de entrega' : 'Fila de despacho normal'}
            </p>
          </div>
        </div>

        {/* Dispatch Button */}
        <button 
          onClick={handleDispatch}
          disabled={isDispatching || showSuccess}
          className={cn(
            "w-full py-6 rounded-[28px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 group relative overflow-hidden",
            showSuccess 
              ? "bg-emerald-500 text-white shadow-emerald-200" 
              : "bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          )}
        >
          {isDispatching ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : showSuccess ? (
            <><CheckCircle2 size={20} /> Chamada Enviada!</>
          ) : (
            <>
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              Disparar Chamada via App Pediai
            </>
          )}
        </button>
      </Card>
      
      <div className="flex items-center justify-center gap-2 text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <p className="text-[10px] font-black uppercase tracking-widest">Serviço de Mensageria Pediai Online</p>
      </div>
    </div>
  );
}
