const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { log } = require("console");
const axios = require("axios");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const server = app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    log("server fatal! ".concat(err));
  } else {
    log("server start ok on: ".concat(process.env.PORT));
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      const { username } = JSON.parse(message);

      const r = await axios.put(
        "https://api.chatengine.io/users/",
        {
          username: username,
          secret: username,
          first_name: username,
        },
        { headers: { "private-key": "5f38b0d4-97fe-4139-9239-1470d089495a" } }
      );

      ws.send(JSON.stringify(r.data));
    } catch (err) {
      ws.send(JSON.stringify(err.response.data));
    }
  });

  ws.on("close", () => {
  });
});