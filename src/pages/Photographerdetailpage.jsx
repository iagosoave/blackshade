import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import PhotographerPortfolio from '../components/Photographerportfolio';

export default function PhotographerDetailPage({ language }) {
  const { photographerId } = useParams();
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Dados mockados dos fotógrafos
  const photographersMap = {
    'juan-ribeiro': {
      id: 'juan-ribeiro',
      name: 'Juan Ribeiro',
      portfolio: [
        { id: 'juan-1', title: '', videoUrl: '', description: '' },
        { id: 'juan-2', title: '', videoUrl: '', description: '' },
        { id: 'juan-3', title: '', videoUrl: '', description: '' },
        { id: 'juan-4', title: '', videoUrl: '', description: '' },
        { id: 'juan-5', title: '', videoUrl: '', description: '' },
        { id: 'juan-6', title: '', videoUrl: '', description: '' },
        { id: 'juan-7', title: '', videoUrl: '', description: '' },
        { id: 'juan-8', title: '', videoUrl: '', description: '' }
      ]
    },
    'renata-massetti': {
      id: 'renata-massetti',
      name: 'Renata Massetti',
      portfolio: [
        { id: 'renata-1', title: '', videoUrl: '', description: '' },
        { id: 'renata-2', title: '', videoUrl: '', description: '' },
        { id: 'renata-3', title: '', videoUrl: '', description: '' },
        { id: 'renata-4', title: '', videoUrl: '', description: '' },
        { id: 'renata-5', title: '', videoUrl: '', description: '' },
        { id: 'renata-6', title: '', videoUrl: '', description: '' },
        { id: 'renata-7', title: '', videoUrl: '', description: '' },
        { id: 'renata-8', title: '', videoUrl: '', description: '' }
      ]
    }
  };

  const photographer = photographersMap[photographerId];

  const handleBack = () => {
    navigate('/fotografia');
  };

  const handleVideoOpen = (isOpen) => {
    setIsVideoOpen(isOpen);
  };

  if (!photographer) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-xl">Fotógrafo não foi encontrado</div>
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
      <PhotographerPortfolio
        photographer={photographer}
        onBack={handleBack}
        loading={false}
        onVideoOpen={handleVideoOpen}
        language={language}
      />
    </motion.div>
  );
}