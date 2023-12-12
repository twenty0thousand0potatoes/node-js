import express from 'express';
import { log } from 'console';

import path from 'path';
import cors from 'cors';
import multer from 'multer'
 import {send} from 'nodemailer_module'

const __filename = path.resolve()

const app = express();
const PORT = 5000;
const upload = multer();

const pass = "your pass";


app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__filename, 'public', 'index.html'));
});

app.post('/form', upload.none() ,(req, res)=>{
    
    send(req.body.from_email, req.body.to_email, pass, req.body.message).then(result =>{
        res.status(200).send(result);
    }).catch(error =>{
        res.status(400).send(error);
    })
});

const server = app.listen(PORT, err => {
    if (err) {
        log("server fatal!" + err);
    } else {
        log("server ok!");
    }
});
