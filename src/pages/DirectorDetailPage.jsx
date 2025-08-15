import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import DirectorPortfolio from '../components/DirectorPortfolio';
import useContentful from '../hocks/useContentful';

export default function DirectorDetailPage({ language }) {
  const { directorId } = useParams();
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Mapear o ID para o nome do diretor
  const directorsMap = {
    'alice-demier': { id: 'alice-demier', name: 'Alice Demier' },
    'gustavo-vargas': { id: 'gustavo-vargas', name: 'Gus Vargas' },
    'rafa-rocha': { id: 'rafa-rocha', name: 'Rafa Rocha' },
    'renata-massetti': { id: 'renata-massetti', name: 'Renata Massetti' }
  };

  const director = directorsMap[directorId];

  // Buscar portfolio do diretor
  const { data: portfolioData, loading } = useContentful(
    director ? `director-${director.id}` : null
  );

  const directorWithPortfolio = director ? {
    ...director,
    portfolio: portfolioData || []
  } : null;

  const handleBack = () => {
    navigate('/diretores');
  };

  const handleVideoOpen = (isOpen) => {
    setIsVideoOpen(isOpen);
  };

  if (!director) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-xl">Diretor não encontrado</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
    >
      <DirectorPortfolio
        director={directorWithPortfolio}
        onBack={handleBack}
        loading={loading}
        onVideoOpen={handleVideoOpen}
        language={language}
      />
    </motion.div>
  );
}