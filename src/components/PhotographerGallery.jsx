import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// --- Lightbox (sem alterações) ---
const Lightbox = ({ image, onClose, onNext, onPrev, currentIndex, total }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/98 flex items-center justify-center transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-[110]" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      
      <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 z-[110]" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 z-[110]" onClick={(e) => { e.stopPropagation(); onNext(); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <img src={image} alt="" className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} draggable={false} />
      <div className="absolute bottom-6 text-white/40 text-sm tracking-widest">{currentIndex + 1} / {total}</div>
    </div>
  );
};

// --- Item da Galeria ---
const GalleryItem = React.memo(({ src, onClick, originalIndex }) => {
  return (
    <div 
      className="mb-4 relative group cursor-pointer overflow-hidden rounded-sm bg-zinc-900"
      onClick={() => onClick(originalIndex)}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
      <img
        src={src}
        alt=""
        loading="lazy"
        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105 block"
      />
    </div>
  );
});

// --- Componente Principal ---
export default function PhotographerGallery({ images = [], onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [columns, setColumns] = useState(2);
  const [imageHeights, setImageHeights] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);

  // Responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setColumns(4);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pré-carregar dimensões das imagens
  useEffect(() => {
    const heights = {};
    let loaded = 0;
    
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        // Armazena o aspect ratio (altura/largura)
        heights[index] = img.height / img.width;
        loaded++;
        if (loaded === images.length) {
          setImageHeights({ ...heights });
          setLoadedCount(loaded);
        }
      };
      img.onerror = () => {
        heights[index] = 1; // fallback para quadrado
        loaded++;
        if (loaded === images.length) {
          setImageHeights({ ...heights });
          setLoadedCount(loaded);
        }
      };
      img.src = src;
    });
  }, [images]);

  // DISTRIBUIÇÃO BALANCEADA POR ALTURA
  const distributedImages = useMemo(() => {
    const cols = Array.from({ length: columns }, () => ({ items: [], height: 0 }));
    
    // Se ainda não carregou as dimensões, usa distribuição simples
    if (loadedCount < images.length) {
      images.forEach((img, i) => {
        cols[i % columns].items.push({ src: img, originalIndex: i });
      });
      return cols.map(c => c.items);
    }
    
    // Distribui cada imagem na coluna mais curta
    images.forEach((img, i) => {
      // Encontra a coluna com menor altura acumulada
      let shortestCol = 0;
      let minHeight = cols[0].height;
      
      for (let c = 1; c < columns; c++) {
        if (cols[c].height < minHeight) {
          minHeight = cols[c].height;
          shortestCol = c;
        }
      }
      
      // Adiciona a imagem na coluna mais curta
      cols[shortestCol].items.push({ src: img, originalIndex: i });
      cols[shortestCol].height += imageHeights[i] || 1;
    });
    
    return cols.map(c => c.items);
  }, [images, columns, imageHeights, loadedCount]);

  const handleNext = useCallback(() => setSelectedIndex((p) => (p + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setSelectedIndex((p) => (p - 1 + images.length) % images.length), [images.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto w-full h-full scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-black">
      
      {/* Botão Voltar */}
      <div className="sticky top-0 left-0 right-0 z-40 flex justify-end p-4 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button
          className="pointer-events-auto w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg border border-white/10"
          onClick={onBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Grid Balanceado */}
      <div className="px-2 pb-20 max-w-[1920px] mx-auto">
        <div className="flex gap-4 items-start">
          {distributedImages.map((colImages, colIndex) => (
            <div key={colIndex} className="flex-1 flex flex-col">
              {colImages.map((item) => (
                <GalleryItem
                  key={item.originalIndex}
                  src={item.src}
                  originalIndex={item.originalIndex}
                  onClick={setSelectedIndex}
                />
              ))}
            </div>
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