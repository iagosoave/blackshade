// src/pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ProfessionalVideoCarousel from "../components/ProfessionalVideoCarousel";

export default function HomePage() {
  // IMPORTANTE: Configure seus vídeos com as otimizações corretas
  const videos = [
    { url: '/videos/01.mp4' },
    { url: '/videos/02.mp4' },
    { url: '/videos/03.mp4' },
    { url: '/videos/04.mp4' },
    { url: '/videos/05.mp4' },
    { url: '/videos/06.mp4' },
    { url: '/videos/07.mp4' },
    { url: '/videos/08.mp4' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      <ProfessionalVideoCarousel videos={videos} />
    </motion.div>
  );
}