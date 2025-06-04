const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use('/gallery', express.static(path.join(__dirname, 'public', 'gallery')));

// Генерация данных галереи
const getGalleryData = () => {
  try {
    const galleryPath = path.join(__dirname, 'public', 'gallery');
    if (!fs.existsSync(galleryPath)) return [];
    
    return fs.readdirSync(galleryPath)
      .filter(folder => {
        const folderPath = path.join(galleryPath, folder);
        return fs.statSync(folderPath).isDirectory();
      })
      .map(folder => {
        const folderPath = path.join(galleryPath, folder);
        const files = fs.readdirSync(folderPath);
        
        // Поиск изображения и метаданных
        const imageFile = files.find(f => 
          ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase())
        );
        
        const metaFile = files.find(f => f === 'meta.json');
        let metaData = { title: folder, description: '' };

        if (metaFile) {
          try {
            const rawMeta = fs.readFileSync(path.join(folderPath, metaFile), 'utf8');
            metaData = { ...metaData, ...JSON.parse(rawMeta) };
          } catch (e) {
            console.error(`Error reading meta.json in ${folder}:`, e);
          }
        }

        return {
          image: `/gallery/${folder}/${imageFile || ''}`,
          title: metaData.title,
          description: metaData.description
        };
      })
      .filter(item => item.image); // Фильтр для элементов без изображений

  } catch (error) {
    console.error('Gallery generation error:', error);
    return [];
  }
};

// Эндпоинт API
app.get('/api/gallery', (req, res) => {
  try {
    const galleryData = getGalleryData();
    res.set('Cache-Control', 'public, max-age=3600'); // Кеширование на 1 час
    res.json(galleryData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
