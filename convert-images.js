import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pastas
const inputFolder = path.join(__dirname, 'public/imagens'); 
const jsonOutputPath = path.join(__dirname, 'src/lista-fotos.json');

async function convert() {
  if (!fs.existsSync(inputFolder)) {
    console.error(`❌ Pasta não encontrada: ${inputFolder}`);
    return;
  }

  try {
    const files = fs.readdirSync(inputFolder);
    // Agora a lista vai guardar OBJETOS com tamanho, não só strings
    const galleryData = []; 

    console.log('🔄 Analisando e convertendo imagens...');

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const name = path.parse(file).name;
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(inputFolder, `${name}.webp`);
        const webPath = `/imagens/${name}.webp`;

        // 1. Converte se precisar
        if (!fs.existsSync(outputPath)) {
          await sharp(inputPath)
            .webp({ quality: 75 })
            .resize({ width: 1200, withoutEnlargement: true }) // Reduzi um pouco para otimizar
            .toFile(outputPath);
          console.log(`✅ Convertido: ${name}.webp`);
        }

        // 2. LÊ AS DIMENSÕES REAIS DO ARQUIVO WEBP (O Segredo!)
        const metadata = await sharp(outputPath).metadata();
        
        galleryData.push({
          src: webPath,
          width: metadata.width,
          height: metadata.height,
          aspectRatio: metadata.width / metadata.height // Guarda a proporção exata
        });
      } 
      // Se já era WebP, lê as dimensões também
      else if (file.match(/\.webp$/i)) {
        const inputPath = path.join(inputFolder, file);
        const metadata = await sharp(inputPath).metadata();
        
        galleryData.push({
          src: `/imagens/${file}`,
          width: metadata.width,
          height: metadata.height,
          aspectRatio: metadata.width / metadata.height
        });
      }
    }

    fs.writeFileSync(jsonOutputPath, JSON.stringify(galleryData, null, 2));
    console.log(`\n✨ Sucesso! Lista gerada com dimensões exatas em: src/lista-fotos.json`);

  } catch (err) {
    console.error('Erro:', err);
  }
}

convert();