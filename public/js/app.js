var socket;

var canvas = document.getElementById("pixel-canvas");
var ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
loginModal.show();
const loginForm = document.getElementById('login-form');

const CANVAS_SCALE = 30;

// buttons
const upBtn = document.getElementById("btn-up");
upBtn.addEventListener('click', () => {
    socket.emit("move-player", "up");
});
const leftBtn = document.getElementById("btn-left");
leftBtn.addEventListener('click', () => socket.emit("move-player", "left"));
const toggleBtn = document.getElementById("btn-toggle");
toggleBtn.addEventListener('click', () => socket.emit("move-player", "toggle"));
const rightBtn = document.getElementById("btn-right");
rightBtn.addEventListener('click', () => socket.emit("move-player", "right"));
const downBtn = document.getElementById("btn-down");
downBtn.addEventListener('click', () => socket.emit("move-player", "down"));

// set up ui elements
const buttons = document.querySelectorAll("#color-buttons>button");
buttons.forEach(button => {
    button.addEventListener('click', () => {
        socket.emit('change-color', button.innerHTML.toLowerCase())
        console.log("changing color")
    });
})

const setBGColor = (color) => {
    document.body.style.backgroundColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},0.3)`;
    console.log(document.body.style.backgroundColor);
};

const drawGame = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = 'rgba(210,255,255,255)';
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
    const game = window.game;
    // start with white square
    // draw each player
    console.log(game.players);
    game.players.forEach(player => {
        ctx.fillStyle = `rgba(${player.color.rgb.r}, ${player.color.rgb.g}, ${player.color.rgb.b}, ${player.color.rgb.a})`;
        ctx.fillRect(player.x * CANVAS_SCALE, player.y * CANVAS_SCALE, CANVAS_SCALE, CANVAS_SCALE);
        ctx.font = "16px arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(player.username, player.x*CANVAS_SCALE + CANVAS_SCALE/2, player.y*CANVAS_SCALE - CANVAS_SCALE*3/7);
    });
}

function resizeCanvas(){
    ctx.canvas.height = game.settings.height * CANVAS_SCALE;
    ctx.canvas.width = game.settings.width * CANVAS_SCALE;
    canvas.style.width = window.innerWidth + "px";
    const aspect = game.settings.width / game.settings.height;
    canvas.style.height = window.innerWidth / aspect + "px";
    //ctx.scale(PIXEL_SCALE,PIXEL_SCALE);
}

const startGame = (username) => {
    socket = io({query: {username: username}});
    loginModal.hide();

    socket.on('initialize-game', (data) => {
        console.log("Initialized game", data);
        window.game = data;
        resizeCanvas();
        drawGame();
        setBGColor(window.game.player.color);
    });
    
    socket.on('change-color', (data) => {
        game.players.find(p => p.username === data.username).color = data.color;
        if(data.username === window.game.player.username) setBGColor(data.color);
        drawGame();
    });
    
    socket.on('move-player', (data) => {
        const player = game.players.find(p => p.username === data.username);
        player.x = data.x;
        player.y = data.y;
        drawGame();
    });

    socket.on('player-disconnect', (username) => {
        console.log(`${username} disconnected`);
        game.players = game.players.filter(p => p.username !== username);
        drawGame();
    })

    socket.on('player-joined', (player) => {
        game.players.push(player)
        drawGame();
    })
    
};

window.addEventListener("resize", resizeCanvas);

loginForm.onsubmit = async (event) => {
    const desiredUsername = document.getElementById("username").value;
    event.preventDefault();
    const check = await axios.get('/username-check/' + desiredUsername);
    if(check.data === true) startGame(desiredUsername);
};