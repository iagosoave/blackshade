import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoPopup from './VideoPopup';
import { translations } from '../config/translations';

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