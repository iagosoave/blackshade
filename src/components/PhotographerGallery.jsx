import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de Lightbox para visualização ampliada
const Lightbox = ({ image, onClose, onNext, onPrev, currentIndex, total }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Swipe para mobile
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext();
      else onPrev();
    }
    setTouchStart(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Botão Fechar */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-[110] p-2 transition-colors"
        onClick={onClose}
        aria-label="Fechar"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Navegação Anterior - esconde em mobile pequeno */}
      <button
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2 transition-colors hidden sm:block"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Anterior"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Navegação Próximo - esconde em mobile pequeno */}
      <button
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2 transition-colors hidden sm:block"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Próximo"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Imagem */}
      <motion.img
        src={image}
        alt={`Foto ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] object-contain"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Contador */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wider">
        {currentIndex + 1} / {total}
      </div>
    </motion.div>
  );
};

// Componente de item individual da galeria com Intersection Observer
const GalleryItem = ({ src, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(index < 10); // Carrega as primeiras 10 imediatamente
  const itemRef = useRef(null);

  useEffect(() => {
    if (shouldLoad) return; // Já está marcado para carregar

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Começa a carregar 200px antes de aparecer
        threshold: 0
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={itemRef}
      className="overflow-hidden cursor-pointer mb-1 sm:mb-2 bg-zinc-900"
      onClick={() => loaded && onClick(index)}
      style={{ breakInside: 'avoid' }}
    >
      {shouldLoad ? (
        <img
          src={src}
          alt={`Foto ${index + 1}`}
          className={`w-full h-auto block transition-opacity duration-300 hover:opacity-90 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        // Placeholder enquanto não carrega
        <div className="w-full aspect-[3/4] bg-zinc-900" />
      )}
    </div>
  );
};

export default function PhotographerGallery({ images, onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <>
      {/* Container Principal com scroll */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black">
        {/* Botão Voltar - fixo */}
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
          <button
            className="text-white/80 hover:text-white flex items-center justify-center w-10 h-10 bg-black/50 rounded-full transition-all"
            onClick={onBack}
            aria-label="Voltar"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Grid Masonry */}
        <div 
          className="p-1 sm:p-2 md:p-3 pt-14 sm:pt-16 pb-8"
          style={{
            columnCount: 2,
            columnGap: '4px'
          }}
        >
          {images.map((src, index) => (
            <GalleryItem
              key={index}
              src={src}
              index={index}
              onClick={handleImageClick}
            />
          ))}
        </div>

        {/* Espaço extra no final para garantir scroll */}
        <div className="h-20" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            image={images[selectedIndex]}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
            currentIndex={selectedIndex}
            total={images.length}
          />
        )}
      </AnimatePresence>
    </>
  );
}