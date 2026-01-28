// convert-images.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Onde estão as imagens (Pasta Public)
const inputFolder = path.join(__dirname, 'public/imagens'); 

// 2. Onde vamos salvar a lista para o React ler (Pasta Src)
const jsonOutputPath = path.join(__dirname, 'src/lista-fotos.json');

async function convert() {
  // Verifica se a pasta existe
  if (!fs.existsSync(inputFolder)) {
    console.error(`❌ Erro: A pasta não foi encontrada: ${inputFolder}`);
    console.error('Certifique-se de criar a pasta "imagens" dentro de "public".');
    return;
  }

  try {
    const files = fs.readdirSync(inputFolder);
    const webpList = []; // Array para guardar os nomes

    console.log('🔄 Iniciando conversão e listagem...');

    for (const file of files) {
      // Pega arquivos JPG/PNG
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const name = path.parse(file).name;
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(inputFolder, `${name}.webp`);
        
        // Caminho web que o site vai usar
        const webPath = `/imagens/${name}.webp`;

        // Converte se não existir
        if (!fs.existsSync(outputPath)) {
          await sharp(inputPath)
            .webp({ quality: 75 })
            .resize({ width: 1920, withoutEnlargement: true })
            .toFile(outputPath);
          console.log(`✅ Convertido: ${name}.webp`);
        }
        
        // Adiciona na lista final
        webpList.push(webPath);
      } 
      // Se já for webp, só adiciona na lista
      else if (file.match(/\.webp$/i)) {
        webpList.push(`/imagens/${file}`);
      }
    }

    // Salva o arquivo JSON dentro de SRC para importar no React
    fs.writeFileSync(jsonOutputPath, JSON.stringify(webpList, null, 2));
    
    console.log('------------------------------------------------');
    console.log(`📄 Lista gerada com ${webpList.length} fotos!`);
    console.log(`📍 Arquivo salvo em: src/lista-fotos.json`);

  } catch (err) {
    console.error('Erro:', err.message);
  }
}

convert();