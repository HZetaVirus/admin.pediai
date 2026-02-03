"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Order } from "@/services/orderService";
import { Clock, MapPin, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const timeElapsed = formatDistanceToNow(new Date(order.created_at), {
    locale: ptBR,
    addSuffix: true,
  });

  const statusColor = {
    1: "bg-yellow-100 text-yellow-700 border-yellow-200", // Pendente
    2: "bg-blue-100 text-blue-700 border-blue-200", // Em Preparo
    3: "bg-purple-100 text-purple-700 border-purple-200", // A Caminho
    4: "bg-green-100 text-green-700 border-green-200", // Concluído
    5: "bg-red-100 text-red-700 border-red-200", // Cancelado
  }[order.status_id || 1] || "bg-slate-100 text-slate-700";

  return (
    <div 
      onClick={() => onClick(order)}
      className="group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${statusColor.split(' ')[0].replace('-100', '-500')}`}></div>
      
      <div className="flex justify-between items-start mb-3 pl-2">
        <div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">#{order.id}</span>
          <h3 className="font-bold text-slate-800 truncate max-w-[150px] flex items-center gap-1">
            <User size={14} className="text-slate-400" />
            {order.profiles?.full_name || "Cliente"}
          </h3>
        </div>
        <Badge variant="outline" className={`${statusColor} font-bold text-[10px] uppercase tracking-wider border`}>
          {order.order_statuses?.name}
        </Badge>
      </div>

      <div className="space-y-2 pl-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={14} />
          <span>{timeElapsed}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={14} />
          <span className="truncate max-w-[180px]">
            {order.tracking_data ? (order.tracking_data as any).address : "Retirada"}
          </span>
        </div>
      </div>

      <div className="pl-2 pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="font-black text-primary">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
