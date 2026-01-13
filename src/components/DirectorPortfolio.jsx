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

// Biografias dos diretores
const directorsBios = {
  'alice-demier': {
    bio: 'Alice Demier é uma diretora e artista brasileira com trajetória sólida no teatro e no audiovisual, reconhecida por um olhar feminino apurado, estético, ético e por uma direção de cena precisa, especialmente em projetos com grandes celebridades. Ao longo de 16 anos na TV Globo, integrou a direção de programas como Caras de Pau, Tá no Ar e o novo Zorra, lapidando uma linguagem que combina humor, cultura popular e sofisticação narrativa.\n\nComo diretora freelancer, comandou a série Like de Milhões (Multishow, 2022), com Marcus Majella e Rafael Infante, e Body by Beth (2024), estrelada por Marisa Orth, exibida na TNT e na Max, sempre conduzindo talentos com cuidado, escuta e precisão cênica. Também atuou no coletivo Porta dos Fundos e dirigiu campanhas publicitárias para o Grupo Globo (Multishow, GNT, TV Globo) e conteúdos para o Globoplay.\n\nNa educação, ministra cursos como "Direção de Humor para Audiovisual" na CAL, compartilhando sua experiência com novas gerações. Transitando entre palco e tela, Alice Demier se afirma como uma referência no cenário cultural brasileiro, articulando humor, rigor técnico e sensibilidade feminina na forma como enxerga e representa pessoas e histórias.'
  },
  'renata-massetti': {
    bio: 'Renata Massetti é diretora, fotógrafa e produtora de conteúdo com mais de 20 anos de experiência. De olhar criterioso e sensível, se envolve naturalmente em todas as etapas de um filme, da concepção à pós-produção.\n\nPublicitária e mestre em Comunicação, iniciou sua trajetória na fotografia still e ampliou sua atuação como pesquisadora, roteirista e montadora. Hoje assina filmes e campanhas com um estilo que combina olhar cinematográfico e autenticidade, o factual e o sutil, traduzindo histórias reais em narrativas visuais ao mesmo tempo sensíveis e potentes.\n\nCom foco em branded documentaries, suas narrativas atravessam o universo da moda, do esporte e de temas socioambientais, em projetos para marcas como Nike, Mizuno, Lojas Renner, C&A e Canal OFF, em produções no Brasil e no exterior. Atualmente possui dois documentários rodando em festivais pelo mundo: Tainá, cinebiografia de uma atleta surfista, e Gentle Giants, filme subaquático experimental que explora a experiência de dividir o mar com os tubarões-baleia ao lado de freedivers.'
  },
  'rafa-rocha': {
    bio: 'Rafael Rocha é músico, designer, fotógrafo e diretor. Há mais de 15 anos cria conteúdo para marcas e artistas, sempre conectado às novas tendências visuais, à cultura pop e à música, com um olhar que mistura repertório estético sólido e apurado para novidades.\n\nJá trabalhou com nomes e marcas como Skol, Devassa, Fiat, Red Bull, C&A, Samsung, e artistas como Gal Costa, Criolo, Anitta, Ludmilla, Marcelo Falcão, Gilberto Gil, Marcelo D2, Liniker, entre outros; sempre transitando com naturalidade entre o universo comercial e o artístico. É também sócio-fundador da revista NOIZE e da Noize Records, ampliando sua atuação no cruzamento entre música, curadoria e experimentação visual.\n\nFoi indicado ao Grammy Latino na categoria de Melhor Projeto Gráfico e ao Music Video Festival BR como Melhor Clipe do Ano, além de ter integrado o Superjúri do Prêmio Multishow. No set, Rafa tem habilidade rara de lidar com personalidades e celebridades, equilibrando direção firme e uma estética contemporânea que se traduz em um ambiente criativo, acolhedor e respeitoso.'
  },
  'gustavo-vargas': {
    bio: 'Gustavo Vargas é diretor com base sólida na fotografia still e na direção de fotografia. Nesse percurso, lapidou um olhar atento ao acting e à iluminação, de pessoas e de espaços, o que o levou naturalmente à direção de videoclipes, publicidade e projetos que variam entre documentário, moda e música.\n\nSua linguagem tem forte apelo visual sempre buscando novas composições, ritmos e maneiras de fazer a imagem respirar. Atento aos processos e relações em set, acredita que o melhor resultado nasce da sintonia entre todas as etapas do processo, algo presente em trabalhos para Itaú, Fila, C&A, Renner, Boticário, Multishow, GNT, Combate e SporTV, além de colaborações com nomes como Lulu Santos, Iza, Ferrugem, Péricles, Raça Negra, Natiruts e Xamã.\n\nEm fase de expansão criativa, Gustavo está sempre aberto a novas possibilidades estéticas e tecnológicas. Com portfólio diverso, um olhar humano e cinematográfico, segue construindo, em parceria com clientes e artistas.'
  }
};

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

  // Pega a biografia do diretor
  const directorBio = directorsBios[director?.id] || null;

  return (
    <>
      {/* Container com scroll para todo o conteúdo */}
      <div className="h-screen overflow-y-auto relative">
        
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
        
        {/* Biografia do Diretor - ESTRUTURA PADRONIZADA */}
        {director && directorBio && (
          <div className="flex items-center justify-center px-6 py-16 md:px-12 md:py-20 relative w-full">
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
              className="w-full max-w-4xl z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2
                className="text-2xl md:text-4xl mb-8 text-white text-center"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
              >
                {director.name}
              </h2>
              
              <div className="text-white text-justify md:text-left">
                <div className="text-sm md:text-base leading-relaxed space-y-4 opacity-90">
                  {directorBio.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="indent-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Grid de Vídeos - AGORA EMBAIXO */}
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
      </div>

      {/* Video Popup */}
      <VideoPopup
        videoUrl={selectedVideoUrl}
        onClose={handleCloseVideo}
      />
    </>
  );
}