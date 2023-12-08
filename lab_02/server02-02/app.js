
import http from 'http'
import {log} from 'console'
import fs from 'fs'
import path from 'path'

const server =  http.createServer((req, res)=>{
    if(req.method === 'GET' && req.url === '/png' ){

      
        const __dirname =  path.resolve();
        fs.readFile(path.join(__dirname, 'image.png'), (err, data) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end(err.message);
            } else {
              res.writeHead(200, { 'Content-Type': 'image/jpeg' });
              res.end(data);
            }
          });
       
    }
    else{
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('404, not Found!')
    }
})

server.listen(5000, (err)=>{
    if(err) log(err)
    else log('server ok!');
})