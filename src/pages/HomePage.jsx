import React from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from "../components/BackgroundVideo";

// Importe todos os vídeos da home que você deseja
import backgroundVideo1 from "../01.mp4";
import backgroundVideo2 from "../02.mp4";

export default function HomePage() {
  const videos = [backgroundVideo1, backgroundVideo2];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 w-full h-full"
    >
      <BackgroundVideo videos={videos} opacity={1} loop={true} />
    </motion.div>
  );
}