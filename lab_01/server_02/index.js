'use strict';

const { log } = require('console');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (req.method === 'GET') {
    fs.readFile('D:/3k_1c/Internet programming/lab_01/server_02/index.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<div style="color:red;"> ${req.method}</br>${parsedUrl.pathname}</br>${req.httpVersion}</br>${req.headers}</br>Get запрос не содержит тело:${null}</div>`);
        res.end(data);
      }
    });
  } else if (req.method === 'POST') {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      log(data); 

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`POST-запрос с данными: ${data}`);
    });
  }
});

server.listen(3100, () => {
  log("server ok!");
});
