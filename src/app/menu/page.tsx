"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Copy, 
  ExternalLink, 
  Pencil, 
  Trash2,
  UtensilsCrossed,
  ArrowLeft,
  Camera,
  Upload
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Store = Database["public"]["Tables"]["stores"]["Row"];

const categories = [
  { label: "Todos", count: 1 },
  { label: "🍔 Lanches", count: 1 },
  { label: "🥤 Bebidas", count: 0 },
  { label: "🍟 Porções", count: 0 },
  { label: "🍰 Sobremesas", count: 0 },
  { label: "📦 Combos", count: 0 },
];

const products = [
  {
    id: 1,
    name: "x-BURGUER",
    description: "ASDDDSGFSHGFHEDFAFIASFDA...",
    category: "Lanches",
    price: "R$ 27,00",
    status: "Ativo",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=150&auto=format&fit=crop",
    categoryIcon: "🍔"
  }
];

export default function MenuPage() {
  const [store, setStore] = React.useState<Store | null>(null);
  const [productsList, setProductsList] = React.useState(products);
  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const [showForm, setShowForm] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    async function fetchStore() {
      try {
        const { data } = await supabase
          .from('stores')
          .select('*')
          .single();

        if (data) {
          setStore(data);
        }
      } catch (err) {
        console.error("Error fetching store:", err);
      }
    }

    fetchStore();
  }, []);

  const menuUrl = store ? `https://pediai.netlify.app/${store.slug}` : "https://pediai.netlify.app/seu-restaurante";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    alert("Link copiado para a área de transferência!");
  };

  const handleOpenLink = () => {
    window.open(menuUrl, "_blank");
  };

  const filteredProducts = activeCategory === "Todos" 
    ? productsList 
    : productsList.filter(p => p.category === activeCategory.split(' ').slice(1).join(' '));

  if (showForm) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          <header className="flex items-center gap-4">
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Novo Produto</h1>
              <p className="text-slate-500 text-sm">Adicione um novo item ao seu cardápio</p>
            </div>
          </header>

          <Card className="p-8 border-none shadow-xl bg-white rounded-3xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome do Produto</label>
                <input type="text" placeholder="Ex: X-Salada Premium" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoria</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none">
                  {categories.slice(1).map(cat => <option key={cat.label}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço (R$)</label>
                <input type="text" placeholder="0,00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-700">Ativo</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Foto do Produto</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-48 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center text-center p-6"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
                
                {selectedImage ? (
                  <>
                    <Image 
                      src={selectedImage} 
                      alt="Preview" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <Camera size={24} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto text-slate-400 group-hover:text-primary transition-colors">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Clique para enviar uma foto</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</label>
              <textarea placeholder="Descreva os ingredientes e detalhes do prato..." rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"></textarea>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button 
                onClick={() => {
                  const newProduct = {
                    id: productsList.length + 1,
                    name: "Novo Produto",
                    description: "Descrição do novo produto",
                    category: "Lanches",
                    price: "R$ 0,00",
                    status: "Ativo",
                    image: selectedImage || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=150&auto=format&fit=crop",
                    categoryIcon: "🍔"
                  };
                  setProductsList([...productsList, newProduct]);
                  alert("Produto adicionado com sucesso!");
                  setSelectedImage(null);
                  setShowForm(false);
                }}
                className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 uppercase tracking-wider"
              >
                Salvar Produto
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cardápio</h1>
            <p className="text-slate-500 mt-1">Gerencie os produtos do seu cardápio</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Novo Produto
          </button>
        </header>

        {/* Link Cardápio Bar */}
        <Card className="p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Link do cardápio:</span>
            <div className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-sm font-medium w-full truncate">
              {menuUrl}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={handleCopyLink}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <Copy size={16} />
              Copiar
            </button>
            <button 
              onClick={handleOpenLink}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              <ExternalLink size={16} />
              Abrir
            </button>
          </div>
        </Card>

        {/* Categories Chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.label
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white border border-slate-100 text-slate-500 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat.label} ({productsList.filter(p => cat.label === "Todos" || cat.label.includes(p.category)).length})
            </button>
          ))}
        </div>

        {/* Products Table */}
        <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.table 
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-left border-collapse"
              >
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{product.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{product.categoryIcon}</span>
                          <span className="text-sm font-bold text-slate-500">{product.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-primary">{product.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black rounded-lg flex items-center gap-1.5 border border-green-100">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            {product.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                            <Pencil size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            </AnimatePresence>
          </div>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <UtensilsCrossed size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">Nenhum produto encontrado</p>
                <p className="text-sm text-slate-400">Tente selecionar outra categoria ou adicione um novo produto.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
