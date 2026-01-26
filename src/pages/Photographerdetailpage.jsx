import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import PhotographerGallery from '../components/PhotographerGallery';

export default function PhotographerDetailPage({ language }) {
  const { photographerId } = useParams();
  const navigate = useNavigate();

  // Gerar array de imagens do Juan com os formatos corretos
  const juanImages = useMemo(() => {
    // Mapeamento de arquivos com extensões diferentes de .jpg
    const specialFormats = {
      '05': 'jpeg',
      '12': 'png',
      '16': 'png',
      '27': 'png',
      '29': 'jpeg',
      '37': 'jpeg',
      '42': 'png',
      '46': 'JPG',
      '50': 'jpeg',
      '54': 'png',
      '61': 'jpeg',
      '66': 'JPG',
      '68': 'jpeg',
      '72': 'JPG',
      '79': 'jpeg',
      '83': 'jpeg',
      '84': 'jpeg'
    };

    const images = [];
    for (let i = 1; i <= 87; i++) {
      const num = i.toString().padStart(2, '0');
      const extension = specialFormats[num] || 'jpg';
      images.push(`/imagens/${num}_juan.${extension}`);
    }
    return images;
  }, []);

  // Dados dos fotógrafos
  const photographersMap = {
    'juan-ribeiro': {
      id: 'juan-ribeiro',
      name: 'Juan Ribeiro',
      images: juanImages
    },
    'renata-massetti': {
      id: 'renata-massetti',
      name: 'Renata Massetti',
      images: [] // Sem imagens por enquanto
    }
  };

  const photographer = photographersMap[photographerId];

  // Volta para a lista de fotógrafos
  const handleBack = () => {
    navigate('/fotografia');
  };

  if (!photographer) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-xl">Fotógrafo não encontrado</div>
      </motion.div>
    );
  }

  // Se não tem imagens, mostra mensagem
  if (!photographer.images || photographer.images.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Botão Voltar */}
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
          <button
            className="text-white/70 hover:text-white flex items-center justify-center w-12 h-12 md:w-10 md:h-10 transition-all hover:scale-110 group"
            onClick={handleBack}
            aria-label="Voltar"
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/60 text-xl">Em breve</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PhotographerGallery
        images={photographer.images}
        onBack={handleBack}
      />
    </motion.div>
  );
}