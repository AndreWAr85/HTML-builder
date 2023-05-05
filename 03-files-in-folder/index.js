const fs = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true })
  .then(files => {

    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        fs.stat(filePath)
          .then(stats => {
            const fileName = path.parse(file.name).name;
            const fileExt = path.parse(file.name).ext.slice(1);
            const fileSize = stats.size / 1024;
            console.log(`${fileName} - ${fileExt} - ${fileSize.toFixed(3)}kb`);
          })
          .catch(err => console.log(`Ошибка при получении информации о файле ${file.name}: ${err}`));
      }
    });
  })
  .catch(err => console.log(`Ошибка при чтении содержимого папки: ${err}`));
