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

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
	console.log("User connected.");
	socket.on('startGame', () => {
		console.log("starting game...");
		io.emit('startGame');
	});

	socket.on('crazyIsClicked', (data) => {
		console.log("crazy click");
		io.emit('crazyIsClicked', data);
	});
	socket.on('disconnect', () => {
		console.log('User disconnected.');
	})
});

server.listen(port, () => console.log(`App is running on port ${port}.`));
