const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

import Settings from "../interfaces/Settings";
import Position from "../interfaces/Position";
import Player from "./Player";
const settings:Settings = require('./settings.json');

import { handleConnection } from "./gameHandlers/handleConnection";
import Tilemap from "../interfaces/Tilemap";

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
	  origin: "http://127.0.0.1:5173",
	  methods: ["GET", "POST"]
	},
  });
app.use(express.static(publicPath));

const connections =  new Map<string,string>();
const players = new Map<string,Player>();
const tilemap = new Tilemap(settings.width, settings.height)

const playerList = () => Array.from(players.keys()).map((key) => players.get(key)!);

app.get('/username-check/:username', (req:any, res:any) => {
	res.send(playerList().map(p => p!.username).includes(req.params.username))
})

handleConnection(io, connections, settings, players, tilemap);

server.listen(port, () => console.log(`App is running on port ${port}.`));

export {}