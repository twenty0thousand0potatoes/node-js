
import express from 'express'
import { log } from 'console'
import fs from 'fs'


const server = express();
server.use(express.json());


const PORT = 5100;

server.get('/fact', (req, res) => {

    fs.readFile('D:/3k_1c/Internet programming/lab_03/server03_03/public/index.html', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Ошибка чтения файла');
        }
        res.send(data);
      });

})

const application = server.listen(PORT, err => {
    if (err) {
        log(err)
    }
    else {
        log(`server ok!`);
    }
})



