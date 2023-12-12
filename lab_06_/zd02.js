import http from 'http';
import qs from 'qs';
import { log } from 'console';
  
const params = qs.stringify({x:8, y:4});
const path =  `/query?${params}`;
log(params)

const options = {
    host: "127.0.0.1",
    path: path,
    port: 5100,
    method: "GET",
  };

const req =  http.request(options, (res)=>{
    let data = "";
  res.on("data", (chunk) => {
    log("response", res.statusCode);
    log("statusMessage", res.statusMessage);
    log("data:body ", (data += chunk.toString("utf-8")));
  });
});

req.on(
    'error', (e=>{
        log('error: ', e.message);
    })
);

req.end();