const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const Player = require('./Player');
const settings = require('./settings.json');

console.log(Player);

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(publicPath));

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
	const username = socket.handshake.query.username;
	let player;
	const socketId = socket.id.toString();
	console.log(`${username} joined the game.`);
	const randomColor = settings.colors[Math.floor(Math.random() * settings.colors.length)];
	connections[socketId] = (new Player(username, Math.random() * settings.width, Math.random() * settings.height, randomColor));
	player = connections[socket.id];
	socket.emit('initialize-game', {settings, players: getPlayers(), player});
	socket.broadcast.emit('player-joined', player);

	socket.on('change-color', (colorName) => {
		console.log(`${username} changed color to ${colorName}`)
		const selectedColor = settings.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
		player.color = selectedColor;
		io.emit('change-color', {username: player.username, color: selectedColor});
	});

	socket.on('move-player', (direction) => {
		console.log(`${username} moved ${direction}`)
		player.move(direction, getPlayers());
		io.emit('move-player', player);
	});

	socket.on('disconnect', () => {
		console.log(`${username} (${socketId}) disconnected.`);
		io.emit('player-disconnect', username);
		delete connections[socketId];
	})

	socket.on('connect_error', (err) => console.log("something went wrong", err));
});

server.listen(port, () => console.log(`App is running on port ${port}.`));
