import React from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from "../components/BackgroundVideo";

// Importe todos os vídeos da home que você deseja
import backgroundVideo1 from "../01.mp4";
import backgroundVideo2 from "../02.mp4";
import backgroundVideo3 from "../03.mp4";
import backgroundVideo4 from "../04.mp4";
import backgroundVideo5 from "../05.mp4";
import backgroundVideo6 from "../06.mp4";
import backgroundVideo7 from "../07.mp4";
import backgroundVideo8 from "../08.mp4";


export default function HomePage() {
  const videos = [
    backgroundVideo1,
    backgroundVideo2,
    backgroundVideo3,
    backgroundVideo4,
    backgroundVideo5,
    backgroundVideo6,
    backgroundVideo7,
    backgroundVideo8,
  ];

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