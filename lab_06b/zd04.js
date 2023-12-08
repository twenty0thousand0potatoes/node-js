import http from 'http';

import { log } from 'console';
  
const data = JSON.stringify({
    __comment:'Запрос.Лабораторная работа 7/10',
    x:1, 
    y:3,
    s:"Сообщение",
    m:['a', 'b', 'c', 'd'],
    o:{surname:'Петров', name:'Петя'} 
});


const options = {
    host: "127.0.0.1",
    path: '/zd04',
    port: 5000,
    method: "POST",
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data, 'utf-8'),
        'Accept-Charset': 'utf-8'
      } 
  };

const req =  http.request(options, (res)=>{
    log('res.staus: '.concat(res.statusCode));
    let data = "";
  res.on("data", (chunk) => {
    log("data:body ", (data += chunk.toString("utf-8")));
  });
  res.on("end", () => {
  
  });
});

req.on(
    'error', (e=>{
        log('error: ', e.message);
    })
);

req.write(data);
req.end();