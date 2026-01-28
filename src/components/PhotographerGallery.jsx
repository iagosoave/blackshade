 import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';

 // Lightbox simplificado para performance
 const Lightbox = memo(({ image, onClose, onNext, onPrev, currentIndex, total }) => {
   useEffect(() => {
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
     <motion.div
       className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.15 }}
       onClick={onClose}
     >
       <button
         className="absolute top-4 right-4 text-white/70 hover:text-white z-[110] p-2"
         onClick={onClose}
       >
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
           <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
         </svg>
       </button>

       <button
         className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2"
         onClick={(e) => { e.stopPropagation(); onPrev(); }}
       >
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       </button>

       <button
         className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-[110] p-2"
         onClick={(e) => { e.stopPropagation(); onNext(); }}
       >
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       </button>

       <img
         src={image}
         alt=""
         className="max-h-[85vh] max-w-[90vw] object-contain"
         onClick={(e) => e.stopPropagation()}
         draggable={false}
       />

       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
         {currentIndex + 1} / {total}
       </div>
     </motion.div>
   );
 });

 // Item com Intersection Observer - preserva formato natural da imagem
 const GalleryItem = memo(({ src, index, onClick }) => {
   const [isVisible, setIsVisible] = useState(false);
   const [loaded, setLoaded] = useState(false);
   const ref = useRef(null);

   useEffect(() => {
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsVisible(true);
           observer.disconnect();
         }
       },
       { rootMargin: '300px' }
     );

     if (ref.current) observer.observe(ref.current);
     return () => observer.disconnect();
   }, []);

   return (
     <div
       ref={ref}
       className="mb-1 sm:mb-2 bg-zinc-900 cursor-pointer overflow-hidden"
       style={{ breakInside: 'avoid' }}
       onClick={() => loaded && onClick(index)}
     >
       {/* Placeholder mínimo enquanto não carrega */}
       {!loaded && (
         <div className="w-full aspect-[4/5] bg-zinc-800" />
       )}

       {isVisible && (
         <img
           src={src}
           alt=""
           className={`w-full h-auto block ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
           onLoad={() => setLoaded(true)}
           loading="lazy"
           decoding="async"
         />
       )}
     </div>
   );
 });

 export default function PhotographerGallery({ images, onBack }) {
   const [selectedIndex, setSelectedIndex] = useState(null);

   const handleClick = useCallback((i) => setSelectedIndex(i), []);
   const handleClose = useCallback(() => setSelectedIndex(null), []);
   const handleNext = useCallback(() => setSelectedIndex(p => (p + 1) % images.length), [images.length]);
   const handlePrev = useCallback(() => setSelectedIndex(p => (p - 1 + images.length) % images.length), [images.length]);

   if (!images?.length) {
     return (
       <div className="absolute inset-0 bg-black flex items-center justify-center">
         <p className="text-white/50">Nenhuma imagem</p>
       </div>
     );
   }

   return (
     <>
       <div className="absolute inset-0 overflow-y-auto bg-black">
         {/* Botão Voltar */}
         <button
           className="fixed top-3 right-3 z-50 text-white/80 hover:text-white w-10 h-10 bg-black/60 rounded-full flex items-center justify-center"
           onClick={onBack}
         >
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
         </button>

         {/* Masonry com column-count - preserva formato natural */}
         <div
           className="p-1 sm:p-2 pt-14"
           style={{
             columnCount: 2,
             columnGap: '4px'
           }}
         >
           {images.map((src, i) => (
             <GalleryItem key={i} src={src} index={i} onClick={handleClick} />
           ))}
         </div>

         <div className="h-16" />
       </div>

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