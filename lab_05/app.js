import express from 'express';
import { log } from 'console';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import multer from 'multer'

import {send } from './nodemailer_module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const upload = multer();

const pass = "your pass"


app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/form', upload.none() ,(req, res)=>{

    (req.body != null || req.body != undefined)? res.status(200).send(): res.status(400).send(); 

    send(req.body.from_email, pass, req.body.message);
})

const server = app.listen(PORT, err => {
    if (err) {
        log("server fatal!" + err);
    } else {
        log("server ok!");
    }
});
