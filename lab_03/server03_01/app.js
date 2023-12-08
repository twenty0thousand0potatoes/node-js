
import express from 'express'
import { log } from 'console'
import readline from 'readline';

const server = express();
server.use(express.json());

const PORT = 5000;

const applicatioState = {
    message: null,
}

const setApplicationState = (newState) => {
    applicatioState.message = newState;
    if (applicatioState.message === 'exit') {

        try {
            application.close();
            log('shutdown server...');
            process.exit(0);
        } catch (err) {
            log(err);
        }

    }
    else
        updateConsolePrompt();
}

const updateConsolePrompt = () => {
    process.stdout.write(`Текущее состояние приложения: ${applicatioState.message} > `);
}

const read_input_mess = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

read_input_mess.on('line', (input) => {
    const newState = input.trim().toLowerCase();
    if (['norm', 'stop', 'test', 'idle', 'exit'].includes(newState)) {
        setApplicationState(newState);
    }
    else {
        console.log('Неверное состояние. Допустимые состояния: norm, stop, test, idle');
        updateConsolePrompt();
    }
});


server.get('/', (req, res) => {
    res.status(200);
    res.header('Content-Type', 'text/html');
    res.end(`<h1>${applicatioState.message}</h1>`)
})


const application = server.listen(PORT, err => {
    updateConsolePrompt();
    if (err) {
        applicatioState.message = 'err' + err;
        log(applicatioState.message)
    }
    else {
        if (applicatioState.message !== null)

            log(`server ok!, state:${applicatioState.message}`);
        else {
            log('Неуказано состояние приложения!');
        }
    }
})



