"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronDown,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";

type MenuItem = Database["public"]["Tables"]["products"]["Row"] & {
  category: Database["public"]["Tables"]["categories"]["Row"] | null;
};

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CMVAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // Simulation State
  const [simulationParams, setSimulationParams] = useState<Record<number, { simulatedPrice: number, simulatedCost: number }>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch Categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesData) setCategories(categoriesData);

      // Fetch Menu Items
      // Note: We try to select cost_price. If it fails (column doesn't exist), Supabase might throw.
      // We will handle this by selecting * and checking if cost_price is present in the object.
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('name');

      if (error) throw error;
      
      if (productsData) {
        // Safe cast or mapping
        setProducts(productsData as unknown as MenuItem[]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados. Verifique sua conexão ou contate o suporte.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSimulatePrice = (productId: number, val: string) => {
    const value = parseFloat(val.replace(',', '.'));
    if (isNaN(value)) return;
    
    setSimulationParams(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        simulatedPrice: value,
        simulatedCost: prev[productId]?.simulatedCost ?? (products.find(p => p.id === productId)?.cost_price || 0)
      }
    }));
  };

  const handleSimulateCost = (productId: number, val: string) => {
    const value = parseFloat(val.replace(',', '.'));
    if (isNaN(value)) return;

    setSimulationParams(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        simulatedCost: value,
        simulatedPrice: prev[productId]?.simulatedPrice ?? (products.find(p => p.id === productId)?.price || 0)
      }
    }));
  };

  const handleApplyPrice = async (productId: number) => {
    const simulated = simulationParams[productId]?.simulatedPrice;
    if (!simulated) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ price: simulated })
        .eq('id', productId);

      if (error) throw error;

      toast.success("Preço atualizado com sucesso!");
      
      // Update local state
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: simulated } : p));
      
      // Clear simulation for this item
      const newParams = { ...simulationParams };
      delete newParams[productId];
      setSimulationParams(newParams);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar preço.");
    }
  };

  const handleSaveCost = async (productId: number) => {
    const simulated = simulationParams[productId]?.simulatedCost;
    if (simulated === undefined) return;

    try {
      // Check if column exists by trying update. If it fails, alert user.
      const { error } = await supabase
        .from('products')
        .update({ cost_price: simulated } as any) // suppress TS error if type is missing
        .eq('id', productId);

      if (error) {
        if (error.message.includes("column \"cost_price\" of relation \"products\" does not exist")) {
           toast.error("A coluna de Custo não existe no banco de dados. Por favor, contate o administrador.");
           return;
        }
        throw error;
      }

      toast.success("Custo atualizado com sucesso!");
      
      // Update local state
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, cost_price: simulated } : p));
      
      // Keep simulation open to show updated cmv? Or clear? Let's clear cost sim but keep price if set.
       setSimulationParams(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          simulatedCost: simulated
        }
      }));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar custo.");
    }
  };
  
  const toggleExpand = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
      const matchesStatus = showInactive ? true : p.active;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, showInactive]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Análise e Simulação de CMV</h1>
            <p className="text-slate-500 font-medium mt-1">Gerencie custos e simule novas margens de lucro.</p>
          </div>
          
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm">
               <Filter size={18} />
               <span>Filtros Avançados</span>
             </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
            <input 
              type="text"
              placeholder="Buscar por produto..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
             <select 
               className="w-full h-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
               value={selectedCategory || ""}
               onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
             >
               <option value="">Todas Categorias</option>
               {categories.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 pointer-events-none" size={18} />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-5 rounded-2xl">
             <div className="relative flex items-center">
               <input 
                type="checkbox" 
                id="showInactive"
                className="peer sr-only"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
               />
               <div 
                 onClick={() => setShowInactive(!showInactive)}
                 className={cn(
                   "w-11 h-6 bg-slate-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary cursor-pointer transition-colors"
                 )}
               ></div>
             </div>
             <label htmlFor="showInactive" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
               Mostrar Inativos
             </label>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="w-8 px-6 py-5"></th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Atualmente</th>
                  <th className="px-6 py-5 text-right text-[11px] font-black text-primary uppercase tracking-widest bg-primary/5">Custo (R$)</th>
                  <th className="px-6 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Simulado (R$)</th>
                  <th className="px-6 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">CMV %</th>
                  <th className="px-6 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Margem %</th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => {
                  const currentParams = simulationParams[product.id] || {};
                  
                  const cost = currentParams.simulatedCost ?? (product.cost_price || 0);
                  const price = currentParams.simulatedPrice ?? product.price;
                  
                  const cmv = price > 0 ? (cost / price) * 100 : 0;
                  const margin = 100 - cmv;
                  
                  const isSimulated = !!simulationParams[product.id];
                  const isExpanded = expandedRows.includes(product.id);

                  return (
                    <>
                    <motion.tr 
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 py-4 pl-6">
                         <button 
                           onClick={() => toggleExpand(product.id)}
                           className="p-1.5 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
                         >
                           {isExpanded ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
                         </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 font-bold overflow-hidden border border-slate-100 shadow-sm">
                             {product.photo_url ? (
                              <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
                             ) : (
                              product.name.charAt(0)
                             )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{product.name}</p>
                            {!product.active && <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Inativo</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.category && (
                          <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
                            {product.category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-500 text-sm">
                          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right bg-primary/5">
                         <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xs font-bold">R$</span>
                              <input 
                                type="number" 
                                className="w-24 pl-8 pr-3 py-2 text-right bg-white border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-primary outline-none transition-all shadow-sm"
                                value={cost}
                                onChange={(e) => handleSimulateCost(product.id, e.target.value)}
                              />
                           </div>
                           {currentParams.simulatedCost !== undefined && currentParams.simulatedCost !== (product.cost_price || 0) && (
                              <button 
                                onClick={() => handleSaveCost(product.id)}
                                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-primary/20"
                                title="Salvar custo"
                              >
                                <DollarSign size={14} strokeWidth={3} />
                              </button>
                           )}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right bg-slate-50/50">
                        <div className="relative inline-block">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">R$</span>
                          <input 
                             type="number" 
                             className="w-24 pl-8 pr-3 py-2 text-right bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 text-sm font-bold text-slate-600 outline-none transition-all"
                             value={price}
                             onChange={(e) => handleSimulatePrice(product.id, e.target.value)}
                           />
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn("font-black text-sm", cmv > 40 ? "text-red-500" : "text-green-600")}>
                            {cmv.toFixed(1)}%
                          </span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-500", cmv > 40 ? "bg-red-500" : "bg-green-500")} 
                              style={{ width: `${Math.min(cmv, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn("font-black text-sm", margin < 0 ? "text-red-500" : "text-slate-700")}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 h-9">
                          {isSimulated ? (
                            <>
                              <button 
                                onClick={() => {
                                    const newParams = { ...simulationParams };
                                    delete newParams[product.id];
                                    setSimulationParams(newParams);
                                }}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Descartar Simulação"
                              >
                                <RotateCcw size={18} />
                              </button>
                              {currentParams.simulatedPrice !== undefined && (
                                <button 
                                  onClick={() => handleApplyPrice(product.id)}
                                  className="w-9 h-9 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 rounded-xl transition-colors shadow-lg shadow-green-500/20"
                                  title="Aplicar Preço de Venda"
                                >
                                  <DollarSign size={18} strokeWidth={3} />
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="w-9 h-9 flex items-center justify-center text-slate-200">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                    {isExpanded && (
                       <tr className="bg-slate-50/50">
                          <td colSpan={9} className="px-6 py-6">
                             <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                  <Filter size={20} /> 
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-700">Detalhamento de Opcionais</h4>
                                  <p className="text-xs text-slate-400 font-medium max-w-sm mt-1">
                                    Visualize e edite o custo individual de cada opcional vinculado a este produto. Esta funcionalidade visual estará disponível em breve.
                                  </p>
                                </div>
                             </div>
                          </td>
                       </tr>
                    )}
                    </>
                  );
                })}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Nenhum produto encontrado</h3>
                <p className="text-slate-400">Tente ajustar seus filtros de busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
