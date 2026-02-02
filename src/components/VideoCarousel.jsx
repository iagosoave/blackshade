import React, { useState, useEffect, useRef, useCallback } from 'react';

// Vídeos com ambos os formatos — MP4 é obrigatório para iOS/Safari
const VIDEOS = [
  { webm: '/videos/01.webm', mp4: '/videos/01.mp4' },
  { webm: '/videos/02.webm', mp4: '/videos/02.mp4' },
  { webm: '/videos/03.webm', mp4: '/videos/03.mp4' },
  { webm: '/videos/04.webm', mp4: '/videos/04.mp4' },
  { webm: '/videos/05.webm', mp4: '/videos/05.mp4' },
];

// Detecta se o dispositivo é iOS ou Safari (não suportam WebM)
const getIsIOS = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
};

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const isTransitioning = useRef(false);
  const isiOS = useRef(getIsIOS());

  // Retorna a URL de vídeo correta pro dispositivo
  const getVideoSrc = useCallback(
    (index) => (isiOS.current ? VIDEOS[index].mp4 : VIDEOS[index].webm),
    []
  );

  // ── Tenta dar play no vídeo atual ──────────────────────────────
  const attemptPlay = useCallback(async (video) => {
    if (!video) return;
    try {
      video.currentTime = 0;
      await video.play();
      setIsVideoPlaying(true);
      setNeedsTap(false);
    } catch {
      // Autoplay bloqueado (iOS low-power, etc.)
      setNeedsTap(true);
    }
  }, []);

  // ── Carrega e inicia o primeiro vídeo ──────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // No iOS, 'loadeddata' dispara mais rápido que 'canplaythrough'
    const evt = isiOS.current ? 'loadeddata' : 'canplaythrough';

    const onReady = () => attemptPlay(video);

    if (video.readyState >= (isiOS.current ? 2 : 4)) {
      onReady();
    } else {
      video.addEventListener(evt, onReady, { once: true });
    }

    return () => video.removeEventListener(evt, onReady);
  }, [currentIndex, attemptPlay]);

  // ── Pré-carrega o próximo vídeo ────────────────────────────────
  useEffect(() => {
    const next = nextVideoRef.current;
    if (!next) return;
    const nextIdx = (currentIndex + 1) % VIDEOS.length;
    next.src = getVideoSrc(nextIdx);
    next.load();
  }, [currentIndex, getVideoSrc]);

  // ── Transição quando o vídeo atual termina ─────────────────────
  const handleEnded = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const curr = videoRef.current;
    const next = nextVideoRef.current;

    if (next && curr) {
      // Cross-fade: mostra o próximo por cima
      next.style.opacity = '1';
      next.style.zIndex = '2';
      next.play().catch(() => {});

      curr.style.opacity = '0';
      curr.style.zIndex = '1';
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
      isTransitioning.current = false;

      if (curr) {
        curr.style.opacity = '1';
        curr.style.zIndex = '2';
      }
      if (next) {
        next.style.opacity = '0';
        next.style.zIndex = '1';
      }
    }, 400);
  }, []);

  // ── Pausa/retoma quando a aba fica oculta ──────────────────────
  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── Tap manual caso autoplay esteja bloqueado ──────────────────
  const handleTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => {
      setIsVideoPlaying(true);
      setNeedsTap(false);
    }).catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">

      {/* ── Vídeo atual ── */}
      <video
        ref={videoRef}
        key={`v-${currentIndex}`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: isVideoPlaying ? 1 : 0,
          zIndex: 3,
          transition: 'opacity 0.7s ease',
        }}
        muted
        playsInline
        webkit-playsinline="true"
        preload={isiOS.current ? 'metadata' : 'auto'}
        onEnded={handleEnded}
      >
        {/* MP4 primeiro para iOS, WebM como alternativa */}
        <source src={VIDEOS[currentIndex].mp4} type="video/mp4" />
        <source src={VIDEOS[currentIndex].webm} type="video/webm" />
      </video>

      {/* ── Próximo vídeo (pré-carregado, invisível) ── */}
      <video
        ref={nextVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, zIndex: 2, transition: 'opacity 0.4s ease' }}
        muted
        playsInline
        webkit-playsinline="true"
        preload="none"
      />

      {/* ── Botão de play caso autoplay esteja bloqueado (iOS low-power) ── */}
      {needsTap && (
        <button
          className="absolute inset-0 z-20 flex items-center justify-center"
          onClick={handleTap}
          aria-label="Reproduzir vídeo"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          >
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

    </div>
  );
}
