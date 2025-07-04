import React from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hocks/useContentful';
import ProjectGrid from '../components/ProjectGrid';
import { translations } from '../config/translations';

export default function AISection({ language }) {
  const { data: aiItems, loading } = useContentful('ai');
  const t = translations[language] || translations.pt;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{t.ai.loading}</div>
      </div>
    );
  }

  const handleSelectItem = (item) => {
    // Abrir o projeto em nova aba
    if (item.projectUrl) {
      window.open(item.projectUrl, '_blank');
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
        {t.ai.title}
      </motion.h2>

      <ProjectGrid items={aiItems || []} onSelectItem={handleSelectItem} language={language} />
    </div>
  );
}