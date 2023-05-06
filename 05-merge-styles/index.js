const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const ext = path.extname(file);
    if (ext === '.css') {
      const filePath = path.join(stylesDir, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
        bundleFile.write(data + '\n');
      });
    }
  });
});

const bundleFile = fs.createWriteStream(path.join(distDir, 'bundle.css'), { flags: 'a', encoding: 'utf-8' });

bundleFile.on('error', (err) => {
  throw err;
});