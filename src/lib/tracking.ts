export interface TrackingData {
  fbc?: string;
  fbp?: string;
  userAgent?: string;
}

const STORAGE_KEY = 'pediai_tracking';

export function captureTrackingData() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  const gclid = urlParams.get('gclid');

  let currentData: any = {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) currentData = JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing stored tracking data', e);
  }

  // Handle FBC (Facebook Click ID)
  if (fbclid) {
    const creationTime = Date.now();
    currentData.fbc = `fb.1.${creationTime}.${fbclid}`;
  }

  // Handle GCLID (Google Click ID) - optional but useful
  if (gclid) {
    currentData.gclid = gclid;
  }

  // Handle FBP (Facebook Browser ID)
  // Look for the cookie set by the FB Pixel if it exists
  const fbpCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_fbp='));
  
  if (fbpCookie) {
    currentData.fbp = fbpCookie.split('=')[1];
  }

  // Always update User Agent
  currentData.userAgent = navigator.userAgent;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
}

export function getTrackingData(): TrackingData {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}
