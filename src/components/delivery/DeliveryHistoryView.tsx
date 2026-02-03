"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Search,
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  User,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

// Empty state for delivery history
const EMPTY_HISTORY: any[] = [];

export function DeliveryHistoryView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registro de Entregas</h3>
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar entrega ou motorista..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {EMPTY_HISTORY.length > 0 ? (
          EMPTY_HISTORY.map((item) => (
            <Card key={item.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all bg-white rounded-[24px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                    item.status === 'delivered' ? "bg-emerald-50 text-emerald-500 shadow-emerald-50" : "bg-red-50 text-red-500 shadow-red-50"
                  )}>
                    {item.status === 'delivered' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.id}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.date}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{item.customer}</h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Motorista</p>
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={14} className="text-slate-400" />
                      <span className="text-sm font-bold">{item.driver}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Endereço</p>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-sm font-bold">{item.address}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Taxa</p>
                    <p className="text-sm font-black text-emerald-600">{item.amount}</p>
                  </div>

                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-50 hover:text-primary transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-800">Nenhum registro encontrado</p>
              <p className="text-sm text-slate-500 font-medium">Histórico de entregas aparecerá aqui após os primeiros pedidos.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
