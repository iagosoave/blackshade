import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import DirectorPortfolio from '../components/DirectorPortfolio';

export default function DirectorDetailPage({ language }) {
  const { directorId } = useParams();
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Dados mockados dos diretores com seus vídeos do Vimeo
  const directorsMap = {
    'alice-demier': {
      id: 'alice-demier',
      name: 'Alice Demier',
      portfolio: [
        {
          id: 'alice-1',
          title: 'ALICE DEMIER',
          thumbnail: '/imagens/alice.png',
          videoUrl: 'https://vimeo.com/1127911077',
          description: 'Trabalho de Alice Demier'
        }
      ]
    },
    'gustavo-vargas': {
      id: 'gustavo-vargas',
      name: 'Gus Vargas',
      portfolio: [
        {
          id: 'gus-1',
          title: 'GUS VARGAS',
          thumbnail: '/imagens/gus.png',
          videoUrl: 'https://vimeo.com/1127916716',
          description: 'Trabalho de Gus Vargas'
        }
      ]
    },
    'rafa-rocha': {
      id: 'rafa-rocha',
      name: 'Rafa Rocha',
      portfolio: [
        {
          id: 'rafa-1',
          title: 'RAFA ROCHA',
          thumbnail: '/imagens/rafa.png',
          videoUrl: 'https://vimeo.com/1125659431',
          description: 'Trabalho de Rafa Rocha'
        }
      ]
    },
    'renata-massetti': {
      id: 'renata-massetti',
      name: 'Renata Massetti',
      portfolio: [
        {
          id: 'renata-1',
          title: 'RENATA MASSETTI',
          thumbnail: '/imagens/renata.png',
          videoUrl: 'https://vimeo.com/1125658797',
          description: 'Trabalho de Renata Massetti'
        }
      ]
    }
  };

  const director = directorsMap[directorId];

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
        director={director}
        onBack={handleBack}
        loading={false}
        onVideoOpen={handleVideoOpen}
        language={language}
      />
    </motion.div>
  );
}