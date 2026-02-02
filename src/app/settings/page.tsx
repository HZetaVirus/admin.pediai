import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-12 border-none shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Settings size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configurações do Sistema</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Ajuste as configurações da sua loja, horário de funcionamento e perfil. Funcionalidade chegando.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
