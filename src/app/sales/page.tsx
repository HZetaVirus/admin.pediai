import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function SalesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-12 border-none shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Relatórios de Vendas</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Acompanhe seu desempenho financeiro com gráficos e relatórios detalhados. Em desenvolvimento.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
