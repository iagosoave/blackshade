// src/sections/DirectorsSection.jsx
import React, { useState } from 'react';
import DirectorsList from '../components/DirectorsList';
import DirectorPortfolio from '../components/DirectorPortfolio';
import useContentful from '../hocks/useContentful';

export default function DirectorsSection({ language, onVideoOpen }) {
  const [selectedDirector, setSelectedDirector] = useState(null);

  // Nomes dos diretores fixos no código e adicionando placeholders para imagens de banner
  // ATENÇÃO: Substitua estas URLs por URLs reais das imagens de banner dos seus diretores.
  const directors = [
    { id: '1', name: 'Gustavo Vargas', bannerImage: 'https://via.placeholder.com/1920x400?text=Gustavo+Vargas+Banner' },
    { id: '2', name: 'Alice Demier', bannerImage: 'https://via.placeholder.com/1920x400?text=Alice+Demier+Banner' }, // Imagem para Alice Demier
    { id: '3', name: 'Wolvz', bannerImage: 'https://via.placeholder.com/1920x400?text=Wolvz+Banner' }
  ];

  // Busca portfolio do diretor selecionado no Contentful
  const { data: portfolioData, loading } = useContentful(
    selectedDirector ? `director-${selectedDirector.id}` : null
  );

  // Se um diretor foi selecionado, adiciona o portfolio vindo do Contentful
  const directorWithPortfolio = selectedDirector ? {
    ...selectedDirector,
    portfolio: portfolioData || []
  } : null;

  return (
    <>
      {!selectedDirector ? (
        <DirectorsList
          directors={directors}
          onSelectDirector={setSelectedDirector}
        />
      ) : (
        <DirectorPortfolio
          director={directorWithPortfolio}
          onBack={() => setSelectedDirector(null)}
          loading={loading}
          onVideoOpen={onVideoOpen}
          language={language}
        />
      )}
    </>
  );
}