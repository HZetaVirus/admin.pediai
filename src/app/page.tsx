import { Card } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6 md:space-y-8 pb-safe">
        {/* Dashboard Title */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-slate-500">Visão geral do seu negócio</p>
        </div>

        {/* Stats Grid - Matching Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            label="Vendas Hoje" 
            value="R$ 0,00" 
            icon={<DollarSign size={22} className="text-green-600" />} 
            color="bg-green-100"
          />
          <StatCard 
            label="Pedidos Hoje" 
            value="0" 
            icon={<ShoppingBag size={22} className="text-blue-600" />} 
            color="bg-blue-100"
          />
          <StatCard 
            label="Ticket Médio" 
            value="R$ 0,00" 
            icon={<TrendingUp size={22} className="text-purple-600" />} 
            color="bg-purple-100"
          />
          <StatCard 
            label="Pedidos Pendentes" 
            value="0" 
            icon={<Clock size={22} className="text-orange-600" />} 
            color="bg-orange-100"
          />
        </div>

        {/* Charts & Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 border-none shadow-sm h-[350px] relative overflow-hidden group">
            <h4 className="text-lg font-bold text-slate-800 mb-8">Vendas dos Últimos 7 Dias</h4>
            <div className="absolute inset-x-0 bottom-0 top-20 flex items-center justify-center">
              <div className="flex flex-col items-center opacity-40 group-hover:opacity-60 transition-opacity">
                <TrendingUp size={48} className="text-slate-200 mb-2" />
                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Aguardando dados...</p>
              </div>
              {/* Mock chart baseline */}
              <div className="absolute bottom-12 left-8 right-8 h-px bg-slate-100" />
              <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Quinta</span>
                <span>Sexta</span>
                <span>Sábado</span>
                <span>Domingo</span>
                <span>Segunda</span>
                <span>Terça</span>
                <span>Quarta</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm h-[350px] flex flex-col">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Pedidos por Status</h4>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm font-bold text-slate-400">Nenhum dado disponível</p>
            </div>
          </Card>
        </div>

        {/* Bottom Section: Recent Orders & Top Selling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 border-none shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6">Últimos Pedidos</h4>
            <div className="h-40 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ClipboardList size={24} />
              </div>
              <p className="text-sm font-bold text-slate-400">Nenhum pedido ainda</p>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={18} className="text-slate-800" />
                <h4 className="text-lg font-bold text-slate-800">Mais Vendidos</h4>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-400">Nenhum dado disponível</p>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total de Clientes</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tight">0</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ label, value, icon, color }: { 
  label: string, 
  value: string, 
  icon: React.ReactNode,
  color: string
}) {
  return (
    <Card className="p-6 border-none shadow-sm group hover:shadow-md transition-all duration-300 active:scale-[0.98]">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:-translate-y-1", color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function ClipboardList({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
