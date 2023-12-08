import http from 'http';
import qs from 'qs';
import { log } from 'console';
  
const params = qs.stringify({x:3, y:4, s:'eee'});
const path =  `/query?${params}`;
log(params)

const options = {
    host: "127.0.0.1",
    path: path,
    port: 5000,
    method: "GET",
  };

const req =  http.request(options, (res)=>{
    let data = "";
  res.on("data", (chunk) => {
    log("data:body ", (data += chunk.toString("utf-8")));
  });
  res.on("end", () => {
    log("end: body ", data);
  });
});

req.on(
    'error', (e=>{
        log('error: ', e.message);
    })
);

req.end();