import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DirectorsList from '../components/DirectorsList';

export default function DirectorsPage({ language }) {
  const navigate = useNavigate();

  const directors = [
    { id: 'alice-demier', name: 'Alice Demier', bannerImage: '' },
    { id: 'gustavo-vargas', name: 'Gus Vargas', bannerImage: '' },
    { id: 'rafa-rocha', name: 'Rafa Rocha', bannerImage: '' },
    { id: 'renata-massetti', name: 'Renata Massetti', bannerImage: '' }
  ];

  const handleClose = () => {
    navigate('/');
  };

  const handleSelectDirector = (director) => {
    navigate(`/diretores/${director.id}`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" />
      
      <motion.div
        className="relative w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.button
          className="absolute top-6 right-6 text-white z-50 p-2"
          onClick={handleClose}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
        
        <DirectorsList
          directors={directors}
          onSelectDirector={handleSelectDirector}
        />
      </motion.div>
    </motion.div>
  );
}