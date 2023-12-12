import http from 'http';
import { log } from 'console';

const json_params = JSON.stringify({x: 3, y: 7, s1: "раз, два, три",});
const options = {
  host: "127.0.0.1",
  path: '/zd03',
  port: 5100,
  method: "POST",
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(json_params, 'utf-8'),
    'Accept-Charset': 'utf-8'
  }  
};

const req = http.request(options, (res) => {

  log("responseStatus:".concat(res.statusCode));
  let data = "";
  res.on("data", (chunk) => {
    log("data:body ", (data += chunk.toString("utf-8")));
  });
  res.on("end", () => {
    
  });
});

req.on('error', (e) => {
  log('error: ', e.message);
});

req.write(json_params);
req.end();