// hooks/useVideoPreloader.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for video preloading and management
 * @param {Array} videoSources - Array of video source URLs
 * @param {Object} options - Configuration options
 */
export function useVideoPreloader(videoSources, options = {}) {
  const {
    preloadCount = 2, // Number of videos to preload ahead
    autoPlay = true,
    loop = true,
    onVideoChange = null,
    onLoadProgress = null
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [isPreloading, setIsPreloading] = useState(true);
  const videoCache = useRef(new Map());
  const abortController = useRef(null);

  // Preload video with abort capability
  const preloadVideo = useCallback(async (src, priority = 'low') => {
    if (videoCache.current.has(src)) {
      return videoCache.current.get(src);
    }

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = src;
      video.preload = priority === 'high' ? 'auto' : 'metadata';
      video.muted = true;
      
      const handleLoad = () => {
        videoCache.current.set(src, video);
        setLoadedVideos(prev => new Set([...prev, src]));
        
        if (onLoadProgress) {
          const progress = (loadedVideos.size + 1) / videoSources.length;
          onLoadProgress(progress);
        }
        
        resolve(video);
      };

      const handleError = () => {
        reject(new Error(`Failed to load video: ${src}`));
      };

      video.addEventListener('canplaythrough', handleLoad);
      video.addEventListener('error', handleError);
      
      video.load();
    });
  }, [loadedVideos.size, videoSources.length, onLoadProgress]);

  // Strategic preloading
  useEffect(() => {
    if (!videoSources || videoSources.length === 0) return;

    abortController.current = new AbortController();
    
    const preloadStrategic = async () => {
      setIsPreloading(true);
      
      // High priority: current video
      await preloadVideo(videoSources[currentIndex], 'high');
      
      // Medium priority: next videos
      const preloadPromises = [];
      for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = (currentIndex + i) % videoSources.length;
        preloadPromises.push(preloadVideo(videoSources[nextIndex], 'medium'));
      }
      
      await Promise.allSettled(preloadPromises);
      setIsPreloading(false);
    };

    preloadStrategic();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [currentIndex, videoSources, preloadCount, preloadVideo]);

  // Handle video transition
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % videoSources.length;
    setCurrentIndex(nextIndex);
    
    if (onVideoChange) {
      onVideoChange(nextIndex);
    }
  }, [currentIndex, videoSources.length, onVideoChange]);

  const goToPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + videoSources.length) % videoSources.length;
    setCurrentIndex(prevIndex);
    
    if (onVideoChange) {
      onVideoChange(prevIndex);
    }
  }, [currentIndex, videoSources.length, onVideoChange]);

  const goToIndex = useCallback((index) => {
    if (index >= 0 && index < videoSources.length) {
      setCurrentIndex(index);
      
      if (onVideoChange) {
        onVideoChange(index);
      }
    }
  }, [videoSources.length, onVideoChange]);

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      videoCache.current.clear();
    };
  }, []);

  return {
    currentVideo: videoSources[currentIndex],
    currentIndex,
    isPreloading,
    loadedCount: loadedVideos.size,
    totalCount: videoSources.length,
    loadProgress: loadedVideos.size / videoSources.length,
    goToNext,
    goToPrevious,
    goToIndex,
    preloadedVideos: videoCache.current
  };
}