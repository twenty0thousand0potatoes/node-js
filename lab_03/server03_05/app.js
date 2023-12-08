import express from 'express'
import { log } from 'console'
import cors from 'cors'

const server = express();
server.use(express.json());
server.use(cors());

const PORT = 5000;

const factorialAsync = async (n) => {
    return new Promise((resolve, reject) => {
      if (n === 0) {
        resolve(1);
      } else {
        let result = 1;
  
        const calculate = (current) => {
          if (current > n) {
            resolve(result);
          } else {
            result *= current;
            current++;
            setImmediate(() => {
              calculate(current);
            });
          }
        };
  
        calculate(1);
      }
    });
  };
  
  server.get('/fact', async (req, res) => {
    const k = parseInt(req.query.k);
  
    if (isNaN(k) || k < 0) {
      res.status(400).json({ error: 'Invalid input' });
    } else {
      try {
        const number = await factorialAsync(k);
        const data = {
          k: k,
          fact: Number(number)
        };
        res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ error: 'Error calculating factorial' });
      }
    }
  });

const application = server.listen(PORT, err => {
    if (err) {
        log(err)
    }
    else {
        log(`server ok!`);
    }
})



