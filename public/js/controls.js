export function setUpControls(socket){

    const upBtn = document.getElementById("btn-up");
    const leftBtn = document.getElementById("btn-left");
    const toggleBtn = document.getElementById("btn-toggle");
    const rightBtn = document.getElementById("btn-right");
    const downBtn = document.getElementById("btn-down");

    const actions = {
        moveUp: () => socket.emit("move-player", "up"),
        moveDown: () => socket.emit("move-player", "down"),
        moveLeft: () => socket.emit("move-player", "left"),
        moveRight: () => socket.emit("move-player", "right"),
        toggle: () => {
            if(window.player.actionState !== "blocks"){
                window.player.actionState = "blocks";
                toggleBtn.firstChild.classList.add("bi-boxes");
                toggleBtn.firstChild.classList.remove("bi-arrows");
            }
            else{
                window.player.actionState = "move";
                toggleBtn.firstChild.classList.remove("bi-boxes");
                toggleBtn.firstChild.classList.add("bi-arrows");
            }
        }
    }

    const keyMap = {
        "ArrowUp": actions.moveUp,
        "ArrowDown": actions.moveDown,
        "ArrowLeft": actions.moveLeft,
        "ArrowRight": actions.moveRight,
    }

    upBtn.addEventListener('click', actions.moveUp);
    leftBtn.addEventListener('click', actions.moveLeft);
    toggleBtn.addEventListener('click', actions.toggle);
    rightBtn.addEventListener('click', actions.moveRight);
    downBtn.addEventListener('click', actions.moveDown);

    document.addEventListener('keydown', event => {
        console.log("key pressed", event.key, keyMap[event.key])
        if(keyMap[event.key]) keyMap[event.key]();
    })

}
