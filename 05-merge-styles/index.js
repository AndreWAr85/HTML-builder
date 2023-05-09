const fs = require('fs');
const path = require('path');

function marginStyle() {
  const stylesDir = path.join(__dirname, 'styles');
  const distDir = path.join(__dirname, 'project-dist');
  const bundleFile = fs.createWriteStream(path.join(distDir, 'bundle.css'), { flags: 'w', encoding: 'utf-8' });
  bundleFile.on('error', (err) => {
    throw err;
  });
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
}

marginStyle();
