"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Megaphone,
  History,
  Send,
  Plus,
  Trash2,
  Users,
  Clock,
  MessageSquare,
  Info,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { whatsappService } from "@/services/whatsappService";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { DesktopOnly } from "@/components/layout/DesktopOnly";

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = React.useState<"list" | "create">("list");
  const [store, setStore] = React.useState<{ id: string } | null>(null);
  const [campaigns, setCampaigns] = React.useState<any[]>([]); 

  // Form State
  const [campName, setCampName] = React.useState("");
  const [campMessage, setCampMessage] = React.useState("");
  const [targetAudience, setTargetAudience] = React.useState("all");
  const [isSending, setIsSending] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showBestPractices, setShowBestPractices] = React.useState(false);
  
  // Image State
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    async function init() {
      const { data: storeData } = await supabase.from('stores').select('*').single();
      if (storeData) {
        setStore(storeData);
        fetchCampaigns(storeData.id);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("O arquivo deve ter no máximo 1 MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchCampaigns = async (storeId: number) => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    if (data) setCampaigns(data);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !campName || !campMessage) return;

    setIsSending(true);
    try {
      // 1. Fetch target customers
      let query = supabase.from('customers').select('*').eq('store_id', store.id);
      if (targetAudience === 'whatsapp') query = query.eq('source', 'whatsapp');
      if (targetAudience === 'app') query = query.eq('source', 'app_menu');

      const { data: customers } = await query;
      if (!customers || customers.length === 0) {
        alert("Nenhum cliente encontrado para o público selecionado.");
        setIsSending(false);
        return;
      }

      let uploadedMediaUrl = "";
      if (imageFile) {
        // Upload to Supabase Storage
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${store.id}/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('campaigns')
          .upload(filePath, imageFile);
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          // If bucket doesn't exist, we might need to use public URL or base64
          // For now, let's try to get public URL even if upload fails (unlikely if bucket exists)
          alert("Falha ao subir imagem. O disparo continuará apenas com texto.");
        } else if (uploadData) {
          const { data: urlData } = supabase.storage.from('campaigns').getPublicUrl(filePath);
          uploadedMediaUrl = urlData.publicUrl;
        }
      }

      // 2. Create campaign record
      const { data: campaign, error } = await supabase.from('campaigns').insert({
        store_id: store.id,
        name: campName,
        message: campMessage,
        media_url: uploadedMediaUrl,
        status: 'sending',
        total_contacts: customers.length,
        sent_count: 0
      }).select().single();

      if (error) throw error;

      setActiveTab("list");
      fetchCampaigns(store.id);

      // 3. Start sending bulk messages (Client-side background execution for MVP)
      const contacts = customers.map(c => ({ phone: c.phone || "", name: c.full_name || "" }));
      
      const result = await whatsappService.sendBulkMessages(
        contacts, 
        campMessage, 
        uploadedMediaUrl || undefined,
        async (index, success) => {
          // Update campaign progress in real-time
          await supabase.from('campaigns').update({
            sent_count: index + 1,
            status: index + 1 === customers.length ? 'completed' : 'sending'
          }).eq('id', campaign.id);
        }
      );

      alert(`Campanha finalizada! Enviados: ${result.sent}, Falhas: ${result.failed}`);
      fetchCampaigns(store.id);

    } catch (err) {
      console.error("Campaign error:", err);
      alert("Erro ao processar campanha.");
    } finally {
      setIsSending(false);
      setCampName("");
      setCampMessage("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <AppLayout>
      <DesktopOnly>
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Megaphone size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Campanhas</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-slate-500 font-medium">Crie disparos em massa e fidelize seus clientes pelo WhatsApp.</p>
              <button 
                onClick={() => setShowBestPractices(true)}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Info size={14} /> Boas Práticas Meta
              </button>
            </div>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab("list")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                activeTab === 'list' ? "bg-slate-800 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <History size={16} /> Histórico
            </button>
            <button 
              onClick={() => setActiveTab("create")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                activeTab === 'create' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Plus size={16} /> Nova Campanha
            </button>
          </div>
        </header>

        {/* Best Practices Modal */}
        {showBestPractices && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBestPractices(false)} />
            <Card className="relative w-full max-w-2xl border-none shadow-2xl bg-white rounded-[40px] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Info size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Boas Práticas Meta API</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">WhatsApp Business API Guidelines</p>
                  </div>
                </div>
                <button onClick={() => setShowBestPractices(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-black text-slate-800">
                    <CheckCircle2 className="text-green-500" size={20} />
                    Obtenha Permissão (Opt-in)
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Apenas envie mensagens para clientes que aceitaram explicitamente receber comunicações via WhatsApp. Isso evita denúncias de spam e bloqueios.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-black text-slate-800">
                    <MessageSquare className="text-primary" size={20} />
                    Conteúdo Relevante e Esperado
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Envie mensagens que o cliente realmente deseja receber (ex: confirmação de pedido, promoções exclusivas, atualização de horário). Evite mensagens genéricas e excessivas.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-black text-slate-800">
                    <Clock className="text-orange-500" size={20} />
                    Frequência Moderada
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Não bombardeie o cliente com muitas mensagens no mesmo dia ou semana. Respeite o espaço do usuário para manter uma boa taxa de abertura.
                  </p>
                </section>

                <section className="space-y-4 text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-sm font-black text-slate-800 mb-2">💡 Dica de Ouro</p>
                  <p className="text-sm text-slate-500 font-medium">
                    Sempre dê ao cliente uma forma fácil de parar de receber mensagens (ex: &quot;Responda PARAR para sair da lista&quot;).
                  </p>
                </section>
              </div>

              <div className="p-8 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setShowBestPractices(false)}
                  className="px-10 py-4 bg-slate-800 text-white font-black rounded-2xl shadow-lg hover:bg-slate-900 transition-all"
                >
                  ENTENDI
                </button>
              </div>
            </Card>
          </div>
        )}
        {activeTab === "list" ? (
          <div className="grid gap-6">
            {campaigns.length === 0 ? (
              <Card className="p-16 flex flex-col items-center justify-center text-center border-none shadow-xl bg-white rounded-[40px]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                  <Megaphone size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Sem campanhas ainda</h3>
                <p className="text-slate-400 font-medium max-w-sm">Comece sua primeira campanha de marketing agora clicando em &quot;Nova Campanha&quot;.</p>
              </Card>
            ) : (
              campaigns.map((camp) => (
                <Card key={camp.id} className="p-6 border-none shadow-lg bg-white rounded-[32px] hover:shadow-xl transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-800">{camp.name}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          camp.status === 'completed' ? "bg-green-50 text-green-600" : 
                          camp.status === 'sending' ? "bg-blue-50 text-blue-600 animate-pulse" : 
                          "bg-slate-50 text-slate-400"
                        )}>
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 line-clamp-1 italic">&quot;{camp.message}&quot;</p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Alcance</p>
                        <p className="text-lg font-black text-slate-700">{camp.sent_count}/{camp.total_contacts}</p>
                      </div>
                      <div className="h-12 w-px bg-slate-100 hidden md:block" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Data</p>
                        <p className="text-sm font-bold text-slate-600">{new Date(camp.created_at).toLocaleDateString()}</p>
                      </div>
                      <button className="p-3 text-slate-300 hover:text-primary transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 p-8 border-none shadow-2xl bg-white rounded-[40px] space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-slate-800">Nova mensagem</h2>
                <button onClick={() => setActiveTab("list")} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Título do Disparo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <History size={18} className="text-slate-400" />
                    <label className="text-sm font-black uppercase tracking-wider">Título do disparo</label>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={campName}
                      onChange={(e) => setCampName(e.target.value)}
                      placeholder="Descreva brevemente esse disparo" 
                      className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    />
                    <p className="text-[11px] text-slate-400 font-medium ml-1">
                      Essa informação não será enviada aos destinatários, é apenas para o seu controle interno.
                    </p>
                  </div>
                </div>

                {/* A Mensagem */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <MessageSquare size={18} className="text-slate-400" />
                    <label className="text-sm font-black uppercase tracking-wider">A mensagem</label>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group relative overflow-hidden",
                        imagePreview ? "aspect-video" : "p-10"
                      )}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={handleRemoveImage}
                              className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                              <Trash2 size={24} />
                            </button>
                            <div className="p-3 bg-white text-slate-800 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                              <Plus size={24} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-600">Selecione uma imagem</p>
                            <p className="text-xs text-slate-400">ou arraste e solte</p>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                      Formatos aceitos: <span className="text-slate-600">JPEG, JPG, PNG e GIF</span>. Tamanho máximo: <span className="text-slate-600">1 MB</span>.
                    </p>

                    <div className="relative">
                      <textarea 
                        rows={6}
                        value={campMessage}
                        onChange={(e) => setCampMessage(e.target.value)}
                        placeholder="Escreva aqui a mensagem que deseja enviar" 
                        className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 resize-none placeholder:text-slate-300"
                      />
                      <div className="absolute bottom-4 right-4 text-slate-300">
                        <MessageSquare size={16} />
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">
                      Como incluir o nome do destinatário na mensagem?
                      <ArrowRight className="rotate-90" size={16} />
                    </button>
                  </div>
                </div>

                {/* Quando será o envio? */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Clock size={18} className="text-slate-400" />
                    <label className="text-sm font-black uppercase tracking-wider">Quando será o envio?</label>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                    <p className="text-sm font-bold text-purple-700 text-center">
                      Agora é possível agendar o envio de mensagens para uma data específica ou de forma recorrente.
                    </p>
                  </div>

                  <div className="relative">
                    <select className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800 appearance-none">
                      <option>Agora</option>
                      <option>Agendar para depois...</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowRight className="rotate-90" size={18} />
                    </div>
                  </div>
                </div>

                {/* Os destinatários */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Users size={18} className="text-slate-400" />
                    <label className="text-sm font-black uppercase tracking-wider">Os destinatários</label>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'all', icon: <Users size={18} />, label: 'Todos os Clientes' },
                      { id: 'whatsapp', icon: <MessageSquare size={18} />, label: 'Só WhatsApp' },
                      { id: 'app', icon: <Plus size={18} />, label: 'Só App' }
                    ].map((aud) => (
                      <button
                        key={aud.id}
                        onClick={() => setTargetAudience(aud.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-[10px] uppercase tracking-wider",
                          targetAudience === aud.id ? "bg-primary/5 border-primary text-primary" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                        )}
                      >
                        {aud.icon}
                        {aud.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-end">
                <button 
                  onClick={handleCreateCampaign}
                  disabled={isSending || !campName || !campMessage}
                  className="px-10 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                  {isSending ? "ENVIANDO..." : "INICIAR DISPARO"}
                  <Send size={20} />
                </button>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-8 border-none shadow-xl bg-slate-800 text-white rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full -mr-16 -mt-16" />
                <h4 className="text-lg font-black tracking-tight mb-6">Dicas de Sucesso 🚀</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span>Seja direto e use uma oferta irresistível no início.</span>
                  </li>
                  <li className="flex gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span>Use o {"{{name}}"} para aumentar a conversão.</span>
                  </li>
                  <li className="flex gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span>Não envie muitas mensagens no mesmo dia.</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-none shadow-xl bg-white rounded-[40px] border border-slate-50">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Preview</h4>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                      <img src={imagePreview} alt="WhatsApp Preview" className="w-full h-auto" />
                    </div>
                  )}
                  <div className="bg-slate-50 p-4 rounded-2xl relative">
                    <div className="absolute left-0 top-4 w-2 h-4 bg-slate-50 rotate-45 -ml-1" />
                    <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {campMessage.replace(/\{\{name\}\}/g, "João") || "Seu preview aparecerá aqui..."}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 text-right mt-2">10:45</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DesktopOnly>
  </AppLayout>
);
}
