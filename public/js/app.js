import { setUpControls } from "./controls.js";
import { drawGame, resizeCanvas, setBGColor } from "./graphics.js";

var socket;
var canvas = document.getElementById("pixel-canvas");
var ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
loginModal.show();
const loginForm = document.getElementById('login-form');

// set up ui elements
const buttons = document.querySelectorAll("#color-buttons>button");
buttons.forEach(button => {
    button.addEventListener('click', () => {
        socket.emit('change-color', button.innerHTML.toLowerCase())
    });
})

const startGame = (username) => {
    socket = io({query: {username: username}});
    setUpControls(socket);
    loginModal.hide();

    socket.on('initialize-game', (data) => {
        try{
            console.log("Initialized game", data);
            window.game = data;
            resizeCanvas(ctx);
            setBGColor(window.game.player.color);
            drawGame(ctx);
            window.player = {actionState: "move"};
        } catch(e){
            console.error(e);
        }
    });
    
    socket.on('change-color', (data) => {
        game.players.find(p => p.username === data.username).color = data.color;
        if(data.username === window.game.player.username) setBGColor(data.color);
        drawGame(ctx);
    });
    
    socket.on('move-player', (data) => {
        const player = game.players.find(p => p.username === data.username);
        player.x = data.x;
        player.y = data.y;
        drawGame(ctx);
    });

    socket.on('player-disconnect', (username) => {
        console.log(`${username} disconnected`);
        game.players = game.players.filter(p => p.username !== username);
        drawGame(ctx);
    })

    socket.on('player-joined', (player) => {
        game.players.push(player)
        drawGame(ctx);
    })
};

window.addEventListener("resize", () => resizeCanvas(ctx));

loginForm.onsubmit = async (event) => {
    const desiredUsername = document.getElementById("username").value;
    event.preventDefault();
    const check = await axios.get('/username-check/' + desiredUsername);
    if(check.data === true) startGame(desiredUsername);
};