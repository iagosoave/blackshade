// src/pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from "../components/BackgroundVideo";

export default function HomePage() {
  // IMPORTANTE: Vídeos agora em public/videos/
  const videos = [
    '/videos/01.mp4',
    '/videos/02.mp4',
    '/videos/03.mp4',
    '/videos/04.mp4',
    '/videos/05.mp4',
    '/videos/06.mp4',
    '/videos/07.mp4',
    '/videos/08.mp4'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      <BackgroundVideo 
        videos={videos} 
        opacity={1} 
        loop={true}
      />
    </motion.div>
  );
}