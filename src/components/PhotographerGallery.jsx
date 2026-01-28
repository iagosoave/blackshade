import React, { useState, useEffect, useCallback } from 'react';

// --- Lightbox (Mantivemos a versão otimizada) ---
const Lightbox = ({ image, onClose, onNext, onPrev, currentIndex, total }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = ''; // Destrava ao fechar
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/98 flex items-center justify-center transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Botões de Navegação */}
      <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-[110]" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>

      <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 z-[110]" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 z-[110]" onClick={(e) => { e.stopPropagation(); onNext(); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <img
        src={image}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      
      <div className="absolute bottom-6 text-white/40 text-sm tracking-widest">
        {currentIndex + 1} / {total}
      </div>
    </div>
  );
};

// --- Item da Galeria (Simples e Seguro) ---
const GalleryItem = ({ src, index, onClick }) => {
  // Removemos a lógica de 'content-visibility' pois ela buga imagens de tamanhos variados
  return (
    <div 
      className="mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-sm"
      onClick={() => onClick(index)}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
      <img
        src={src}
        alt=""
        loading="lazy" // Deixa o navegador gerenciar o carregamento
        className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
        style={{ display: 'block' }} // Remove espaços fantasmas abaixo da imagem
      />
    </div>
  );
};

// --- Componente Principal ---
export default function PhotographerGallery({ images = [], onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Scroll Reset quando abre
  useEffect(() => {
    // Garante que o container principal tenha foco ou resete se necessário
  }, []);

  const handleNext = useCallback(() => setSelectedIndex((p) => (p + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setSelectedIndex((p) => (p - 1 + images.length) % images.length), [images.length]);

  return (
    // 1. FIXED INSET-0: Garante que a galeria ocupe a tela toda independente do pai
    // 2. OVERFLOW-Y-AUTO: Garante que o scroll funcione dentro deste container
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto w-full h-full">
      
      {/* Header Fixo */}
      <div className="sticky top-0 left-0 right-0 z-40 flex justify-end p-4 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button
          className="pointer-events-auto w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg border border-white/10"
          onClick={onBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* LAYOUT MASONRY (Estilo Pinterest)
         columns-2 / columns-3: Isso faz as imagens se encaixarem como tetris.
         Funciona perfeitamente para alturas variadas.
      */}
      <div className="px-2 pb-20 max-w-[1920px] mx-auto">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((src, i) => (
            <GalleryItem
              key={i}
              src={src}
              index={i}
              onClick={setSelectedIndex}
            />
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <Lightbox
          image={images[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={selectedIndex}
          total={images.length}
        />
      )}
    </div>
  );
}