import React from 'react';
import { motion } from 'framer-motion';
import useContentful from '../hocks/useContentful';
import ProjectGrid from '../components/ProjectGrid';
import { translations } from '../config/translations';

export default function DaydreamSection({ language, onVideoOpen }) {
  const { data: aiItems, loading } = useContentful('ai');
  const t = translations[language] || translations.pt;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{t.daydream.loading}</div>
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
      <ProjectGrid items={aiItems || []} onSelectItem={handleSelectItem} language={language} />
    </div>
  );
}