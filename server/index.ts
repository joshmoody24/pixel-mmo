import { IncomingMessage, ServerResponse } from "http";

const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

import Settings from "../interfaces/Settings";
import Position from "../interfaces/Position";
import Player from "./Player";
const settings:Settings = require('./settings.json');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
	  origin: "http://127.0.0.1:5173",
	  methods: ["GET", "POST"]
	}
  });app.use(express.static(publicPath));

// <div class="popover bs-popover-auto fade show" role="tooltip" id="popover319061" data-popper-placement="right" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(362px, 213px);"><div class="popover-arrow" style="position: absolute; top: 0px; transform: translate(0px, 10px);"></div><h3 class="popover-header">Popover title</h3></div>

const connections =  new Map<string,string>();
const players = new Map<string,Player>();

const playerList = () => Object.keys(players).map((key) => players.get(key)!);

/*
app.get('/game-data', (req, res) => {
	res.send(game)
});
*/

app.get('/username-check/:username', (req:any, res:any) => {
	res.send(playerList().map(p => p!.username).includes(req.params.username))
})

io.on('connection', (socket:any) => {
	try{
		const username = socket.handshake.query.username;
		let player:Player;
		const socketId = socket.id.toString();
		console.log(`${username} joined the game.`);
		const randomColor = Object.keys(settings.colors).map(key => settings.colors.get(key))[Math.floor(Math.random() * settings.colors.size)]?.name;
		if(players.get(username)){
			socket.disconnect();
			return;
		}
		else{
			players.set(username, new Player(username, Math.random() * settings.width, Math.random() * settings.height, randomColor ?? "errorColor"))
		}
		connections.set(socketId, username);
		player = players.get(username)!;

		socket.emit('initialize-game', {settings, players, username});
		socket.broadcast.emit('player-joined', player);

		// auto regenerate energy
		setInterval(() => {
			player.gainEnergy();
			socket.emit('gained-energy', username);
		},settings.energyRegenSpeed * 1000);

		socket.on('change-color', (colorName:string) => {
			console.log(`${username} changed color to ${colorName}`)
			// make sure it's a real color
			const selectedColor = settings.colors.get(colorName);
			if(!selectedColor) return;
			player.color = colorName;
			io.emit('change-color', {username: player.username, color: selectedColor});
		});

		socket.on('move-player', (position:Position) => {
			// todo: check for collisions
			const moved = player.move(position.x, position.y, playerList());
			if(moved){
				io.emit('move-player', player);
				console.log(`${username} moved to ${position.x},${position.y}`)
			}
			else{
				console.log(`${username} tried to move to ${position.x},${position.y}, but lacked energy`)
			}
		});

		socket.on('shoot-location', (position:Position) => {
			// get player at that position
			const playerAtPos = playerList().find(player => player!.position.x === position.x && player!.position.y === position.y);
			if(!playerAtPos){
				console.log(`${username} shot at ${position.x},${position.y}, but there was nobody there`);
			}
			else{
				// make sure the person can shoot
				const shot = player.attemptShoot(position.x, position.y);
				if(!shot) return;
				playerAtPos.takeDamage(1);
				io.emit('took-damage', {attacker: player, hurtPlayer:playerAtPos, amount:1})
			}
		})

		socket.on('disconnect', () => {
			console.log(`${username} (${socketId}) disconnected.`);
			io.emit('player-disconnect', username);
			connections.delete(socketId);
			players.delete(username);
		})

		socket.on('connect_error', (err:any) => console.log("something went wrong", err));
	} catch(err:any){
		console.error(err);
	}
});

server.listen(port, () => console.log(`App is running on port ${port}.`));


export {}