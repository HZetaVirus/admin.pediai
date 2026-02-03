declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-B8T727YS55';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

interface GtagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GtagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Helper to get GA Cookies for Server-Side Tracking
export const getGATrackingData = () => {
  if (typeof document === 'undefined') return null;

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // _ga (Client ID) -> GA1.1.CLIENT_ID
  // _ga_XXXXXXXX (Session ID) -> GS1.1.SESSION_ID...
  
  const clientIdCookie = getCookie('_ga');
  
  // Find the session cookie (starts with _ga_)
  const cookies = document.cookie.split(';').map(c => c.trim());
  const sessionCookieName = cookies.find(c => c.startsWith(`_ga_${GA_MEASUREMENT_ID.replace('G-', '')}`))?.split('=')[0];
  const sessionIdCookie = sessionCookieName ? getCookie(sessionCookieName) : null;

  let client_id = null;
  let session_id = null;

  if (clientIdCookie) {
    // Format: GA1.1.123456789.123456789 (version.level.cid.cid) or just cid.cid
    const parts = clientIdCookie.split('.');
    if (parts.length >= 3) {
       // Typically GA1.1.956829379.1738520000
       client_id = parts.slice(2).join('.');
    } else {
       client_id = clientIdCookie;
    }
  }

  if (sessionIdCookie) {
    // Format: GS1.1.123456789.1.1.123456789.0.0.0
    const parts = sessionIdCookie.split('.');
    if (parts.length >= 3) {
      session_id = parts[2];
    }
  }

  return {
    client_id,
    session_id
  };
};
