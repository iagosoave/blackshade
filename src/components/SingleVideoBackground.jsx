// src/components/SingleVideoBackground.jsx
import React, { useRef, useEffect } from 'react';

export default function SingleVideoBackground({ videoUrl, opacity = 0.3 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Tenta tocar o vídeo
    video.play().catch(() => {
      // Se falhar, espera interação
      document.addEventListener('click', () => {
        video.play();
      }, { once: true });
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
        src={videoUrl}
        muted
        loop
        playsInline
        autoPlay
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay escuro */}
    </div>
  );
}