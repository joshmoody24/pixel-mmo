let socket = io();


var canvas = document.getElementById("pixel-canvas");
var ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");

// buttons
const upBtn = document.getElementById("btn-up");
upBtn.addEventListener('click', () => {
    console.log("up"); socket.emit("move-player", {name: "testPlayer", direction: "up"})
});
const leftBtn = document.getElementById("btn-left");
leftBtn.addEventListener('click', () => socket.emit("move-player", {name: "testPlayer", direction: "left"}));
const toggleBtn = document.getElementById("btn-toggle");
toggleBtn.addEventListener('click', () => socket.emit("move-player", {name: "testPlayer", direction: "toggle"}));
const rightBtn = document.getElementById("btn-right");
rightBtn.addEventListener('click', () => socket.emit("move-player", {name: "testPlayer", direction: "right"}));
const downBtn = document.getElementById("btn-down");
downBtn.addEventListener('click', () => socket.emit("move-player", {name: "testPlayer", direction: "down"}));

const colors = [{name: "red", rgb: [255,0,0]}, {name: "yellow", rgb: [255,255,0]}, {name: "green", rgb: [0,255,0]}, {name: "blue", rgb: [0,0,255]}];
window.selectedColor = colors[0];

// set up ui elements
const buttons = document.querySelectorAll("#color-btn-group>button");
buttons.forEach(button => {
    button.addEventListener('click', () => socket.emit('change-color', {name: "testPlayer", color: button.innerHTML.toLowerCase()}));
})

const drawGame = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = 'rgba(220,255,255,255)';
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
    const game = window.game;
    // start with white square

    // draw each player
    game.players.forEach(player => {
        console.log("drawing", player);
        ctx.fillStyle = `rgba(${player.color.rgb.r}, ${player.color.rgb.g}, ${player.color.rgb.b}, ${player.color.rgb.a})`;
        ctx.fillRect(player.x, player.y, 1, 1);
    });
}

function resizeCanvas(){
    ctx.canvas.height = game.height;
    ctx.canvas.width = game.width;
    canvas.style.width = window.innerWidth + "px";
    const aspect = game.width / game.height;
    canvas.style.height = window.innerWidth / aspect + "px";
    //ctx.scale(PIXEL_SCALE,PIXEL_SCALE);
}

const startGame = async () => {
    const res = await axios.get('/game-data');
    window.game = res.data;
    const game = this.window.game;
    console.log(game);
    resizeCanvas();
    drawGame();
    // canvas.style.aspectRatio = `${game.width}/${game.height}`;
};

window.addEventListener("resize", resizeCanvas);

startGame();

socket.on('game-update', (data) => {
    window.game = data;
    drawGame();
});

socket.on('change-color', (data) => {
    window.game.players.find(p => p.name === data.name).color = data.color;
})

socket.on('move-player', (data) => {
    const player = game.players.find(p => p.name === data.name);
    player.x = data.x;
    player.y = data.y;
    player[0] = player;
    console.log(data);
    drawGame();
});
