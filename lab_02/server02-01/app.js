import express from 'express';
import {log} from 'console'
import fs from 'fs'

const app = express();
app.use(express.json());

app.get('/html', (req, res)=>{

    fs.readFile('D:/3k_1c/Internet programming/lab_02/server02-01/index.html', (err, data)=>{
        if(err){
        
        }
        else{
            res.end(data);
        }
    })
});

app.listen(5000, err=>{
    if(err)
        log(err);
    else
    log('server ok!')
})