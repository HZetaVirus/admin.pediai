"use client";

import React from "react";
import { Order } from "@/services/orderService";
import { X, User, Phone, MapPin, CreditCard, Package, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
}

export function OrderDetailModal({ order, onClose, onStatusChange }: OrderDetailModalProps) {
  if (!order) return null;

  const timeElapsed = formatDistanceToNow(new Date(order.created_at || new Date()), {
    locale: ptBR,
    addSuffix: true,
  });

  const deliveryAddress = order.delivery_address as { address?: string; complement?: string; district?: string; city?: string } | null;
  const fullAddress = deliveryAddress?.address
    ? `${deliveryAddress.address}${deliveryAddress.complement ? ', ' + deliveryAddress.complement : ''}, ${deliveryAddress.district || ''} - ${deliveryAddress.city || ''}`
    : "Retirada no local";

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: "Aceitar Pedido", nextStatus: 'preparing', color: "bg-blue-500 hover:bg-blue-600" };
      case 'preparing':
        return { label: "Despachar", nextStatus: 'out_for_delivery', color: "bg-purple-500 hover:bg-purple-600" };
      case 'out_for_delivery':
      case 'shipped':
        return { label: "Finalizar", nextStatus: 'delivered', color: "bg-green-500 hover:bg-green-600" };
      default:
        return null;
    }
  };

  const statusAction = getStatusActions(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-100 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Pedido #{order.id}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
              <Clock size={14} />
              {timeElapsed}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</h3>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{order.profiles?.full_name || "Cliente"}</h4>
                {order.profiles?.phone && (
                  <a
                    href={`https://wa.me/55${order.profiles.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                  >
                    <Phone size={14} />
                    {order.profiles.phone}
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryAddress?.address && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Endereço de Entrega</h3>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{fullAddress}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                    >
                      Abrir no Google Maps
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                      <Package size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.products?.name}</h4>
                      <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.unit_price || 0) * (item.quantity || 0))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pagamento</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                  <CreditCard size={18} />
                </div>
                <span className="font-medium text-slate-700 capitalize">{order.payment_method || "Não informado"}</span>
              </div>
              <span className="text-2xl font-black text-slate-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {statusAction && (
          <div className="sticky bottom-0 p-6 border-t border-slate-100 bg-white rounded-b-3xl">
            <button
              onClick={() => {
                onStatusChange(statusAction.nextStatus);
                onClose();
              }}
              className={`w-full py-4 ${statusAction.color} text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wider`}
            >
              {statusAction.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
