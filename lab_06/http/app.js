import http from "http";
import dotenv from "dotenv";
import { log } from "console";
import url from "url";
import fs from "fs";
import path from "path";
import multer from "multer";
import formidable from "formidable";

dotenv.config();

let keepAliveTimeout = http.Server.defaultKeepAliveTimeout;

let logRequestMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const { pathname } = url.parse(req.url);
  log(`[${timestamp}] ${method} ${pathname}`);
};

const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const { pathname, query } = url.parse(reqUrl, true);
  const id = Number(req.url.split("/")[2]);

  if (method === "GET" && pathname === "/connection") {
    if ("set" in query) {
      const newTimeout = Number(query.set);
      keepAliveTimeout = newTimeout;
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.write(
        `Установлено новое значение параметра keepAliveTimeout: ${newTimeout}`
      );
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.write(
        `Текущее значение параметра keepAliveTimeout: ${keepAliveTimeout}`
      );
      res.end();
    }
  } else if (req.method === "GET" && pathname === "/headers") {
    const responseHeaders = {
      "Content-Type": "application/json",
    };

    const responseData = {
      requestHeaders: req.headers,
      responseHeaders: responseHeaders,
    };

    res.writeHead(200, responseHeaders);
    res.end(JSON.stringify(responseData));
  } else if (method === "GET" && req.url.startsWith("/user/") && !isNaN(id)) {
    fs.readFile("../resources/user.json", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Ошибка сервера!");
        res.end();
        return;
      }

      try {
        const users = JSON.parse(data);
        const user = users.find((user) => user.id === id);
        if (!user) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.write("Пользователь не найден!");
          res.end();
          return;
        }
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } catch (err) {
        log(err);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Ошибка сервера!");
        res.end();
      }
    });
  } else if (method === "GET" && pathname === "/form") {
    try {
      const filePath = path.join(path.resolve(), "public/index.html");
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.write("Ошибка сервера!");
          res.end();
          log(err);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      });
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.write("Ошибка сервера!");
      res.end();
      log(err);
    }
  } else if (method === "GET" && reqUrl.startsWith("/submit-form")) {
    const parsedUrl = url.parse(reqUrl, true);
    const queryParams = parsedUrl.query;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write(`<pre>${JSON.stringify(queryParams, null, 2)}</pre>`);
    res.end();
  } else if (method === "GET" && pathname === "/json") {
    try {
      const filePath = path.join(path.resolve(), "public/button.html");
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.write("Ошибка сервера!");
          res.end();
          log(err);
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      });
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.write("Ошибка сервера!");
      res.end();
      log(err);
    }
  } else if (method === "POST" && pathname === "/json/button") {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk.toString();
    });

    req.on("end", () => {
      const bodyParams = JSON.parse(requestBody);
      let str = String(bodyParams.__comment);
      str = str.replace("Запрос", "Ответ");
      const data = {
        __comment: str,
        "x+y": Number(bodyParams.x) + Number(bodyParams.y),
        concatination_s_o: `${bodyParams.s} ${bodyParams.o.surname} ${bodyParams.o.name}`,
        lengthM: Number(bodyParams.m.length),
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    });
  } else if (req.method === "GET" && req.url.startsWith("/public/")) {
    const filename = req.url.split("/").pop();
    const filePath = path.join(path.resolve(), "public", filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.statusCode = 404;
        res.end("File not found");
      } else {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        res.write("File downloaded successfully!");

        setTimeout(() => {
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        }, 1000);
      }
    });
  } else if (req.url === "/upload" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
    <!DOCTYPE html> 
<html lang="en"> 
    <head> 
        <meta charset="UTF-8" /> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        <title>Document</title> 
    </head> 
    <body>        
        <input type="file" id="file" accept=".txt" /> 
        <br /> 
        <button id="upload">POST</button> 
        
        <script src="upload.js"></script> 
    </body> 
</html>
    `);
  } else if (req.url === "/upload.js" && req.method === "GET") {
    const filePath = "../resources/upload.js";
    const fileContent = fs.readFileSync(filePath, "utf8");
    res.setHeader("Content-Type", "text/javascript");
    res.write(fileContent);
    res.end();
  } else if (req.url === "/upload" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let obj = JSON.parse(body);
      let fileName = path.join(path.resolve(), obj.name);
      fs.writeFileSync(fileName, obj.body, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error 500! File not uploaded!");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("File uploaded successfully!");
        }
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.on("request", logRequestMiddleware);

server.listen(process.env.PORT, (err) => {
  if (err) {
    log("server fatal!".concat(err));
  } else {
    log("Server ok!");
  }
});
