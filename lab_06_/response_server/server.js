import express from "express";
import dotenv from "dotenv";
import { log } from "console";
import bodyparser from 'body-parser'
import path from 'path'
import fs from 'fs'
import multer from "multer";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(bodyparser.json());
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



app.get("/path", (req, res) => {
  res.end("Hello, world!");
});

app.get("/query", (req, res) => {
  res.header("Content-Type", "application/json");
  const result = {
    "+" :  (Number(req.query.x) + Number(req.query.y)).toString(),
    "-" :  (Number(req.query.x) - Number(req.query.y)).toString(),
    "*" : (Number(req.query.x) * Number(req.query.y)).toString(),
    ":" : (Number(req.query.x) / Number(req.query.y)).toString(),
  };
  res.status(200).json(result);
});

app.post('/zd03', (req,res)=>{
  
if(isNaN(Number(req.body.x)) || isNaN(Number(req.body.y))){
  res.status(400).header('Content-Type','text/plain; charset=utf-8').end('Ошибка данных!');
}else{
  const result =  (Number(req.body.x) + Number(req.body.y)).toString();
  const arr = req.body.s1.split(',');
  const data = {
    result: result,
    arr: arr
  };
  
  const json = JSON.stringify(data);
  res.status(200).header( 'Content-Type','application/json; charset=utf-8').send(json);
  res.end();
}
});

app.post('/zd04',(req, res)=>{
  let str = String(req.body.__comment);
  str = str.replace("Запрос", "Ответ");
  const data = {
    __comment: str,
    "x+y": Number(req.body.x) + Number(req.body.y),
    concatination_s_o:
      req.body.s + " " + req.body.o.surname + " " + req.body.o.name,
    lengthM: Number(req.body.m.length),
  };
  res.send(JSON.stringify(data)).status(200);
  res.end();
});

app.get("/public/:filename", (req, res) => {
  const filePath = path.join(path.resolve(), `public/${req.params.filename}`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
      res.send("File downloaded successfully!");

      setTimeout(()=>{  const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);}, 1000)
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully!");
  log('ok!');
});


const server = app.listen(PORT, (err) => {
  if (err) {
    log(err);
  } else {
    log("Server is running!");
  }
});
