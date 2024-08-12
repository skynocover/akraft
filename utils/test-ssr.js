const http = require('http');
const fs = require('fs');

const url = 'http://localhost:3001/service/test';
const outputFile = 'seo_content.html';

http
  .get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      fs.writeFileSync(outputFile, data);
      console.log(`Page content saved to ${outputFile}`);
    });
  })
  .on('error', (err) => {
    console.log('Error: ', err.message);
  });
