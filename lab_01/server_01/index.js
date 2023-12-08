
import http from 'http'
import { log } from 'console'
import fs from 'fs'

const image = './images/icons8-node-js-16.png';

http.createServer((req, res) => {

    if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end("<h1> Hello World!</h1>");
        if (req.url === '/favicon.ico') {

            fs.readFile(image, (err, data) => {
              if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Изображение не найдено');
              } else {
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
              }
            });
          }
    }
}).listen(3000, () => {
    log("sever ok!");
});