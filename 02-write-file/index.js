const fs = require('fs');
const readline = require('readline');
const process = require('node:process');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');
fs.writeFile(filePath, '', 'utf-8', (err) => { });

console.log('Введите текст:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', input => {
  if (input === 'exit') {
    console.log('Hasta la vista!');
    process.exit(0);
  } else {
    fs.appendFile(filePath, `${input}\n`, 'utf-8', err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Вы ввели: ${input}`);
        console.log('Введите текст:');
      }
    });
  }
});

rl.on('close', () => {
  console.log('Hasta la vista!');
  process.exit(0);
});
