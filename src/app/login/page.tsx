"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Smartphone,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  MessageCircle,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type LoginStep = "identifier" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [whatsappCode, setWhatsappCode] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/');
    }
  }, [router]);

  // Auto-focus first OTP field
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [step]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!identifier) return toast.error("Por favor, informe seu e-mail ou WhatsApp.");

    setLoading(true);
    const result = await authService.sendOTP(identifier);
    setLoading(false);

    if (result.success) {
      setStep("otp");
      if (result.code) {
        setWhatsappCode(result.code);
      } else {
        setWhatsappCode(null);
      }
      toast.success("Código gerado com sucesso!");
    } else {
      toast.error(result.error);
    }
  };

  const handleFocusCodeInput = () => {
    // Just focus the first OTP input
    otpRefs[0].current?.focus();
    toast.info("Digite o código que aparece acima 👆");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return toast.error("Informe o código completo.");

    setLoading(true);
    const result = await authService.verifyOTP(identifier, fullOtp);
    setLoading(false);

    if (result.success) {
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 p-10 md:p-12 border border-slate-100">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 mb-6 group cursor-pointer hover:rotate-6 transition-transform">
              <UtensilsCrossed size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              INDIOS <span className="text-primary">BURGUER</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Painel Administrativo</p>
          </div>

          <AnimatePresence mode="wait">
            {step === "identifier" ? (
              <motion.div
                key="step-identifier"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Bem-vindo de volta!</h2>
                  <p className="text-slate-500 text-sm font-medium">Informe seus dados para receber o código de acesso.</p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail ou WhatsApp</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                        <Smartphone size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="(11) 99999-9999 ou seu@email.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        Enviar Código
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Seguro & Sem Senha</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep("identifier")}
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="text-center space-y-3 mb-8">
                    <h3 className="text-xl font-black text-slate-800">Verifique seu código</h3>
                    <p className="text-slate-500 text-sm">Enviado para: {identifier}</p>

                    {/* CÓDIGO VISUAL */}
                    {whatsappCode && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl"
                      >
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Seu Código</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-4xl font-black text-emerald-600 tracking-widest select-all">
                            {whatsappCode}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(whatsappCode);
                              toast.success("Código copiado! 📋");
                            }}
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Copiar código"
                          >
                            📋
                          </button>
                        </div>
                        <p className="text-xs text-emerald-600 mt-2">Digite este código abaixo para fazer login</p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-primary/40 focus:bg-white rounded-xl text-center text-xl font-black text-slate-800 outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  {whatsappCode && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleFocusCodeInput}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <MessageCircle size={20} />
                      Ir para o Campo de Código
                    </motion.button>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        Entrar no Painel
                        <ShieldCheck size={20} />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={handleSendOTP}
                      disabled={resending}
                      className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                    >
                      {resending ? "Reenviando..." : "Não recebeu o código? Reenviar"}
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-1">Dica Pro</h4>
                    <p className="text-[10px] font-bold text-emerald-600/80 leading-relaxed">
                      Verifique seu WhatsApp. O código geralmente chega em menos de 10 segundos.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Criptografia de Ponta a Ponta</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400">© 2026 PediAi - Inteligência em Delivery</p>
        </div>
      </motion.div>
    </div>
  );
}
