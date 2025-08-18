import React, { useState } from 'react';
import DirectorsList from '../components/DirectorsList';
import DirectorPortfolio from '../components/DirectorPortfolio';
import useContentful from '../hooks/useContentful';

export default function DirectorsSection({ language, onVideoOpen, onDirectorSelect }) {
  const [selectedDirector, setSelectedDirector] = useState(null);

  const directors = [
    { id: 'alice-demier', name: 'Alice Demier', bannerImage: '' },
    { id: 'gustavo-vargas', name: 'Gus Vargas', bannerImage: '' },
    { id: 'rafa-rocha', name: 'Rafa Rocha', bannerImage: '' },
    { id: 'renata-massetti', name: 'Renata Massetti', bannerImage: '' }
  ];

  const { data: portfolioData, loading } = useContentful(
    selectedDirector ? `director-${selectedDirector.id}` : null
  );

  const directorWithPortfolio = selectedDirector ? {
    ...selectedDirector,
    portfolio: portfolioData || []
  } : null;

  // Função para lidar com a seleção de um diretor
  const handleSelectDirector = (director) => {
    setSelectedDirector(director);
    if (onDirectorSelect) {
      onDirectorSelect(true); // Notifica o App que entrou no portfolio
    }
  };

  // Função para lidar com o botão voltar
  const handleBack = () => {
    setSelectedDirector(null);
    if (onDirectorSelect) {
      onDirectorSelect(false); // Notifica o App que saiu no portfolio
    }
  };

  return (
    <>
      {!selectedDirector ? (
        <DirectorsList
          directors={directors}
          onSelectDirector={handleSelectDirector}
        />
      ) : (
        <DirectorPortfolio
          director={directorWithPortfolio}
          onBack={handleBack}
          loading={loading}
          onVideoOpen={onVideoOpen}
          language={language}
        />
      )}
    </>
  );
}