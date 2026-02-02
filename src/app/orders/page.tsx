import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function OrdersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-12 border-none shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ClipboardList size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gerenciamento de Pedidos</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Aqui você poderá visualizar e gerenciar todos os pedidos em tempo real. Esta página está sendo preparada para você!
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
