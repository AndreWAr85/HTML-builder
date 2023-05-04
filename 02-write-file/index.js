const fs = require('fs');
const readline = require('readline');
const process = require('node:process');

const writeStream = fs.createWriteStream('input.txt');

console.log('Введите текст:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', input => {
  if (input === 'exit') {
    console.log('Hasta la vista!');
    process.exit(0);
  }
  writeStream.write(`${input}\n`);
  console.log(`Вы ввели: ${input}`);
  console.log('Введите текст:');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Hasta la vista!');
});
