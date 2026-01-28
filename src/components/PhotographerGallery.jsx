 import React, { useState, useCallback, useEffect, memo } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';

 // Componente de Lightbox para visualização ampliada
 const Lightbox = memo(({ image, onClose, onNext, onPrev, currentIndex, total }) => {
   const [touchStart, setTouchStart] = useState(null);

   useEffect(() => {
     // Previne scroll do body quando lightbox está aberto
     const originalOverflow = document.body.style.overflow;
     document.body.style.overflow = 'hidden';

     const handleKeyDown = (e) => {
       if (e.key === 'Escape') onClose();
       if (e.key === 'ArrowRight') onNext();
       if (e.key === 'ArrowLeft') onPrev();
     };
     window.addEventListener('keydown', handleKeyDown);

     return () => {
       window.removeEventListener('keydown', handleKeyDown);
       document.body.style.overflow = originalOverflow;
     };
   }, [onClose, onNext, onPrev]);

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

       {/* Navegação Anterior */}
       <button
         className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2 transition-colors"
         onClick={(e) => { e.stopPropagation(); onPrev(); }}
         aria-label="Anterior"
       >
         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       </button>

       {/* Navegação Próximo */}
       <button
         className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2 transition-colors"
         onClick={(e) => { e.stopPropagation(); onNext(); }}
         aria-label="Próximo"
       >
         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       </button>

       {/* Imagem */}
       <motion.img
         key={currentIndex}
         src={image}
         alt={`Foto ${currentIndex + 1}`}
         className="max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] object-contain"
         initial={{ scale: 0.95, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ duration: 0.2 }}
         onClick={(e) => e.stopPropagation()}
         draggable={false}
       />

       {/* Contador */}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wider">
         {currentIndex + 1} / {total}
       </div>
     </motion.div>
   );
 });

 Lightbox.displayName = 'Lightbox';

 // Componente de item individual - CORRIGIDO
 const GalleryItem = memo(({ src, index, onClick, shouldPreload }) => {
   const [loaded, setLoaded] = useState(false);
   const [error, setError] = useState(false);

   const handleLoad = useCallback(() => {
     setLoaded(true);
   }, []);

   const handleError = useCallback(() => {
     console.error(`Erro ao carregar imagem: ${src}`);
     setError(true);
   }, [src]);

   const handleClick = useCallback(() => {
     if (!error) onClick(index);
   }, [error, onClick, index]);

   return (
     <div
       className="overflow-hidden cursor-pointer mb-1 sm:mb-2 bg-zinc-900"
       onClick={handleClick}
       style={{ breakInside: 'avoid' }}
     >
       {error ? (
         <div className="w-full aspect-[3/4] bg-zinc-800 flex items-center justify-center">
           <span className="text-white/30 text-xs">Imagem não encontrada</span>
         </div>
       ) : (
         <div className="relative">
           {/* Placeholder - sempre presente até carregar, com position absolute depois */}
           <div
             className={`w-full aspect-[3/4] bg-zinc-800 ${loaded ? 'hidden' : 'block animate-pulse'}`}
           />

           {/* Imagem - visibilidade controlada por opacity, não height */}
           <img
             src={src}
             alt={`Foto ${index + 1}`}
             className={`w-full h-auto block transition-opacity duration-300 ${
               loaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
             }`}
             onLoad={handleLoad}
             onError={handleError}
             loading={shouldPreload ? 'eager' : 'lazy'}
             decoding="async"
           />
         </div>
       )}
     </div>
   );
 });

 GalleryItem.displayName = 'GalleryItem';

 function PhotographerGallery({ images, onBack }) {
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

   // Previne erros se images for undefined/null
   if (!images || images.length === 0) {
     return (
       <div className="absolute inset-0 bg-black flex items-center justify-center">
         <p className="text-white/50">Nenhuma imagem disponível</p>
       </div>
     );
   }

   return (
     <>
       {/* Container Principal com scroll */}
       <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black">
         {/* Botão Voltar - ORIGINAL */}
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

         {/* Grid Masonry - ORIGINAL */}
         <div
           className="p-1 sm:p-2 md:p-3 pt-14 sm:pt-16 pb-8"
           style={{
             columnCount: 2,
             columnGap: '4px'
           }}
         >
           {images.map((src, index) => (
             <GalleryItem
               key={`img-${index}-${src}`}
               src={src}
               index={index}
               onClick={handleImageClick}
               shouldPreload={index < 20}
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

 export default memo(PhotographerGallery);