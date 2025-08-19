// components/BackgroundVideo.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * BackgroundVideo Component - Optimized for 2025
 * Features:
 * - Instant transitions between videos
 * - Preloading strategy for smooth playback
 * - Memory optimization
 * - Performance monitoring
 */
export default function BackgroundVideo({ 
  videos, 
  opacity = 1, 
  loop = false,
  transitionSpeed = 'instant', // 'instant' | 'fast' | 'smooth'
  preloadStrategy = 'progressive' // 'all' | 'progressive' | 'lazy'
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const preloadedVideos = useRef(new Map());

  // Determine transition class based on speed
  const transitionClass = useMemo(() => {
    switch (transitionSpeed) {
      case 'instant': return '';
      case 'fast': return 'transition-opacity duration-150';
      case 'smooth': return 'transition-opacity duration-500';
      default: return '';
    }
  }, [transitionSpeed]);

  // Preload videos based on strategy
  useEffect(() => {
    const preloadVideo = (src, index) => {
      if (preloadedVideos.current.has(src)) return;
      
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      
      video.addEventListener('canplaythrough', () => {
        preloadedVideos.current.set(src, true);
        console.log(`Video ${index} preloaded`);
      });
      
      video.load();
    };

    if (preloadStrategy === 'all') {
      // Preload all videos at once
      videos.forEach((src, index) => preloadVideo(src, index));
    } else if (preloadStrategy === 'progressive') {
      // Preload current and next 2 videos
      const indicesToPreload = [
        currentVideoIndex,
        (currentVideoIndex + 1) % videos.length,
        (currentVideoIndex + 2) % videos.length
      ];
      indicesToPreload.forEach(index => preloadVideo(videos[index], index));
    }
    // 'lazy' strategy doesn't preload
  }, [currentVideoIndex, videos, preloadStrategy]);

  const handleVideoEnd = useCallback(() => {
    if (!loop && currentVideoIndex === videos.length - 1) return;
    
    setIsTransitioning(true);
    
    // For instant transition, change immediately
    if (transitionSpeed === 'instant') {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      setIsTransitioning(false);
    } else {
      // For smooth transitions, wait for fade
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setIsTransitioning(false);
      }, transitionSpeed === 'fast' ? 150 : 500);
    }
  }, [videos.length, loop, currentVideoIndex, transitionSpeed]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Video configuration
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.setAttribute('webkit-playsinline', 'true');
    
    // Handle single video loop
    if (videos.length === 1 && loop) {
      videoElement.loop = true;
    } else {
      videoElement.loop = false;
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    // Auto-play with fallback
    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (err) {
        console.warn('Autoplay failed, attempting with user interaction:', err);
        // Fallback: play on first user interaction
        const playOnInteraction = () => {
          videoElement.play();
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
      }
    };

    if (videoElement.readyState >= 3) {
      playVideo();
    } else {
      videoElement.addEventListener('loadeddata', playVideo);
    }

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
      videoElement.removeEventListener('loadeddata', playVideo);
    };
  }, [currentVideoIndex, videos.length, handleVideoEnd, loop]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        key={`video-${currentVideoIndex}`}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={false}
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover ${transitionClass}`}
        style={{ 
          opacity: isTransitioning && transitionSpeed !== 'instant' ? 0 : opacity, 
          pointerEvents: 'none' 
        }}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}