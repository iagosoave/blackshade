import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoPopup from './VideoPopup';
import { translations } from '../config/translations';
import backgroundBioImage from './backgroundbio.png'; // Importe a imagem

export default function DirectorPortfolio({ director, onBack, loading, onVideoOpen, language = 'pt' }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const t = translations[language] || translations.pt;

  const handleVideoClick = (item) => {
    if (item.videoUrl) {
      setSelectedVideoUrl(item.videoUrl);
      if (onVideoOpen) onVideoOpen(true);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideoUrl(null);
    if (onVideoOpen) onVideoOpen(false);
  };

 return (
    <>
      <div className="min-h-screen">
        {/* Barra de ações no topo direito */}
        <motion.div
          className="fixed top-6 right-16 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="text-white text-sm tracking-wider hover:opacity-70 flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full transition-all hover:border-white/40"
            onClick={onBack}
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
          >
            <span className="text-lg">←</span>
            {t.directors.back.replace('← ', '')}
          </button>
        </motion.div>

        {/* Informações do Diretor - Biografia e Foto */}
        {director && (
          <div
            className="flex flex-col md:flex-row items-center md:items-start p-8 mt-20 md:mt-0 relative"
            style={{
              backgroundImage: `url(${backgroundBioImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay para escurecer o fundo e melhorar a legibilidade */}
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

            <motion.div
              className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0 z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Placeholder para a imagem do diretor */}
              <img
                src="https://via.placeholder.com/200" // Substitua por uma URL de imagem real do diretor
                alt={director.name}
                className="rounded-full w-40 h-40 object-cover border-2 border-white"
              />
            </motion.div>
            <motion.div
              className="w-full md:w-2/3 text-white text-center md:text-left z-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2
                className="text-4xl md:text-5xl mb-4"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
              >
                {director.name}
              </h2>
              {/* Placeholder para a biografia do diretor */}
              <p className="text-base md:text-lg opacity-80 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </motion.div>
          </div>
        )}

        <div>
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-white text-xl">{t.directors.loading}</div>
            </div>
          ) : (
            <>
              {director.portfolio && director.portfolio.length > 0 ? (
                director.portfolio.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden cursor-pointer group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleVideoClick(item)}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
                    </div>

                   <div className="absolute inset-0 flex items-center justify-center p-4">
    <h3 className="text-white text-xl md:text-2xl tracking-wider text-center"
        style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
      {item.title}
    </h3>
  </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-white text-xl opacity-60">{t.directors.soon}</div>
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