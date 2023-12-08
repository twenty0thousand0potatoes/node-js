import express from "express";
import { log } from "console";
import { DB } from "./DB.js";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const __filename = "D:/3k_1c/Internet programming/lab_04/public";
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")), bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5000",
  })
);
let db = new DB();

db.on("GET", (req, res) => {
  res.set("Content-Type", "application/json");
  db.sort();
  res.send(JSON.stringify(db.get()));
});

db.on("DELETE", (req, res) => {
  db.delete(req.query.id);
  db.sort();
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(db.get()));
});

db.on("POST", (req, res) => {
  if (!db.post(req.body)) {
    //если бд вернёт false
    res.status(422).json({
      error: "Unprocessable Entity",
      message: "A user with this id already exists!",
    });
  } else {
    db.sort();
    //если бд вернёт true
    res.status(200).json({
      message: "The user has been successfully created!",
    });
  }
});

db.on("PUT", (req, res) => {
  log(req.body);
  const oldID = req.body.oldID;
  delete req.body.oldID;
  if (db.put(oldID, req.body)) {
    db.sort();
    res.status(200).json({
      message: "The user has been successfully edited!",
    });
  } else {
    res.status(422).json({
      message: "There is no user with the original id!",
    });
  }
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);
});

app.get("/api/db", (req, res) => {
  db.emit(req.method, req, res);
});

app.delete("/api/db", (req, res) => {
  db.emit(req.method, req, res);
});

app.post("/api/db", (req, res) => {
  db.emit(req.method, req, res);
});

app.put("/api/db", (req, res) => {
  db.emit(req.method, req, res);
});

const server = app.listen(5000, (err) => {
  if (err) {
    log(`Serve error, ${err}`);
  } else {
    log(`Server ok!${5000}`);
  }
});
