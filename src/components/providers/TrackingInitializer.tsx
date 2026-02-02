'use client';

import React from 'react';
import { captureTrackingData } from '@/lib/tracking';

export function TrackingInitializer() {
  React.useEffect(() => {
    // Capture tracking data on mount
    captureTrackingData();
    
    // Also capture when visibility changes (could capture fbp if it was set via pixel in the meantime)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        captureTrackingData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return null;
}
