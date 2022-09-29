import {calcStraightLine} from "../../utils";
import Position from "../../interfaces/Position";
import Player from "../Player";

export function handleShoot(socket:any, io:any, players:Player[], username:string) {
    socket.on('shoot-location', (position:Position) => {
        // get player at that position
        const player = players.find(p => p.username === username);
        if(!player) return;
        const playerAtPos = players.find(player => player!.position.x === position.x && player!.position.y === position.y);
        if(playerAtPos){
            const shot = player?.attemptShoot(position.x, position.y);
            if(!shot) return;
            playerAtPos.takeDamage(1);
            console.log("player took damage")
            io.emit('took-damage', {attacker: player, hurtPlayer:playerAtPos, amount:1})
        }
        // get tiles that were painted
        const tilesPainted = calcStraightLine(player.position, position);
        io.emit('painted-tiles', tilesPainted);
    });
}