import express, { text } from "express";
import { log } from "console";
import http from "http";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import multer from 'multer'

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use('/sources/parallax-3d-lens-effect-website', express.static(path.join(path.resolve(), 'sources/parallax-3d-lens-effect-website')));
const server = http.createServer(app);
const publicDirectoryPath = path.join(path.resolve(), 'public');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicDirectoryPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

//04
const logRequestMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  log(`[${timestamp}] ${method} ${path}`);
  next();
};

app.use(logRequestMiddleware);

//01
app.get("/connection", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    try {
      const set = Number(req.query.set);
      if (!isNaN(set)) {
        server.keepAliveTimeout = set;
      }
      res
        .status(200)
        .header("Content-Type", "text/plain")
        .end(
          "Значение параметра keepAliveTimeout установлено в значение: " +
            String(server.keepAliveTimeout)
        );
    } catch {
      res
        .status(500)
        .header("Content-Type", "text/plain")
        .end("Ошибка сервера! Попробуйте позже!");
    }
  } else {
    res
      .status(200)
      .header("Content-Type", "text/plain")
      .end(
        "Значение параметра keepAliveTimeout: " +
          String(server.keepAliveTimeout)
      );
  }
});

server.on('connection', (socket) => {
  log('new connection with keepAliveTimeout:', server.keepAliveTimeout);
});

//02
app.get("/headers", (req, res) => {
  const headers = req.headers;
  res.header("Content-Type", "application/json");
  const responseHeaders = res.getHeaders();
  const data = {
    requestHeaders: headers,
    responseHeaders: responseHeaders,
  };
  res.status(200).json(data);
});

//03
app.get("/user/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!isNaN(id)) {
    fs.readFile("../resources/user.json", "utf-8", (err, data) => {
      if (err) {
        res.status(500).send("Ошибка сервера!").end();
        return;
      }

      try {
        const user = JSON.parse(data).find((user) => user.id === id);
        if (!user) {
          res.status(404).send("Пользователь не найден!");
          return;
        }
        res.status(200).json(user);
      } catch (err) {
        log(err);
        res.status(500).send("Ошибка сервера!").end();
      }
    });
  }
});

//06
app.get("/form", (req, res) => {
  try {
    const filePath = path.join(path.resolve(), "public/index.html");
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).header("Content-Type", "text/plain").send("Ошибка сервера!").end();
    log(err);
  }
});

app.get("/submit-form", (req, res) => {
  const queryParams = req.query;
  res.send(`<pre>${JSON.stringify(queryParams, null, 2)}</pre>`);
});

//07
app.get("/json", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public/button.html"));
});

app.post("/json/button", (req, res) => {
  let str = String(req.body.__comment);
  str = str.replace("Запрос", "Ответ");
  const data = {
    __comment: str,
    "x+y": Number(req.body.x) + Number(req.body.y),
    concatination_s_o:
      req.body.s + " " + req.body.o.surname + " " + req.body.o.name,
    lengthM: Number(req.body.m.length),
  };
  res.send(JSON.stringify(data));
});

//08
app.get("/public/:filename", (req, res) => {
  const filePath = path.join(path.resolve(), `public/${req.params.filename}`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
      res.send("File downloaded successfully!");
       const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
  });
});

//09
app.get("/upload", (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully!");
});

//05
app.use((req, res, next) => {
  res.status(405).send("Метод или URL не поддерживается!");
});

server.listen(7000, (err) => {
  if (err) {
    log("server fatal\n" + err);
  } else {
    log("server ok!");
  }
});
