"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Search,
  Folder,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [selectedEmoji, setSelectedEmoji] = React.useState("🍔");
  const [customEmoji, setCustomEmoji] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const emojis = ["🍔", "🍕", "🥤", "🍰", "🍟", "🌮", "🍜", "🍱", "🥗", "🍝", "☕", "🍺"];
  const [store, setStore] = React.useState<Database["public"]["Tables"]["stores"]["Row"] | null>(null);

  React.useEffect(() => {
    async function fetchInitialData() {
      // Fetch store
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .single();

      if (storeData) {
        setStore(storeData);
        fetchCategories(storeData.id);
      } else {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const fetchCategories = async (storeId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('name');

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data } = await query;

      if (data) setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(generateSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !store) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name,
          slug,
          icon: selectedEmoji,
          description: "",
          store_id: store.id
        }]);

      if (error) throw error;

      alert("Categoria cadastrada com sucesso!");
      setName("");
      setSlug("");
      setSelectedEmoji("🍔");
      setShowForm(false);
      fetchCategories(store.id);
    } catch (err) {
      const error = err as Error;
      alert("Erro ao cadastrar categoria: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (store) fetchCategories(store.id);
    } catch (err) {
      const error = err as Error;
      alert("Erro ao excluir: " + error.message);
    }
  };

  if (showForm) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto space-y-6 pb-12">
          <Card className="border-none shadow-2xl bg-white rounded-[32px] overflow-hidden">
            <header className="p-8 pb-4 flex items-center justify-between">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Nova Categoria</h1>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Ex: Hambúrgueres"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="hamburgueres"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Identificador único para URLs (gerado automaticamente)</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Ícone</label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setCustomEmoji(emoji);
                        }}
                        className={`w-12 h-12 flex items-center justify-center text-xl rounded-2xl border transition-all ${selectedEmoji === emoji
                            ? "bg-primary/5 border-primary shadow-sm scale-110"
                            : "bg-slate-50 border-slate-100 hover:border-slate-200"
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => {
                      setCustomEmoji(e.target.value);
                      if (e.target.value) setSelectedEmoji(e.target.value);
                    }}
                    placeholder="Ou digite um emoji..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-sm disabled:opacity-50"
                >
                  {submitting ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Categorias</h1>
            <p className="text-slate-500 mt-1">Organize seu cardápio em seções</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Nova Categoria
          </button>
        </header>

        <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Lista de Categorias ({categories.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all w-48"
              />
            </div>
          </div>

          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-1 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400 transition-colors">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {cat.icon || "🍔"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{cat.name}</h4>
                      <p className="text-xs font-medium text-slate-400 tracking-tight">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 rounded-xl shadow-sm transition-all">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded-xl shadow-sm transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {categories.length === 0 && !loading && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                  <Folder size={40} />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-800">Nenhuma categoria encontrada</p>
                  <p className="text-sm text-slate-400">Comece organizando seu cardápio hoje.</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors text-sm"
                >
                  Adicionar Primeira Categoria
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
