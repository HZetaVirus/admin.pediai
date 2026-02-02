"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Package,
  X,
  Check,
  Trash2,
  Pencil
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type OptionGroup = Database["public"]["Tables"]["option_groups"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function OptionsPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  
  const [optionGroups, setOptionGroups] = React.useState<OptionGroup[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [store, setStore] = React.useState<Database["public"]["Tables"]["stores"]["Row"] | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [minSelections, setMinSelections] = React.useState(0);
  const [maxSelections, setMaxSelections] = React.useState<number | "">(1);
  const [isMandatory, setIsMandatory] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [options, setOptions] = React.useState<{ name: string; price: string }[]>([{ name: "", price: "" }]);

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: storeData } = await supabase.from('stores').select('*').single();
      if (storeData) {
        setStore(storeData);
        
        // Parallel fetches
        const [groupsRes, catsRes, prodsRes] = await Promise.all([
          supabase.from('option_groups').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false }),
          supabase.from('categories').select('*').eq('store_id', storeData.id).order('name'),
          supabase.from('products').select('*').eq('store_id', storeData.id).order('name')
        ]);

        if (groupsRes.data) setOptionGroups(groupsRes.data);
        if (catsRes.data) setCategories(catsRes.data);
        if (prodsRes.data) setProducts(prodsRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !store) return;

    setSubmitting(true);
    try {
      // 1. Create the Group
      const { data: group, error: groupErr } = await supabase
        .from('option_groups')
        .insert([{
          name,
          description,
          min_selections: minSelections,
          max_selections: maxSelections === "" ? null : maxSelections,
          is_mandatory: isMandatory,
          store_id: store.id
        }])
        .select()
        .single();

      if (groupErr) throw groupErr;

      // 2. Link to Categories
      if (selectedCategories.length > 0) {
        const catLinks = selectedCategories.map(catId => ({
          category_id: catId,
          option_group_id: group.id
        }));
        await supabase.from('category_option_groups').insert(catLinks);
      }

      // 3. Link to Products
      if (selectedProducts.length > 0) {
        const prodLinks = selectedProducts.map(prodId => ({
          product_id: prodId,
          option_group_id: group.id
        }));
        await supabase.from('product_option_groups').insert(prodLinks);
      }

      // 4. Create actual options
      const validOptions = options.filter(opt => opt.name.trim() !== "");
      if (validOptions.length > 0) {
        const optionData = validOptions.map(opt => ({
          name: opt.name,
          price: opt.price === "" ? 0 : parseFloat(opt.price.replace(',', '.')),
          option_group_id: group.id
        }));
        await supabase.from('product_options').insert(optionData);
      }

      alert("Grupo de opcionais criado com sucesso!");
      resetForm();
      fetchInitialData();
    } catch (err) {
      const error = err as Error;
      alert("Erro ao criar grupo: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setMinSelections(0);
    setMaxSelections(1);
    setIsMandatory(false);
    setSelectedCategories([]);
    setSelectedProducts([]);
    setOptions([{ name: "", price: "" }]);
    setShowForm(false);
  };

  const addOptionField = () => {
    setOptions([...options, { name: "", price: "" }]);
  };

  const removeOptionField = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: 'name' | 'price', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProduct = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (showForm) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
          <Card className="border-none shadow-2xl bg-white rounded-[32px] overflow-hidden">
            <header className="p-8 pb-4 flex items-center justify-between">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Novo Grupo de Opcionais</h1>
              <button 
                onClick={resetForm}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome do grupo *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Adicionais de carne" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Descrição (opcional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva este grupo de opcionais..." 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Mínimo de seleções</label>
                    <input 
                      type="number" 
                      value={minSelections}
                      onChange={(e) => setMinSelections(Number(e.target.value))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Máximo de seleções</label>
                    <input 
                      type="text" 
                      value={maxSelections}
                      onChange={(e) => setMaxSelections(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ilimitado"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Grupo obrigatório</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Cliente deve selecionar ao menos uma opção</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsMandatory(!isMandatory)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isMandatory ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isMandatory ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Opções do grupo</label>
                    <button 
                      type="button" 
                      onClick={addOptionField}
                      className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                    >
                      + Adicionar Opção
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={opt.name}
                            onChange={(e) => updateOption(idx, 'name', e.target.value)}
                            placeholder="Nome (ex: Bacon)" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                          />
                        </div>
                        <div className="w-24">
                          <input 
                            type="text" 
                            value={opt.price}
                            onChange={(e) => updateOption(idx, 'price', e.target.value)}
                            placeholder="Preço" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                          />
                        </div>
                        {options.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeOptionField(idx)}
                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Aplicar em:</label>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categorias</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                              selectedCategories.includes(cat.id)
                                ? "bg-primary/5 border-primary text-primary shadow-sm"
                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                            }`}
                          >
                            <span className="mr-1.5">{cat.icon}</span>
                            {cat.name}
                          </button>
                        ))}
                        {categories.length === 0 && (
                          <p className="text-xs text-slate-400 italic">Nenhuma categoria cadastrada</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Produtos Específicos</p>
                      {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {products.map(prod => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => toggleProduct(prod.id)}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                selectedProducts.includes(prod.id)
                                  ? "bg-primary/5 border-primary text-primary shadow-sm"
                                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-xs font-bold truncate pr-2">{prod.name}</span>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                                selectedProducts.includes(prod.id)
                                  ? "bg-primary border-primary text-white"
                                  : "bg-white border-slate-200"
                              }`}>
                                {selectedProducts.includes(prod.id) && <Check size={10} strokeWidth={4} />}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Nenhum produto cadastrado</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-sm disabled:opacity-50"
                >
                  {submitting ? "Criando..." : "Criar Grupo"}
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
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Opcionais de Produtos</h1>
            <p className="text-slate-500 mt-1">Gerencie adicionais pagos e gratuitos para seus produtos</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={18} />
            Novo Grupo
          </button>
        </header>

        {optionGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {optionGroups.map((group) => (
              <Card key={group.id} className="p-6 border-none shadow-sm bg-white rounded-[32px] group hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Package size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{group.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Min: {group.min_selections} • Max: {group.max_selections || 'Ilimitado'} • 
                        {group.is_mandatory ? ' Obrigatório' : ' Opcional'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all">
                      <Pencil size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl min-h-[400px] flex flex-col items-center justify-center p-8">
            <div className="max-w-sm w-full text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-300 shadow-inner">
                <Package size={48} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Nenhum grupo de opcionais</h3>
                <p className="text-slate-500 text-sm">
                  Crie grupos como &quot;Adicionais de carne&quot; ou &quot;Molhos extras&quot;
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-sm uppercase tracking-widest"
              >
                <Plus size={18} />
                Criar primeiro grupo
              </button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
