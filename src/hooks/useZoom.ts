import { useState, useEffect, useCallback } from 'react';

export interface UseZoomReturn {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.1;
const DEFAULT_ZOOM = 1.0;

export function useZoom(): UseZoomReturn {
  const [zoomLevel, setZoomLevel] = useState(() => {
    // Load saved zoom level from localStorage
    try {
      const saved = localStorage.getItem('app_zoom_level');
      return saved ? parseFloat(saved) : DEFAULT_ZOOM;
    } catch {
      return DEFAULT_ZOOM;
    }
  });

  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(DEFAULT_ZOOM);
  }, []);

  // Apply zoom to document root and save to localStorage
  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel * 16}px`;
    
    try {
      localStorage.setItem('app_zoom_level', zoomLevel.toString());
    } catch {
      // Ignore localStorage errors
    }
  }, [zoomLevel]);

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom
  };
}