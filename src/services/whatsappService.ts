const BASE_URL = 'https://evolution-api-production-5853.up.railway.app';
const API_KEY = '6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7';
const INSTANCE_NAME = 'AdminPediaAI';

export interface InstanceStatus {
  instance: {
    instanceName: string;
    status: string;
  }
}

export interface QRCodeResponse {
  base64?: string;
  code?: string;
  pairingCode?: string;
}

class WhatsAppService {
  private headers = {
    'Content-Type': 'application/json',
    'apikey': API_KEY,
  };

  private currentInstance = INSTANCE_NAME;

  setInstanceName(name: string) {
    this.currentInstance = name;
  }

  getInstanceName() {
    return this.currentInstance;
  }

  async getInstanceStatus(): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/instance/connectionState/${this.currentInstance}`, {
        headers: this.headers,
      });
      if (response.status === 404) return 'NOT_FOUND';
      const data = await response.json();
      return data.instance?.state || 'DISCONNECTED';
    } catch (error) {
      console.error('Error fetching instance status:', error);
      return 'ERROR';
    }
  }

  async fetchInstances(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/instance/fetchInstances`, {
        headers: this.headers,
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching instances:', error);
      return [];
    }
  }

  async createInstance(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Creating instance:', this.currentInstance);
      const response = await fetch(`${BASE_URL}/instance/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          instanceName: this.currentInstance,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        return { 
          success: false, 
          error: data.response?.message || data.message || "Erro desconhecido no servidor" 
        };
      }
      return { success: true };
    } catch (error) {
      console.error('Error creating instance:', error);
      return { success: false, error: "Falha na conexão com o servidor Railway" };
    }
  }

  async getQRCode(): Promise<QRCodeResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}/instance/connect/${this.currentInstance}`, {
        headers: this.headers,
      });
      const data = await response.json();
      
      if (data.qrcode) {
        return {
          base64: data.qrcode.base64,
          code: data.qrcode.code,
          pairingCode: data.pairingCode
        };
      }
      if (data.base64) return data;
      return data;
    } catch (error) {
      console.error('Error fetching QR Code:', error);
      return null;
    }
  }

  async getPairingCode(phoneNumber: string): Promise<string | null> {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      const res1 = await fetch(`${BASE_URL}/instance/connect/pairing/${this.currentInstance}?number=${cleanNumber}`, {
        headers: this.headers,
      });
      
      if (res1.ok) {
        const data1 = await res1.json();
        const code = data1.code || data1.pairingCode;
        if (code && typeof code === 'string' && code.length < 15) return code;
      }

      const res2 = await fetch(`${BASE_URL}/instance/connect/${this.currentInstance}?number=${cleanNumber}`, {
        headers: this.headers,
      });
      
      if (res2.ok) {
        const data2 = await res2.json();
        const code = data2.pairingCode || data2.code;
        if (code && typeof code === 'string' && code.length < 15) return code;
      }

      return null;
    } catch (error) {
      console.error('Error fetching Pairing Code:', error);
      return null;
    }
  }

  async deleteInstance(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/instance/delete/${this.currentInstance}`, {
        method: 'DELETE',
        headers: this.headers,
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting instance:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/instance/logout/${this.currentInstance}`, {
        method: 'DELETE',
        headers: this.headers,
      });
      return response.ok;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  async getChats(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/chat/findChats/${this.currentInstance}`, {
        headers: this.headers,
      });
      const data = await response.json();
      return Array.isArray(data) ? data : (data.instance || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  }

  async getMessages(remoteJid: string): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/chat/findMessages/${this.currentInstance}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          where: {
            remoteJid: remoteJid,
          },
          take: 50,
        }),
      });
      const data = await response.json();
      return data.instance || data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(remoteJid: string, text: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/message/sendText/${this.currentInstance}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: remoteJid,
          text: text,
          delay: 1200,
          linkPreview: true,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async sendMediaMessage(remoteJid: string, media: string, caption: string, type: 'image' | 'video' | 'document' = 'image'): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/message/sendMedia/${this.currentInstance}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: remoteJid,
          media: media,
          mediatype: type,
          caption: caption,
          delay: 1200,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending media message:', error);
      return false;
    }
  }

  /**
   * Sends messages to multiple numbers with a delay between them.
   * This is a client-side implementation of bulk sending.
   */
  async sendBulkMessages(
    contacts: { phone: string; name?: string }[],
    messageTemplate: string,
    mediaUrl?: string,
    onProgress?: (index: number, success: boolean) => void
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const personalizedMessage = messageTemplate.replace(/\{\{name\}\}/g, contact.name || "cliente");
      
      const remoteJid = contact.phone.includes('@') ? contact.phone : `${contact.phone}@s.whatsapp.net`;
      
      let success = false;
      if (mediaUrl) {
        success = await this.sendMediaMessage(remoteJid, mediaUrl, personalizedMessage, 'image');
      } else {
        success = await this.sendMessage(remoteJid, personalizedMessage);
      }
      
      if (success) {
        sent++;
      } else {
        failed++;
      }

      if (onProgress) {
        onProgress(i, success);
      }

      // Add a random delay between 2 and 5 seconds to look more human
      if (i < contacts.length - 1) {
        const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return { sent, failed };
  }
}

export const whatsappService = new WhatsAppService();
