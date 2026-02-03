"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  MoreVertical, 
  MessageSquare,
  Smile, 
  Paperclip, 
  Send,
  CheckCheck,
  MessageCircle,
  QrCode,
  XCircle
} from "lucide-react";
import { whatsappService } from "@/services/whatsappService";
import { DesktopOnly } from "@/components/layout/DesktopOnly";
import Image from "next/image";

interface Chat {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup?: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "them";
  status?: "sent" | "delivered" | "read";
}

export default function WhatsAppPage() {
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [message, setMessage] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("Tudo");
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [qrCode, setQrCode] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = React.useState<Record<string, Message[]>>({});

  // WhatsApp Logic
  const loadQRCode = React.useCallback(async () => {
    const data = await whatsappService.getQRCode();
    if (data?.base64) {
      setQrCode(data.base64);
    }
  }, []);

  const loadChats = React.useCallback(async () => {
    const apiChats: { remoteJid: string, name?: string, unreadCount?: number, lastMessage?: any }[] = await whatsappService.getChats();
    const mappedChats: Chat[] = apiChats.map((c) => ({
      id: c.remoteJid,
      name: c.name || c.remoteJid.split('@')[0],
      lastMsg: c.lastMessage?.message?.conversation || "Sem mensagens",
      time: new Date(c.lastMessage?.messageTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "",
      unread: c.unreadCount || 0,
      avatar: (c.name || "?")[0],
      isGroup: c.remoteJid.includes('@g.us')
    }));
    setChats(mappedChats);
  }, []);

  const loadMessages = React.useCallback(async (remoteJid: string) => {
    const apiMsgs: { key: { id: string, fromMe: boolean }, messageTimestamp: number, message?: any }[] = await whatsappService.getMessages(remoteJid);
    const mappedMsgs: Message[] = apiMsgs.map((m) => {
      const isMe = m.key.fromMe;
      return {
        id: m.key.id,
        text: m.message?.conversation || m.message?.extendedTextMessage?.text || "Mensagem não suportada",
        time: new Date(m.messageTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: isMe ? "me" : "them",
      };
    });
    setChatMessages(prev => ({ ...prev, [remoteJid]: mappedMsgs }));
  }, []);

  const checkConnection = React.useCallback(async () => {
    setServerError(null);
    const status = await whatsappService.getInstanceStatus();
    
    if (status === 'open') {
      setIsConnected(true);
      setQrCode(null);
      loadChats();
    } else if (status === 'NOT_FOUND') {
      const allInstances = await whatsappService.fetchInstances();
      if (allInstances.length > 0) {
        const existing = allInstances[0];
        whatsappService.setInstanceName(existing.name);
        const newStatus = await whatsappService.getInstanceStatus();
        if (newStatus === 'open') {
          setIsConnected(true);
          loadChats();
        } else {
          loadQRCode();
        }
      } else {
        const result = await whatsappService.createInstance();
        if (result.success) {
          loadQRCode();
        } else {
          setServerError(result.error || "O servidor recusou a criação da instância.");
          setIsConnected(false);
        }
      }
    } else {
      setIsConnected(false);
      loadQRCode();
    }
    setIsLoading(false);
  }, [loadChats, loadQRCode]);

  React.useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  React.useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat, loadMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const success = await whatsappService.sendMessage(selectedChat.id, message);
    if (success) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "me"
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
      }));
      setMessage("");
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) alert(`Simulando envio de: ${e.target.files[0].name}`);
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeFilter === "Tudo" || (activeFilter === "Não lidas" && c.unread > 0) || (activeFilter === "Grupos" && c.isGroup))
  );

  if (isLoading) {
    return (
      <AppLayout>
        <DesktopOnly>
          <div className="h-screen flex items-center justify-center bg-slate-50/50">
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="text-primary" size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">PediAI WhatsApp</h2>
                <p className="text-slate-500 font-medium tracking-tight">Verificando sua conexão...</p>
              </div>
            </div>
          </div>
        </DesktopOnly>
      </AppLayout>
    );
  }

  if (!isConnected) {
    return (
      <AppLayout>
        <DesktopOnly>
          <div className="py-8 px-4 h-[calc(100vh-100px)] flex items-center justify-center">
          <Card className="w-full max-w-[1040px] border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              <div className="p-12 space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Aguardando Conexão
                  </div>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
                    Conecte seu <br/><span className="text-primary italic">WhatsApp</span>
                  </h1>
                  
                  {serverError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-700 text-xs font-bold leading-relaxed shadow-sm">
                      <XCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="mb-1">Falha no Servidor:</p>
                        <p className="opacity-80 font-medium">{serverError}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-slate-500 font-medium leading-relaxed">
                    Escaneie o QR Code ao lado para conectar seu WhatsApp e começar os atendimentos.
                  </p>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit border border-slate-100">
                  <div className="px-6 py-3 rounded-xl text-xs font-black bg-white text-primary shadow-sm border border-slate-100 flex items-center gap-2">
                    <QrCode size={14} />
                    QR CODE
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-right ml-auto">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status do Motor</p>
                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Railway Online
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 p-12 flex flex-col items-center justify-center text-center space-y-8 border-l border-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-30" />
                
                <div className="relative p-8 bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 group border border-white relative z-10 transition-transform hover:scale-105 duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-[48px]" />
                  {qrCode ? (
                    <Image 
                      src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                      alt="QR Code"
                      width={240}
                      height={240}
                      className="relative z-10 rounded-2xl"
                    />
                  ) : (
                    <div className="w-[240px] h-[240px] flex items-center justify-center bg-slate-50 rounded-2xl">
                      <QrCode size={120} className="text-slate-100 opacity-50 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 relative z-10">
                  <p className="text-xs font-black text-primary uppercase tracking-[0.4em] ml-1">Escaneie Agora</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">O código atualiza periodicamente</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DesktopOnly>
    </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DesktopOnly>
        <div className="py-8 px-4 h-[calc(100vh-100px)] flex items-center justify-center">
        <Card className="w-full max-w-[1240px] h-full max-h-[820px] border-none shadow-2xl bg-white rounded-[40px] overflow-hidden flex transform transition-all">
          <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
            <header className="p-6 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Conversas</h1>
                <div className="flex gap-2">
                  <button onClick={() => alert("Nova conversa")} className="p-2 text-slate-400 hover:text-primary transition-colors"><MessageSquare size={20} /></button>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors"><MoreVertical size={20} /></button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
              <div className="flex gap-2">
                {["Tudo", "Não lidas", "Grupos"].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                      activeFilter === filter ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
              {filteredChats.map((chat) => (
                <button 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mb-1 ${
                    selectedChat?.id === chat.id ? "bg-white shadow-lg shadow-slate-200/50 scale-[1.02] z-10" : "hover:bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${chat.isGroup ? "bg-blue-100 text-blue-600" : "bg-primary/10 text-primary"}`}>
                    {chat.avatar}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-bold text-slate-800 truncate">{chat.name}</h3>
                      <span className="text-[10px] font-black text-slate-300">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate">{chat.lastMsg}</p>
                  </div>
                  {chat.unread > 0 && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white">{chat.unread}</div>}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 flex-col bg-white">
            {selectedChat ? (
              <>
                <header className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-xs text-primary">{selectedChat.avatar}</div>
                    <div>
                      <h3 className="font-bold text-slate-800 tracking-tight">{selectedChat.name}</h3>
                      <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Online</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2 relative">
                    <button className="p-3 text-slate-400 hover:text-primary"><Search size={20} /></button>
                    <button onClick={() => setShowHeaderMenu(!showHeaderMenu)} className="p-3 text-slate-400 hover:text-primary"><MoreVertical size={20} /></button>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
                  {(chatMessages[selectedChat.id] || []).map((msg) => (
                    <div key={msg.id} className={`flex flex-col gap-2 max-w-[70%] ${msg.sender === "me" ? "ml-auto items-end" : ""}`}>
                      <div className={`p-4 rounded-2xl shadow-sm border ${msg.sender === "me" ? "bg-primary border-primary text-white rounded-tr-none" : "bg-white border-slate-100 rounded-tl-none"}`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-2 text-[10px] opacity-70">
                          {msg.time} {msg.sender === "me" && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="p-6 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button type="button" className="p-3 text-slate-400 hover:text-primary"><Smile size={24} /></button>
                    <button type="button" onClick={handleAttachClick} className="p-3 text-slate-400 hover:text-primary"><Paperclip size={24} /></button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <input 
                      type="text" 
                      placeholder="Mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-6 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                    <button type="submit" disabled={!message.trim()} className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20"><Send size={24} /></button>
                  </form>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200"><MessageCircle size={48} /></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Selecione uma conversa</h3>
                  <p className="text-sm text-slate-400 max-w-xs font-medium">Inicie o atendimento clicando em um contato ao lado.</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      </DesktopOnly>
    </AppLayout>
  );
}
