const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');


const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(publicPath));

// game logic
class RGB {
	constructor(r,g,b,a=255){
		this.setColor(r,g,b,a);
	}

	toArray(){
		return [this.r, this.g, this.b, this.a]
	};

	setColor(r,g,b,a=255){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}

class Player {
	constructor(username,x,y,color){
		this.username = username;
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.color = color;
	}
	move(direction){
		if(direction === "up"){
			this.y--;
		}
		else if (direction === "down"){
			this.y++;
		}
		else if(direction === "left"){
			this.x--;
		}
		else if(direction === "right"){
			this.x++;
		}
		if(this.x >= settings.width) this.x = settings.width - 1;
		if(this.x < 0) this.x = 0;
		if(this.y >= settings.height) this.y = settings.height - 1;
		if(this.y < 0) this.y = 0;
	}
}

const connections =  {};
const WIDTH = 30;
const HEIGHT = 30;
const settings = {
	width: WIDTH,
	height: HEIGHT,
	colors: [{name: "red", rgb: new RGB(255,0,0)}, {name: "yellow", rgb: new RGB(255,255,0)}, {name: "green", rgb: new RGB(0, 255, 0)}, {name: "blue", rgb: new RGB(0,0,255)}],
}

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get('/game-data', (req, res) => {
	res.send(game)
});

const players = () => {
	return Object.keys(connections).map(key => connections[key]);
}

app.get('/username-check/:username', (req, res) => {
	res.send(!players().map(p => p.username).includes(req.params.username))
})

io.on('connection', (socket) => {
	const username = socket.handshake.query.username;
	let player;
	const socketId = socket.id.toString();
	console.log(`${username} joined the game.`);
	const randomColor = settings.colors[Math.floor(Math.random() * settings.colors.length)];
	connections[socketId] = (new Player(username, Math.random() * settings.width, Math.random() * settings.height, randomColor));
	player = connections[socket.id];
	socket.emit('initialize-game', {settings, players: players(), player});
	socket.broadcast.emit('player-joined', player);

	socket.on('change-color', (colorName) => {
		console.log(`${username} changed color to ${colorName}`)
		const selectedColor = settings.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
		player.color = selectedColor;
		io.emit('change-color', {username: player.username, color: selectedColor});
	});

	socket.on('move-player', (direction) => {
		console.log(`${username} moved ${direction}`)
		player.move(direction);
		io.emit('move-player', player);
	});

	socket.on('disconnect', () => {
		console.log(`${username} (${socketId}) disconnected.`);
		io.emit('player-disconnect', username);
		delete connections[socketId];
	})

	socket.on('connect_error', (err) => console.log("something went wrong", err));
});

/*
function gameStep(){
	game.players.forEach(player => {
		// random movement
		const movementOptions = ["up", "down", "left", "right"];
		const movement = movementOptions[Math.floor(Math.random() * movementOptions.length)];
		player.move(movement);
		io.emit("game-update", game);
	});
}
setInterval(gameStep, 1000);
*/

server.listen(port, () => console.log(`App is running on port ${port}.`));
