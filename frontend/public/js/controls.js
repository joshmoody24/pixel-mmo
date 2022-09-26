import settings from "./settings.json" assert {type: 'json'}
import { drawGame } from './graphics.js';
import { distance } from './utils.js';

export function setUpControls(socket, ctx, handleAction){

    // action popover
    ctx.canvas.addEventListener('click', (event) => {
        // get the relative location of the click
        const relativeX = event.offsetX / ctx.canvas.clientWidth;
        const relativeY = event.offsetY / ctx.canvas.clientHeight;
        const x = Math.floor((relativeX * ctx.canvas.width)/settings.CANVAS_SCALE);
        const y = Math.floor((relativeY * ctx.canvas.height)/settings.CANVAS_SCALE);
        const squareWidth = ctx.canvas.clientWidth / window.game.settings.width;
        console.log("square width", squareWidth)
        console.log(x,y);
        window.gameState.cursor = {x,y}
        drawGame(ctx);
        //popover.classList.remove("d-none");
        const oldBtn = document.getElementById('action-popover');
        if(oldBtn) document.body.removeChild(oldBtn);
        const oldPopovers = document.querySelectorAll('.action-popover');
        oldPopovers.forEach(p => document.body.removeChild(p));
        const popoverX = `${Math.floor((event.offsetX + ctx.canvas.offsetLeft)/squareWidth)*squareWidth}px`
        const popoverY = `${Math.floor((event.offsetY + ctx.canvas.offsetTop)/squareWidth)*squareWidth}px`
        const popoverBtn = document.createElement('button');
        popoverBtn.setAttribute('id', 'action-popover');
        popoverBtn.style.display = "fixed";
        document.body.appendChild(popoverBtn);
        popoverBtn.style.left = popoverX;
        popoverBtn.style.top = popoverY;
        var popover = new bootstrap.Popover(popoverBtn, {
            container: 'body',
            title: "Actions",
            content: 'Select an action',
            trigger: 'manual',
            animation: false,
            customClass: 'action-popover',
            offset: "0,40"
        })
        console.log(popover);
        popover.show();

        // compute cost of actions
        console.log(window.gameState.player);
        const moveCost = Math.ceil(distance(window.gameState.player.x, window.gameState.player.y, x, y))

        // inject context-sensitive buttons
        const shootBtn = document.createElement('button');
        shootBtn.innerText = `Shoot (${moveCost})`;
        shootBtn.className = "btn btn-secondary d-block";

        const moveBtn = document.createElement('button');
        moveBtn.innerText = `Move (${moveCost})`;
        moveBtn.className = "btn btn-primary d-block";
        moveBtn.addEventListener('click', () => handleAction({action: "movement", x, y}))

        const btnParent = document.createElement('div');
        btnParent.className = "d-grid gap-2";

        popover.tip.lastElementChild.appendChild(btnParent);
        btnParent.appendChild(moveBtn);
        btnParent.appendChild(shootBtn);
    });

}
