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
	constructor(name,x,y,color){
		this.name = name;
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.color = color;
	}
	move(direction){
		if(direction === "up"){
			this.y++;
		}
		else if (direction === "down"){
			this.y--;
		}
		else if(direction === "left"){
			this.x--;
		}
		else if(direction === "right"){
			this.x++;
		}
	}
}
const WIDTH = 100;
const HEIGHT = 50;
const game = {
	width: WIDTH,
	height: HEIGHT,
	players: [],
	colors: [{name: "red", rgb: new RGB(255,0,0)}, {name: "yellow", rgb: new RGB(255,255,0)}, {name: "green", rgb: new RGB(0, 255, 0)}, {name: "blue", rgb: new RGB(0,0,255)}],
}
game.players.push(new Player("testPlayer", game.width/2, game.height/2, game.colors[0]));


app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get('/game-data', (req, res) => {
	res.send(game)
});

io.on('connection', (socket) => {
	console.log("User connected.");

	socket.on('startGame', () => {
		console.log("starting game...");
		io.emit('startGame');
	});

	socket.on('change-color', (data) => {
		console.log("changing color...")
		const selectedColor = game.colors.find(c => c.name.toLowerCase() === data.color.toLowerCase());
		const player = game.players.find(p => p.name === data.name)
		console.log(player);
		player.color = selectedColor;
		console.log(player);
		io.emit('change-color', game.selectedColor);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected.');
	})
});

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

server.listen(port, () => console.log(`App is running on port ${port}.`));
