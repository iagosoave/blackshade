import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../config/translations';

export default function AboutSection({ language }) {
  const t = translations[language] || translations.pt;

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const paragraphs = [
    "A Black Shade é uma produtora audiovisual focada em transformar ideias e conceitos em imagens que unem técnica e sensibilidade. Nosso propósito é traduzir o contraste entre luz e sombra em narrativas visuais que ampliam perspectivas fortalecendo a conexão entre marcas e pessoas de forma autêntica.",
    "Nosso olhar busca revelar o que ainda não foi percebido e dar densidade a histórias que poderiam permanecer superficiais. É nesse processo que criamos imagens capazes de provocar reflexão e gerar impacto.",
    "Acreditamos que a força de uma narrativa nasce da integração de diferentes camadas, visíveis e invisíveis. Isso inclui a diversidade de vozes e contextos que compõem o mundo em que vivemos. Quando acolhemos essa pluralidade e nos comprometemos com um olhar amplo, dentro e fora do set, alcançamos um equilíbrio que permite um resultado genuíno.",
    "Atuamos com uma visão aberta ao que já está definido e ao que ainda busca expressão. Em colaboração com artistas e parceiros, marcas e agências, desenvolvemos conteúdos visuais que equilibram estratégia e criatividade, valorizando nuances, silêncios e detalhes que tornam cada narrativa única.",
    "Para nós, cada projeto vai além da comunicação: é um espaço de encontro entre marca e público, onde a narrativa se transforma em experiência compartilhada."
  ];

  return (
    <div className="min-h-screen md:h-screen flex items-center justify-center px-6 py-8 md:px-16 lg:px-24 xl:px-32">
      {/* Conteúdo centralizado verticalmente */}
      <div className="max-w-4xl w-full">
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-white text-sm md:text-base leading-relaxed font-light tracking-wide"
              style={{ textAlign: 'justify' }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}