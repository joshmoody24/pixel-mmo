const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const Player = require('./Player');
const settings = require('./settings.json');
const cors = require('cors');

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

const connections =  {};

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get('/game-data', (req, res) => {
	res.send(game)
});

const getPlayers = () => {
	return Object.keys(connections).map(key => connections[key]);
}

app.get('/username-check/:username', (req, res) => {
	res.send(!getPlayers().map(p => p.username).includes(req.params.username))
})

io.on('connection', (socket) => {
	try{
		const username = socket.handshake.query.username;
		let player;
		const socketId = socket.id.toString();
		console.log(`${username} joined the game.`);
		const randomColor = settings.colors[Math.floor(Math.random() * settings.colors.length)];
		connections[socketId] = (new Player(username, Math.random() * settings.width, Math.random() * settings.height, randomColor));
		player = connections[socket.id];

		socket.emit('initialize-game', {settings, players: getPlayers(), username});
		socket.broadcast.emit('player-joined', player);

		// auto regenerate energy
		setInterval(() => {
			player.gainEnergy();
			socket.emit('gained-energy', username);
		},settings.energyRegenSpeed * 1000);

		socket.on('change-color', (colorName) => {
			console.log(`${username} changed color to ${colorName}`)
			const selectedColor = settings.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
			player.color = selectedColor;
			io.emit('change-color', {username: player.username, color: selectedColor});
		});

		socket.on('move-player', (position) => {
			// todo: check for collisions
			const moved = player.move(position.x, position.y, getPlayers());
			if(moved){
				io.emit('move-player', player);
				console.log(`${username} moved to ${position.x},${position.y}`)
			}
			else{
				console.log(`${username} tried to move to ${position.x},${position.y}, but lacked energy`)
			}
		});

		socket.on('disconnect', () => {
			console.log(`${username} (${socketId}) disconnected.`);
			io.emit('player-disconnect', username);
			delete connections[socketId];
		})

		socket.on('connect_error', (err) => console.log("something went wrong", err));
	} catch(err){
		console.error(err);
	}
});

server.listen(port, () => console.log(`App is running on port ${port}.`));
