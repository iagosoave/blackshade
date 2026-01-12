import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import VideoPopup from './VideoPopup';
import { translations } from '../config/translations';

// Componente de item do portfolio - grid moderno sem texto
const PortfolioItem = memo(({ item, index, onClick, format }) => {
  // Define a altura baseada no formato
  const heightClass = {
    vertical: 'row-span-2 h-[80vh]',
    horizontal: 'col-span-2 h-[40vh]',
    square: 'h-[40vh]'
  }[format] || 'h-[40vh]';

  return (
    <motion.div
      className={`relative w-full ${heightClass} bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-hidden cursor-pointer group border border-zinc-800/50`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(item)}
    >
      {/* Efeito de gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Grid de pontos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Linha diagonal decorativa */}
      <motion.div
        className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"
        style={{ transform: 'rotate(15deg)', transformOrigin: 'top right' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
      />

      {/* Borda interna brilhante no hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-500" />
      
      {/* Efeito de brilho no canto */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
});

PortfolioItem.displayName = 'PortfolioItem';

export default function PhotographerPortfolio({ photographer, onBack, loading, onVideoOpen, language = 'pt' }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const t = translations[language] || translations.pt;

  const handleVideoClick = useCallback((item) => {
    if (item.videoUrl) {
      setSelectedVideoUrl(item.videoUrl);
      if (onVideoOpen) onVideoOpen(true);
    }
  }, [onVideoOpen]);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideoUrl(null);
    if (onVideoOpen) onVideoOpen(false);
  }, [onVideoOpen]);

  // Define os formatos para criar um grid variado
  const formats = ['square', 'vertical', 'horizontal', 'square', 'square', 'vertical', 'horizontal', 'square'];

  return (
    <>
      {/* Container com scroll para todo o conteúdo */}
      <div className="h-screen overflow-y-auto relative bg-black">
        
        {/* Botão voltar - design elegante */}
        <div className="absolute top-6 right-6 z-50">
          <button
            className="text-white hover:text-white/70 flex items-center justify-center w-10 h-10 transition-all hover:scale-110 group"
            onClick={onBack}
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
        
        {/* Grid Moderno - Layout Masonry com formatos variados */}
        <div className="p-6 md:p-8 pt-20">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-white text-xl">{t.photography.loading}</div>
            </div>
          ) : (
            <>
              {photographer?.portfolio && photographer.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
                  {photographer.portfolio.map((item, index) => (
                    <PortfolioItem
                      key={item.id}
                      item={item}
                      index={index}
                      format={formats[index % formats.length]}
                      onClick={handleVideoClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-white text-xl opacity-60">{t.photography.soon}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Video Popup */}
      <VideoPopup
        videoUrl={selectedVideoUrl}
        onClose={handleCloseVideo}
      />
    </>
  );
}