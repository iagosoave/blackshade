// src/components/VideoCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function VideoCarousel() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const videos = [
   '/videos/01.webm',
    '/videos/02.webm',
    '/videos/03.webm',
    '/videos/04.webm',
    '/videos/05.webm',
    '/videos/06.webm',
    '/videos/07.webm',
    '/videos/08.webm'
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videos[currentVideoIndex];
    video.load();

    const handleCanPlay = () => {
      video.play().catch(() => {
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentVideoIndex, videos]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        onEnded={handleVideoEnded}
      />
    </div>
  );
}