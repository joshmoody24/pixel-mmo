let socket = io();


const PIXEL_SCALE = 10;
var canvas = document.getElementById("pixel-canvas");
var ctx = canvas.getContext("2d");

const colors = [{name: "red", rgb: [255,0,0]}, {name: "yellow", rgb: [255,255,0]}, {name: "green", rgb: [0,255,0]}, {name: "blue", rgb: [0,0,255]}];
window.selectedColor = colors[0];

// set up ui elements
const buttons = document.querySelectorAll("#color-btn-group>button");
buttons.forEach(button => {
    button.addEventListener('click', () => console.log("hm"));
})

const drawGame = () => {
    const game = window.game;
    // start with white square
    const pixelData = new Uint8ClampedArray(4 * window.game.width * window.game.height);
    for(let i = 0; i < pixelData.length; i+=4){
        pixelData[i] = 220;	    // R
        pixelData[i+1] = 255;	// G
        pixelData[i+2] = 255;	// B
        pixelData[i+3] = 255;	// A
    }

    // draw each player
    game.players.forEach(player => {
        // calculate array index
        const i = (player.x * 4) + (game.width * player.y * 4);
        pixelData[i] = player.color.r;
        pixelData[i+1] = player.color.g;
        pixelData[i+2] = player.color.b;
        pixelData[i+3] = player.color.a;
    });

    const myImageData = new ImageData(pixelData, window.game.width, window.game.height);
    ctx.putImageData(myImageData, 0, 0);
}

const startGame = async () => {
    const res = await axios.get('/game-data');
    window.game = res.data;
    const game = this.window.game;
    canvas.height = game.height;
    canvas.width = game.width;
    canvas.style.width = `${PIXEL_SCALE * game.width}px`;
    canvas.style.height = `${PIXEL_SCALE * game.height}px`;
};

startGame();

socket.on('game-update', (data) => {
    window.game = data;
    drawGame();
});

socket.on('change-color', (data) => {
    window.selectedColor = data;
})
