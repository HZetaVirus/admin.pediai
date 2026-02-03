"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Bike, 
  Phone, 
  CreditCard, 
  Camera, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  Save,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewDriverViewProps {
  onSuccess: () => void;
}

export function NewDriverView({ onSuccess }: NewDriverViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicle: "moto",
    plate: "",
    type: "proprietary"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1 text-left">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Novo Entregador</h3>
          <p className="text-slate-500 font-medium">Cadastre um novo entregador na sua frota.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-10 border-none shadow-2xl bg-white rounded-[40px] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Personal Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informações Pessoais</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-4">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: João da Silva"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm shadow-inner"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-4">Telefone (WhatsApp)</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm shadow-inner"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Vehicle Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Truck size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Veículo e Logística</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-4">Tipo de Veículo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["moto", "bike", "car"].map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setFormData({...formData, vehicle: v})}
                        className={cn(
                          "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                          formData.vehicle === v 
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                            : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white"
                        )}
                      >
                        {v === 'moto' && 'Moto'}
                        {v === 'bike' && 'Bike'}
                        {v === 'car' && 'Carro'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-4">Placa do Veículo</label>
                  <input 
                    type="text" 
                    placeholder="ABC-1234"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm shadow-inner uppercase font-mono"
                    value={formData.plate}
                    onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Type Selection */}
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Modalidade de Trabalho</h4>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: "proprietary"})}
                  className={cn(
                    "flex-1 p-6 rounded-3xl text-left transition-all space-y-2",
                    formData.type === "proprietary" ? "bg-white shadow-xl ring-2 ring-primary/20" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <p className="text-sm font-black text-slate-800">Próprio</p>
                  <p className="text-xs text-slate-500 font-medium">Trabalha exclusivamente para seu restaurante.</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: "partner"})}
                  className={cn(
                    "flex-1 p-6 rounded-3xl text-left transition-all space-y-2",
                    formData.type === "partner" ? "bg-white shadow-xl ring-2 ring-primary/20" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <p className="text-sm font-black text-slate-800">Parceiro</p>
                  <p className="text-xs text-slate-500 font-medium">Entregador externo que atende múltiplas lojas.</p>
                </button>
              </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-primary text-white rounded-[28px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
                Cadastrar Entregador
              </>
            )}
          </button>
        </Card>
      </form>
    </div>
  );
}
