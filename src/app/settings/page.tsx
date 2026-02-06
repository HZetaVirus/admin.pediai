"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { settingsService, StoreSettings, OperatingHours } from "@/services/settingsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  Truck,
  CreditCard,
  Bell,
  Palette,
  Loader2,
  Save,
  Upload,
  Clock,
  MapPin,
  Phone,
  Mail,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<StoreSettings>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [operatingHours, setOperatingHours] = React.useState<OperatingHours>({});

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getStoreSettings();
      if (data) {
        // Extract settings from JSON column
        const settingsFromDb = (data.settings as any) || {};

        // Merge top-level data with JSON settings for the form
        const mergedSettings = {
          ...data,
          ...settingsFromDb
        };

        setSettings(mergedSettings as unknown as StoreSettings);

        if (settingsFromDb.operating_hours) {
          setOperatingHours(settingsFromDb.operating_hours as unknown as OperatingHours);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateStoreSettings({
        ...settings,
        operating_hours: operatingHours as unknown as any,
      } as any);
      toast.success("Configurações salvas com sucesso! ✨");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, field: 'logo_url' | 'banner_url') => {
    try {
      toast.info("Fazendo upload da imagem...");
      const url = await settingsService.uploadImage(file);
      setSettings(prev => ({ ...prev, [field]: url }));
      toast.success("Imagem enviada!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload da imagem");
    }
  };

  const updateField = (field: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateOperatingHour = (day: keyof OperatingHours, value: any) => {
    setOperatingHours(prev => ({ ...prev, [day]: value }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </AppLayout>
    );
  }

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h1>
            <p className="text-slate-500 mt-1">Gerencie todos os aspectos da sua loja</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg hover:scale-105 active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Salvar Alterações
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl bg-slate-100 p-1">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store size={16} />
              <span className="hidden md:inline">Loja</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck size={16} />
              <span className="hidden md:inline">Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="hidden md:inline">Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span className="hidden md:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette size={16} />
              <span className="hidden md:inline">Aparência</span>
            </TabsTrigger>
          </TabsList>

          {/* Store Info Tab */}
          <TabsContent value="store" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-800">Informações da Loja</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Nome da Loja</label>
                  <input
                    type="text"
                    value={settings.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ex: Pizzaria do Zé"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Slug (URL)</label>
                  <input
                    type="text"
                    value={settings.slug || ''}
                    onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s/g, '-'))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="pizzaria-do-ze"
                  />
                  <p className="text-xs text-slate-400">pediai.netlify.app/{settings.slug || 'seu-slug'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Descrição</label>
                <textarea
                  value={settings.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Descreva seu negócio..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Phone size={14} /> Telefone
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="contato@pizzaria.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <MapPin size={14} /> Endereço Completo
                </label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Logo</label>
                  <div className="flex items-center gap-4">
                    {settings.logo_url && (
                      <img src={settings.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                      <Upload size={16} />
                      <span className="text-sm font-medium">Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'logo_url');
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Banner</label>
                  <div className="flex items-center gap-4">
                    {settings.banner_url && (
                      <img src={settings.banner_url} alt="Banner" className="w-24 h-16 rounded-xl object-cover border border-slate-200" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                      <Upload size={16} />
                      <span className="text-sm font-medium">Upload Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'banner_url');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-800">Configurações de Delivery</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <DollarSign size={14} /> Taxa de Entrega (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.delivery_fee || ''}
                    onChange={(e) => updateField('delivery_fee', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="5.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <DollarSign size={14} /> Pedido Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.min_order_value || ''}
                    onChange={(e) => updateField('min_order_value', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="20.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Raio de Entrega (km)</label>
                  <input
                    type="number"
                    value={settings.delivery_radius_km || ''}
                    onChange={(e) => updateField('delivery_radius_km', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Clock size={14} /> Tempo Estimado (min)
                  </label>
                  <input
                    type="number"
                    value={settings.estimated_delivery_time || ''}
                    onChange={(e) => updateField('estimated_delivery_time', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800">Horário de Funcionamento</h3>
                {days.map(({ key, label }) => {
                  const dayKey = key as keyof OperatingHours;
                  const dayData = operatingHours[dayKey] || { open: '08:00', close: '22:00', closed: false };

                  return (
                    <div key={key} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <span className="w-24 font-bold text-slate-700">{label}</span>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!dayData.closed}
                          onChange={(e) => updateOperatingHour(dayKey, { ...dayData, closed: !e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-600">Aberto</span>
                      </label>
                      {!dayData.closed && (
                        <>
                          <input
                            type="time"
                            value={dayData.open}
                            onChange={(e) => updateOperatingHour(dayKey, { ...dayData, open: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                          <span className="text-slate-400">às</span>
                          <input
                            type="time"
                            value={dayData.close}
                            onChange={(e) => updateOperatingHour(dayKey, { ...dayData, close: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                        </>
                      )}
                      {dayData.closed && (
                        <span className="text-sm text-slate-400 italic">Fechado</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-800">Formas de Pagamento</h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      💰
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Dinheiro</span>
                      <p className="text-xs text-slate-500">Pagamento em espécie</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accepts_cash || false}
                    onChange={(e) => updateField('accepts_cash', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      💳
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Cartão</span>
                      <p className="text-xs text-slate-500">Débito ou crédito na maquininha</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accepts_card || false}
                    onChange={(e) => updateField('accepts_card', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                      🔑
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">PIX</span>
                      <p className="text-xs text-slate-500">Pagamento instantâneo</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accepts_pix || false}
                    onChange={(e) => updateField('accepts_pix', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>

                {settings.accepts_pix && (
                  <div className="space-y-2 ml-14">
                    <label className="text-sm font-bold text-slate-600">Chave PIX</label>
                    <input
                      type="text"
                      value={settings.pix_key || ''}
                      onChange={(e) => updateField('pix_key', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="email@exemplo.com ou CPF/CNPJ"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-800">Notificações</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Phone size={14} /> WhatsApp para Alertas
                  </label>
                  <input
                    type="text"
                    value={settings.notification_phone || ''}
                    onChange={(e) => updateField('notification_phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                  <p className="text-xs text-slate-400">Número que receberá alertas de novos pedidos</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Mail size={14} /> Email para Relatórios
                  </label>
                  <input
                    type="email"
                    value={settings.notification_email || ''}
                    onChange={(e) => updateField('notification_email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="relatorios@email.com"
                  />
                  <p className="text-xs text-slate-400">Email para receber relatórios diários</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-800">Personalização Visual</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Cor Tema do Cardápio</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.theme_color || '#10b981'}
                      onChange={(e) => updateField('theme_color', e.target.value)}
                      className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-slate-700">{settings.theme_color || '#10b981'}</p>
                      <p className="text-xs text-slate-400">Cor principal do seu cardápio público</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-600 mb-4">Preview do Cardápio</h3>
                  <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                      {settings.logo_url && (
                        <img src={settings.logo_url} alt="Logo" className="w-12 h-12 rounded-xl" />
                      )}
                      <div>
                        <h4 className="font-black text-lg">{settings.name || 'Sua Loja'}</h4>
                        <p className="text-xs text-slate-500">{settings.description || 'Descrição da loja'}</p>
                      </div>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: settings.theme_color || '#10b981' }}
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium">Produto Exemplo</span>
                        <span
                          className="font-black"
                          style={{ color: settings.theme_color || '#10b981' }}
                        >
                          R$ 25,00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
