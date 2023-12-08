import express from 'express'
import {log} from 'console'
import path from 'path'
import cors from 'cors'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/api/name',(req,res)=>{
    res.status(200);
    res.header('Content-Type', 'text/plain');
    res.send('Петров Сидор Иванович!')
});

app.get('/jquery', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'jquery.html'));
})

app.use((req, res, next) => {
    res.status(404).send('Not Found! 404!');
  });

app.listen(5000, err=>{
    if(err) log(err)
    else log('server ok!');
})