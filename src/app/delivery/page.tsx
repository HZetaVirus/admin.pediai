import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Bike } from "lucide-react";

export default function DeliveryPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-12 border-none shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bike size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Entregadores</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Gerencie sua equipe de entrega e acompanhe os status de envio. Funcionalidade vindo aí!
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
