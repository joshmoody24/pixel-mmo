import settings from "./settings.json" assert {type: 'json'}

export const drawGame = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'rgba(210,255,255,255)';
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
    const game = window.game;
    const scale = settings.CANVAS_SCALE;
    // start with white square
    // draw each player
    game.players.forEach(player => {
        ctx.fillStyle = `${player.color.hex}`;
        ctx.fillRect(player.x * scale, player.y * scale, scale, scale);
        ctx.font = "32px arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(player.username, player.x*scale + scale/2, player.y*scale - scale*3/7);
    });
}

export function resizeCanvas(ctx){
    ctx.canvas.height = game.settings.height * settings.CANVAS_SCALE;
    ctx.canvas.width = game.settings.width * settings.CANVAS_SCALE;
    if(document.documentElement.clientWidth < document.documentElement.clientHeight){
        ctx.canvas.style.width = document.documentElement.clientWidth + "px";
        const aspect = game.settings.width / game.settings.height;
        ctx.canvas.style.height = document.documentElement.clientWidth / aspect + "px";
    }
    else{
        ctx.canvas.style.height = document.documentElement.clientHeight + "px";
        const aspect = game.settings.width / game.settings.height;
        ctx.canvas.style.width = document.documentElement.clientHeight * aspect + "px";
    }
}

export const setBGColor = (color) => {
    document.body.style.backgroundColor = `${color.hex}44`;
};