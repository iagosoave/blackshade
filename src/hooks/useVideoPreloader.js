// hooks/useVideoPreloader.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for video preloading and management
 * @param {Array} videoSources - Array of video source URLs
 */
export function useVideoPreloader(videoSources) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const videoCache = useRef(new Map());

  // Pré-carrega um vídeo e o armazena em cache
  const preloadVideo = useCallback((src) => {
    if (videoCache.current.has(src)) {
      return videoCache.current.get(src);
    }
    
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto'; // Garante o pré-carregamento do vídeo inteiro
      video.muted = true;
      video.playsInline = true;

      const handleLoaded = () => {
        videoCache.current.set(src, video);
        setLoadedVideos(prev => new Set([...prev, src]));
        video.removeEventListener('loadeddata', handleLoaded);
        resolve(video);
      };

      video.addEventListener('loadeddata', handleLoaded);
      video.load();
    });
  }, []);

  // Lógica para pré-carregar vídeos de forma estratégica
  useEffect(() => {
    if (!videoSources || videoSources.length === 0) return;

    // Pré-carrega o vídeo atual e o próximo
    preloadVideo(videoSources[currentIndex]);
    const nextIndex = (currentIndex + 1) % videoSources.length;
    preloadVideo(videoSources[nextIndex]);

    return () => {
      // Limpeza opcional se necessário, mas o cache pode ser útil
    };
  }, [currentIndex, videoSources, preloadVideo]);

  // Funções de navegação
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % videoSources.length;
    setCurrentIndex(nextIndex);
  }, [currentIndex, videoSources.length]);

  return {
    currentVideo: videoSources[currentIndex],
    nextVideo: videoSources[(currentIndex + 1) % videoSources.length],
    goToNext,
  };
}