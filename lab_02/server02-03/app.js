import express from 'express'
import {log} from 'console'
import cros from 'cors'

const app =  express();
app.use(cros());

app.get('/api/name',(req,res)=>{
    res.status(200);
    res.header('Content-Type', 'text/plain');
    res.send('Петров Сидор Иванович!')
});

app.use((req, res, next) => {
    res.status(404).send('Страница не найдена');
  });

app.listen(5000, err=>{
    if(err) log(err)
    else log('server ok!');
})