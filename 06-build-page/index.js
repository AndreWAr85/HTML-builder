const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const indexFilePath = path.join(distDir, 'index.html');
const styleFilePath = path.join(distDir, 'style.css');

async function readComponent(componentName) {
  const filePath = path.join(componentsDir, `${componentName}.html`);
  const content = await fsPromises.readFile(filePath, 'utf-8');
  return content;
}

async function readTemplate() {
  const content = await fsPromises.readFile(templateFilePath, 'utf-8');
  return content;
}

async function writeIndexFile(content) {
  await fsPromises.rm(indexFilePath, { force: true });
  await fsPromises.writeFile(indexFilePath, content, 'utf-8');
}
async function copyAssetsDir() {
  const srcDir = path.join(__dirname, '..', '06-build-page', 'assets');
  const destDir = path.join(distDir, 'assets');
  await fsPromises.rm(destDir, { recursive: true, force: true });
  await copyDirectory(srcDir, destDir);
}

async function copyDirectory(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  const entries = await fsPromises.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function mergeStyles() {
  const cssContent = await recursiveReadDir(stylesDir, '.css');
  const result = cssContent.join('\n');
  // удаляем старый файл
  await fsPromises.rm(styleFilePath, { force: true });
  await fsPromises.writeFile(styleFilePath, result, 'utf-8');
}

async function recursiveReadDir(dir, ext) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  const promises = files.map((file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      return recursiveReadDir(filePath, ext);
    } else if (path.extname(file.name) === ext) {
      return fsPromises.readFile(filePath, 'utf-8');
    }
    return Promise.resolve(null);
  });
  const results = await Promise.all(promises);
  return results.flat().filter(Boolean);
}
async function readComponent(componentName) {
  const filePath = path.join(componentsDir, `${componentName}.html`);
  const content = await fsPromises.readFile(filePath, 'utf-8');
  return path.extname(filePath) === '.html' ? content : '';
}

async function build() {
  try {
    await fsPromises.mkdir(distDir, { recursive: true });

    const template = await readTemplate();
    const componentNames = template.split(/[\s\r\n]+/)
      .filter((name) => name.startsWith('{{') && name.endsWith('}}'))
      .map((name) => name.slice(2, -2));

    const promises = componentNames.map(readComponent);
    const results = await Promise.allSettled(promises);
    const components = results.reduce((acc, result) => {
      if (result.status === 'fulfilled') {
        acc.push(result.value);
      } else {
        console.error(`Failed to read file: ${result.reason}`);
      }
      return acc;
    }, []);
    const indexContent = componentNames.reduce((result, name, i) => {
      const component = components[i];
      return result.replace(new RegExp(`{{${name}}}`, 'g'), component);
    }, template);

    await writeIndexFile(indexContent);
    await mergeStyles();
    await copyAssetsDir();
  } catch (error) {
    console.error(error);
  }
}

build();

