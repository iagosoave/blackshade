import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import PhotographerGallery from '../components/PhotographerGallery';

export default function PhotographerDetailPage({ language }) {
  const { photographerId } = useParams();
  const navigate = useNavigate();

  // 1. GERA A LISTA DE IMAGENS AUTOMATICAMENTE (Simples e Rápido)
  const juanImages = useMemo(() => {
    const images = [];
    // Gera de 01 a 87 (assumindo que todas são .webp agora)
    for (let i = 1; i <= 87; i++) {
      const num = i.toString().padStart(2, '0');
      images.push(`/imagens/${num}_juan.webp`);
    }
    return images;
  }, []);

  const photographersMap = {
    'juan-ribeiro': {
      id: 'juan-ribeiro',
      name: 'Juan Ribeiro',
      images: juanImages
    },
    'renata-massetti': {
      id: 'renata-massetti',
      name: 'Renata Massetti',
      images: []
    }
  };

  const photographer = photographersMap[photographerId];

  const handleBack = () => {
    navigate('/fotografia');
  };

  if (!photographer) return null;

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