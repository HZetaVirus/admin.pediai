"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Monitor size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recurso Premium Desktop</h2>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            Por segurança e melhor experiência, as funções de WhatsApp e Campanhas estão disponíveis apenas na versão para computador.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl text-slate-400 font-bold text-sm">
          <Smartphone size={18} /> Abaixo de 1024px
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
