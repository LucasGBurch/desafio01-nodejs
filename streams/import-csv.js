import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  lineLimit: ',',
  skip_empty_lines: true,
  fromLine: 2, // primeira linha é títulos da tabela
});

async function runStream() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3336/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    // teste de import lento:
    await testStream(1000);
  }
}

runStream();

function testStream(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
