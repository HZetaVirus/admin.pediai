"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { PlayCircle, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const tutorials = [
  {
    title: "Como gerenciar seus pedidos",
    duration: "3:45",
    category: "Operacional",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Configurando seu cardápio digital",
    duration: "5:20",
    category: "Configuração",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Análise de relatórios de venda",
    duration: "4:15",
    category: "Financeiro",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Cadastro de categorias e opcionais",
    duration: "2:50",
    category: "Configuração",
    thumbnail: "https://images.unsplash.com/photo-1522071823991-b967d120cc50?q=80&w=600&auto=format&fit=crop",
  }
];

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSupportClick = () => {
    window.open("https://wa.me/5500000000000", "_blank");
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tutoriais em Vídeo</h1>
            <p className="text-slate-500 mt-1">Aprenda a dominar todas as ferramentas da plataforma.</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar tutorial..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Tutorial Item Rendering */}
              <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white">
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <PlayCircle size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {tutorial.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                    {tutorial.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <BookOpen size={14} />
                      <span>Material de apoio</span>
                    </div>
                    <div className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                      Assistir agora
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
            <PlayCircle size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">Ainda tem dúvidas?</h2>
            <p className="text-slate-600">Nossa equipe de suporte está pronta para te ajudar via WhatsApp.</p>
          </div>
          <button 
            onClick={handleSupportClick}
            className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
          >
            Falar com Suporte
          </button>
        </section>
      </div>
    </AppLayout>
  );
}
