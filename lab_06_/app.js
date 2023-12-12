import http from "http";
import { log } from "console";

const options = {
  host: "127.0.0.1",
  path: "/path",
  port: 5100,
  method: "GET",
};

const req = http.request(options, (res) => {
  log("method", req.method);
  log("response", res.statusCode);
  log("statusMessage", res.statusMessage);
  log("remoteAddress", req.socket.remoteAddress);
  log("remotePort", req.socket.remotePort);
  log("responseHEaders", res.headers);

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
