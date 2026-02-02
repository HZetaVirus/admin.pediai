import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-12 border-none shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Base de Clientes</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Conheça quem compra com você. Lista de clientes e histórico de pedidos em breve.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
