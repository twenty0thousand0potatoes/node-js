import http from 'http';
import { log } from 'console';
import fs from 'fs';
import path from 'path';

const options = {
  host: "127.0.0.1",
  path: '/public/test.docx',
  port: 5100,
  method: "GET",
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  }
};

const req = http.request(options, (res) => {
  log('res.status: '.concat(res.statusCode));
  let match;
  let filename;
  const filenameHeader = res.headers['content-disposition'];
  if (filenameHeader) {
    match = filenameHeader.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];

    }
  }
  
  const filePath = path.join(path.resolve(), 'public', `${filename}`); 
  const fileStream = fs.createWriteStream(filePath);

  res.on("data", (chunk) => {
    fileStream.write(chunk);
  });

  res.on("end", () => {
    fileStream.end();
    log('File saved successfully!');
  });
});

req.on('error', (e) => {
  log('error: ', e.message);
});

req.end();