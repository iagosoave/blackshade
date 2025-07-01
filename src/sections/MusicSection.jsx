import React from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hocks/useContentful';
import ProjectGrid from '../components/ProjectGrid';

export default function MusicSection({ language }) {
  const { data: musicItems, loading } = useContentful('music');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const handleSelectItem = (item) => {
    // Abrir o vídeo/áudio em nova aba ou modal
    if (item.mediaUrl) {
      window.open(item.mediaUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen">
      <motion.h2 
        className="fixed top-20 left-6 text-white text-4xl md:text-5xl z-10"
        style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {language === 'pt' ? 'MÚSICA' : 'MUSIC'}
      </motion.h2>

      <ProjectGrid items={musicItems || []} onSelectItem={handleSelectItem} />
    </div>
  );
}