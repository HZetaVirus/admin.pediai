"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Settings as SettingsIcon,
  LayoutDashboard,
  UtensilsCrossed,
  Bell,
  Menu,
  X,
  ClipboardList,
  Folder,
  ListPlus,
  Bike,
  LogOut,
  ChevronRight,
  PlayCircle,
  MessageCircle,
  Megaphone,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarSectionItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  desktopOnly?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, href, active, onClick }: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 group relative",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className={cn(
        "transition-transform duration-200",
        active ? "scale-110" : "group-hover:scale-110"
      )}>
        {icon}
      </div>
      <span className="text-[15px]">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto"
        >
          <ChevronRight size={16} className="text-white/70" />
        </motion.div>
      )}
    </Link>
  );
};

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="pt-6 pb-2">
    <p className="px-4 mb-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
      {title}
    </p>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const pathname = usePathname();

  // Check Auth
  useEffect(() => {
    if (pathname !== '/login') {
      const authenticated = authService.isAuthenticated();
      if (!authenticated) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    toast.promise(authService.signOut(), {
      loading: 'Saindo...',
      success: 'Até logo!',
      error: 'Erro ao sair'
    });
  };

  const sections: { title: string, items: SidebarSectionItem[] }[] = [
    {
      title: "PRINCIPAL",
      items: [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
        { icon: <ClipboardList size={20} />, label: "Pedidos", href: "/orders" },
        { icon: <UtensilsCrossed size={20} />, label: "Cardápio", href: "/menu" },
        { icon: <Folder size={20} />, label: "Categorias", href: "/categories" },
        { icon: <ListPlus size={20} />, label: "Opcionais", href: "/options" },
        { icon: <MessageCircle size={20} />, label: "WhatsApp", href: "/whatsapp", desktopOnly: true },
        { icon: <Megaphone size={20} />, label: "Campanhas", href: "/whatsapp/campaigns", desktopOnly: true },
        { icon: <Bike size={20} />, label: "Entregadores", href: "/delivery" },
      ]
    },
    {
      title: "RELATÓRIOS",
      items: [
        { icon: <TrendingUp size={20} />, label: "Vendas", href: "/sales" },
        { icon: <Users size={20} />, label: "Clientes", href: "/customers" },
        { icon: <TrendingUp size={20} />, label: "Análise de CMV", href: "/reports/cmv" },
      ]
    },
    {
      title: "SISTEMA",
      items: [
        { icon: <SettingsIcon size={20} />, label: "Configurações", href: "/settings" },
        { icon: <PlayCircle size={20} />, label: "Tutoriais", href: "/tutorials" },
        { icon: <LogOut size={20} />, label: "Sair", href: "#", onClick: handleLogout },
      ]
    }
  ];

  const currentPageLabel = sections
    .flatMap(s => s.items)
    .find(item => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex min-h-screen bg-white md:bg-slate-50/50">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 ring-4 ring-slate-50">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tighter leading-none uppercase">
                INDIOS <span className="text-primary tracking-normal">BURGU...</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PAINEL ADMIN</p>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-2 overflow-y-auto hide-scrollbar space-y-1">
          {sections.map((section) => (
            <SidebarSection key={section.title} title={section.title}>
              {section.items.map((item: SidebarSectionItem) => (
                <div key={item.label} className={cn(item.desktopOnly && "hidden lg:block")}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group relative"
                    >
                      <div className="group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[15px]">{item.label}</span>
                    </button>
                  ) : (
                    <SidebarItem 
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={pathname === item.href}
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  )}
                </div>
              ))}
            </SidebarSection>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mb-safe hidden md:block">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plano Atual</p>
            <p className="text-sm font-bold text-slate-800 mb-2">Período de Teste</p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
            </div>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              ASSINAR AGORA
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Responsive Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-shadow">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 line-clamp-1">
              {currentPageLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => alert("Você não tem novas notificações no momento.")}
              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative group"
            >
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            <button 
              onClick={() => alert("Perfil do Parceiro: Indios Burguer")}
              className="flex items-center gap-3 pl-1 hover:bg-slate-50 p-1.5 rounded-2xl transition-all group"
            >
              <span className="text-sm font-bold text-slate-700 hidden sm:block group-hover:text-primary transition-colors">Parceiro PediAi</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 ring-2 ring-white group-hover:scale-105 transition-transform">
                JD
              </div>
            </button>
          </div>
        </header>

        {/* Page Content with Animation */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {isCheckingAuth && pathname !== '/login' ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
