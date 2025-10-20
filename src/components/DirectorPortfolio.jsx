import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import VideoPopup from './VideoPopup';
import { translations } from '../config/translations';

// Componente de item do portfolio com memoização
const PortfolioItem = memo(({ item, index, onClick }) => (
  <motion.div
    className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden cursor-pointer group"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    onClick={() => onClick(item)}
  >
    <div className="absolute inset-0">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Overlay mais suave - apenas 20% de opacidade */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
    </div>

    {/* Título posicionado no centro com animação minimalista */}
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <motion.h3 
        className="text-white text-2xl md:text-3xl tracking-wider text-center"
        style={{ 
          fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
          textShadow: '2px 2px 12px rgba(0, 0, 0, 0.8)'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      >
        {item.title}
      </motion.h3>
    </div>
  </motion.div>
));

PortfolioItem.displayName = 'PortfolioItem';

export default function DirectorPortfolio({ director, onBack, loading, onVideoOpen, language = 'pt' }) {
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

  return (
    <>
      {/* Container com scroll para todo o conteúdo */}
      <div className="h-screen overflow-y-auto relative">
        
        {/* Botão voltar - melhor alinhado no canto direito */}
        <div className="absolute top-6 right-6 z-50">
          <button
            className="text-white text-sm tracking-wider hover:opacity-70 flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full transition-all hover:border-white/40"
            onClick={onBack}
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
          >
            <span className="text-lg">←</span>
            {t.directors.back.replace('← ', '')}
          </button>
        </div>
        
        {/* Grid de Vídeos */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-white text-xl">{t.directors.loading}</div>
            </div>
          ) : (
            <>
              {director?.portfolio && director.portfolio.length > 0 ? (
                director.portfolio.map((item, index) => (
                  <PortfolioItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={handleVideoClick}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-white text-xl opacity-60">{t.directors.soon}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Biografia do Diretor */}
        {director && (
          <div className="flex flex-col md:flex-row items-center md:items-start p-6 md:p-8 relative h-auto md:h-[60vh] w-full">
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/imagens/backgroundbio.webp"
                alt="Imagem de fundo da biografia"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
            </div>

            <motion.div
              className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0 z-10 pt-12 md:pt-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img
                src="https://via.placeholder.com/200"
                alt={director.name}
                className="rounded-full w-32 h-32 md:w-36 md:h-36 object-cover border-2 border-white"
                loading="lazy"
              />
            </motion.div>
            
            <motion.div
              className="w-full md:w-2/3 text-white text-center md:text-left z-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2
                className="text-3xl md:text-4xl mb-3"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
              >
                {director.name}
              </h2>
              <p className="text-sm md:text-base opacity-80 leading-relaxed line-clamp-4 md:line-clamp-none">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Video Popup */}
      <VideoPopup
        videoUrl={selectedVideoUrl}
        onClose={handleCloseVideo}
      />
    </>
  );
}