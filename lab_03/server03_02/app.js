
import express from 'express'
import { log } from 'console'
import cors from 'cors'

const server = express();
server.use(express.json());

const   PORT = 5000;
server.use(cors());

const factorial = (n) => {
    if (n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

server.get('/fact', (req, res) => {
    const k = Number(req.query.k);

    if (isNaN(k) || k < 0) {
        res.status(400).json({ error: 'Invalid input' });
    } else {
        const number = factorial(k);
        const data = {
            k: k,
            fact: Number(number)
        }
        res.status(200).json(data);
    }
})

const application = server.listen(PORT, err => {
    if (err) {
        log(err)
    }
    else {
        log(`server ok!`);
    }
})



