import express from "express";
import { log } from "console";

import { createOrder, proceedToPayment } from "./zd04.js";
import { square, cube, fourthPower } from "./zd05.js";

const PORT = 5000;
const server = express();

//функции
const firstJob = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hello world");
    }, 2000);
  });
};

const secondJob = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Произошла ошибка!");
    }, 3000);
  });
};

const thirdJob = (data) => {
  if (typeof data !== "number") {
    return new Promise((resolve, reject) => {
      reject("error!");
    });
  }

  if (Number(data) % 2 === 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("odd");
      }, 1000);
    });
  }

  if (Number(data) % 2 !== 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("even");
      }, 2000);
    });
  }
};

server.get("/", (req, res) => {
  firstJob()
    .then((result) => {
      res.send(`<h1>${result}</h1>`);
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
});

server.get("/second", (req, res) => {
  secondJob()
    .then((result) => {
      res.send(`<h1>${result}</h1>`);
    })
    .catch((error) => {
      console.error("Произошла ошибка (secondJob):", error);
      res.send(`<h1>${error}</h1>`);
    });
});

server.get("/third/:param", (req, res) => {
  const func_param = !isNaN(Number(req.params.param))
    ? Number(req.params.param)
    : req.params.param;

  thirdJob(func_param)
    .then((result) => {
      res.send(`<h1>${result}</h1>`);
    })
    .catch((error) => {
      res.send(`<h1>${error}</h1>`);
    });
});

//------------------------------------------------------------------------------

server.get("/card/:param", (req, res) => {
  const func_param = !isNaN(Number(req.params.param))
    ? Number(req.params.param)
    : req.params.param;

  createOrder(func_param)
    .then((orderId) => {
      console.log("Order ID:", orderId);
      return proceedToPayment(orderId);
    })
    .then((paymentResult) => {
      res.send("Order ok!");
      console.log(paymentResult);
    })
    .catch((error) => {
      console.error(error);
      res.send("order faled!");
    })
    .catch((error) => {
      console.error(error);
      res.send("order faled!");
    });
});

//-------------------------------------------------------------------------------------

//второй вариант первого задания!
// server.get('/', async (req, res) => {
//     try {
//       text_res = await firstJob();
//       res.send(`<h1>${text_res}</h1>`);
//     } catch (error) {
//       console.error("Ошибка:", error);
//       text_res = "Произошла ошибка";
//       res.send(`<h1>${text_res}</h1>`);
//     }
// });

//второй вариант второго задания!
// server.get('/second', async (req, res) => {
//     try {
//       text_res = await secondJob();
//       res.send(`<h1>${text_res}</h1>`);
//     } catch (error) {
//       console.error("Ошибка:", error);
//       text_res = error;
//       res.send(`<h1>${text_res}</h1>`);
//     }
// });

//-----------------------------------------------------------------------------------

//zd05

server.get("/zd05", (req, res) => {
  const param = req.query.number;

  Promise.all([square(param), cube(param), fourthPower(param)])
    .then((results) => {
      res.end(
        "Square:" +
          results[0] +
          "\n" +
          "Cube:" +
          results[1] +
          "\n" +
          "Fourth Power:" +
          results[2]
      );
    })
    .catch((error) => {
      res.end("Error:" + error);
    });
});
//----------------------------------------------------------

server.get("/zd06", (req, res) => {
  const param = req.query.number;

  Promise.race([square(param), cube(param), fourthPower(param)])
    .then((result) => {
      res.end(`Result: ${result}`);
    })
    .catch((error) => {
      res.end(`Error: ${error}`);
    });
});
//----------------------------------------------------------------

server.get("/zd07", (req, res) => {
  const param = req.query.number;

  Promise.any([square(param), cube(param), fourthPower(param)])
    .then((result) => {
      res.end(`Result: ${result}`);
    })
    .catch((error) => {
      res.end(`Error: ${error}`);
    });
});

//--------------------------------------------------
function f1(){
  console.log('f1');
}

function f2(){
  console.log('f2');
}

function f3(){
  console.log('f3');
}

function main(){
  log('main');y
  setTimeout(f1, 50);
  setTimeout(f3, 50);

  new Promise((resolve, reject)=>{
    resolve('I am a Promise, right after f1 and f3! Really?')
  }).then(resolve =>{
    log(resolve)
  }) 
  
  new Promise((resolve, reject)=>{
    resolve('I am a Promise after Promise')
  }).then(resolve => log(resolve));

  f2();
}

server.get("/zd08", (req, res) => {
  main();
});
const app = server.listen(PORT, (err) => {
  if (err) log("server fatal!" + err);
  else log("server ok!");
});
