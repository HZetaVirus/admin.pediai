import { supabase } from "@/lib/supabase";
import { whatsappService } from "./whatsappService";

export interface AuthSession {
  user: {
    id: string;
    email: string;
    phone: string;
    full_name: string;
    role?: string;
  } | null;
}

class AuthService {
  private SESSION_KEY = 'pediai_admin_session';

  private normalizeIdentifier(identifier: string): string {
    let normalized = identifier.trim();
    if (!normalized.includes('@')) {
      // Remove all non-digits
      normalized = normalized.replace(/\D/g, '');
      // Add 55 if missing for Brazil numbers (10 or 11 digits)
      if (normalized.length >= 10 && normalized.length <= 11 && !normalized.startsWith('55')) {
        normalized = '55' + normalized;
      }
    }
    return normalized;
  }

  /**
   * Generates and sends a 6-digit OTP to the provided identifier (phone or email).
   */
  async sendOTP(identifier: string): Promise<{ success: boolean; code?: string; error?: string }> {
    try {
      const normalizedIdentifier = this.normalizeIdentifier(identifier);
      const isEmail = normalizedIdentifier.includes('@');
      console.log(`[AUTH] Sending OTP: ${normalizedIdentifier} (${isEmail ? 'Email' : 'WhatsApp/Direct'})`);

      // 1. Check if the user exists in the profiles table (security check)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, email')
        .or(`phone.eq.${normalizedIdentifier},email.eq.${normalizedIdentifier}`)
        .single();

      if (profileError || !profile) {
        return { success: false, error: "Usuário não encontrado. Verifique os dados informados." };
      }

      if (isEmail) {
        // --- EMAIL CHANNEL (Supabase Native) ---
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: normalizedIdentifier,
        });
        
        if (authError) {
          console.error("Supabase Auth Email Error:", authError);
          return { success: false, error: "Erro ao enviar e-mail via Supabase." };
        }
        return { success: true };
      } else {
        // --- WHATSAPP CHANNEL (Direct Link - Custom) ---
        // 2. Generate a 6-digit code for custom flow
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        // 3. Store OTP in database (using our fallback table since we aren't using Supabase SMS API)
        const { error: otpError } = await (supabase as any)
          .from('auth_otps')
          .insert({
            identifier: normalizedIdentifier,
            code,
            expires_at: expiresAt.toISOString(),
          });

        if (otpError) throw otpError;

        // Return success + the code so the frontend can open the WhatsApp link
        return { success: true, code };
      }
    } catch (error) {
      console.error("Error in sendOTP:", error);
      return { success: false, error: "Ocorreu um erro interno ao enviar o código." };
    }
  }

  /**
   * Verifies the OTP via Supabase Auth or our custom table.
   */
  async verifyOTP(identifier: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const normalizedIdentifier = this.normalizeIdentifier(identifier);
      const isEmail = normalizedIdentifier.includes('@');

      if (isEmail) {
        // --- EMAIL VERIFICATION (Supabase Native) ---
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: normalizedIdentifier,
          token: code,
          type: 'email'
        });

        if (verifyError) {
          return { success: false, error: "Código de e-mail inválido ou expirado." };
        }
      } else {
        // --- WHATSAPP VERIFICATION (Custom DB check for Direct Flow) ---
        const { data, error } = await (supabase as any)
          .from('auth_otps')
          .select('*')
          .eq('identifier', normalizedIdentifier)
          .eq('code', code)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !data) {
          return { success: false, error: "Código de WhatsApp inválido ou expirado." };
        }

        // Cleanup: Delete used OTP
        await (supabase as any).from('auth_otps').delete().eq('id', data.id);
      }

      // Common: Fetch full profile info to build session
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .or(`phone.eq.${normalizedIdentifier},email.eq.${normalizedIdentifier}`)
        .single();

      if (profile) {
        // Create local session
        const session: AuthSession = {
          user: {
            id: profile.id,
            email: profile.email || '',
            phone: profile.phone || '', 
            full_name: (profile as any).full_name || (profile as any).name || 'Restaurante',
            role: profile.role || 'restaurant_owner'
          }
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true };
      }

      return { success: false, error: "Erro ao carregar perfil do usuário." };
    } catch (error) {
      console.error("Error in verifyOTP:", error);
      return { success: false, error: "Erro durante a verificação do código." };
    }
  }

  /**
   * Clears the current session.
   */
  async signOut(): Promise<void> {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = '/login';
  }

  /**
   * Gets the current session.
   */
  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem(this.SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }

  /**
   * Sends OTP code directly via WhatsApp API (not via web link)
   */
  async sendWhatsAppOTP(identifier: string, code: string): Promise<{ success: boolean; error?: string; needsConnection?: boolean }> {
    try {
      // First, check if WhatsApp is connected
      const status = await whatsappService.getInstanceStatus();
      
      if (status !== 'open') {
        return { 
          success: false, 
          error: "WhatsApp não está conectado. Por favor, conecte o WhatsApp primeiro na página de WhatsApp.",
          needsConnection: true
        };
      }

      const normalizedIdentifier = this.normalizeIdentifier(identifier);
      
      // Format phone number for WhatsApp (remove country code prefix if exists for the JID)
      const phoneForWhatsApp = normalizedIdentifier.replace(/\D/g, '');
      
      // WhatsApp JID format: phone@s.whatsapp.net
      const whatsappJID = `${phoneForWhatsApp}@s.whatsapp.net`;
      
      const message = `🔐 *PediAi - Código de Acesso*\n\nSeu código é: *${code}*\n\n✅ Digite este código na tela de login.\n⏰ Válido por 10 minutos.`;
      
      // Send via WhatsApp API
      const sent = await whatsappService.sendMessage(whatsappJID, message);
      
      if (sent) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: "Não foi possível enviar a mensagem. Verifique se o número está correto e tente novamente."
        };
      }
    } catch (error: any) {
      console.error("Error in sendWhatsAppOTP:", error);
      const errorMessage = error?.message || "Erro ao enviar código via WhatsApp";
      return { 
        success: false, 
        error: errorMessage.includes('500') 
          ? "Serviço de WhatsApp temporariamente indisponível. Tente novamente em instantes."
          : errorMessage
      };
    }
  }

  /**
   * Checks if user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

export const authService = new AuthService();
