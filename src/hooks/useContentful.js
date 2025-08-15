import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'contentful';

// Cliente Contentful (singleton)
const client = createClient({
  space: "eq48j1dbpqsr",
  accessToken: "GhKBzoLISOk91Q3midcY46iz1pdOlUQcGzGiKhPQycU"
});

// Cache simples para evitar requisições repetidas
const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutos

export default function useContentful(contentType) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!contentType) {
      setLoading(false);
      return;
    }

    // Verifica cache
    const cacheKey = contentType;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      let response;
      let processedData = null;

      // Para portfolio de diretores específicos
      if (contentType.startsWith('director-')) {
        const directorId = contentType.replace('director-', '');
        const directorMap = {
          'gustavo-vargas': 'gustavo-vargas',
          'alice-demier': 'alice-demier',
          'wolvz': 'wolvz',
          'rafa-rocha': 'rafa-rocha',
          'renata-massetti': 'renata-massetti'
        };

        response = await client.getEntries({
          content_type: 'portfolioItem',
          'fields.director': directorMap[directorId],
          order: 'fields.order'
        });

        processedData = response.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          thumbnail: item.fields.thumbnail?.fields?.file?.url
            ? `https:${item.fields.thumbnail.fields.file.url}`
            : '',
          videoUrl: item.fields.videoUrl || '',
          description: item.fields.description
        }));
      }
      // Para música
      else if (contentType === 'music') {
        response = await client.getEntries({
          content_type: 'musicItem',
          order: 'fields.order'
        });

        processedData = response.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          thumbnail: item.fields.thumbnail?.fields?.file?.url
            ? `https:${item.fields.thumbnail.fields.file.url}`
            : '',
          mediaUrl: item.fields.mediaUrl || '',
          videoUrl: item.fields.videoUrl || '',
          description: item.fields.description,
          artist: item.fields.artist || ''
        }));
      }
      // Para IA
      else if (contentType === 'ai') {
        response = await client.getEntries({
          content_type: 'aiItem',
          order: 'fields.order'
        });

        processedData = response.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          thumbnail: item.fields.thumbnail?.fields?.file?.url
            ? `https:${item.fields.thumbnail.fields.file.url}`
            : '',
          projectUrl: item.fields.projectUrl || '',
          videoUrl: item.fields.videoUrl || '',
          description: item.fields.description,
          technologies: item.fields.technologies || ''
        }));
      }
      // Para homepage
      else if (contentType === 'homepage') {
        response = await client.getEntries({
          content_type: 'homepage',
          limit: 1
        });

        if (response.items.length > 0) {
          const item = response.items[0];
          processedData = {
            siteTitle: item.fields.siteTitle || 'BLACKSHADE',
            backgroundVideo: item.fields.backgroundVideo?.fields?.file?.url || null,
            videoUrl: item.fields.videoUrl || null,
            posterImage: item.fields.posterImage?.fields?.file?.url || null
          };
        }
      }

      // Salva no cache
      if (processedData !== null) {
        cache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now()
        });
      }

      setData(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados do Contentful:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
}