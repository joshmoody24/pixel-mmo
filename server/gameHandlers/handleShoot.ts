import {calcStraightLine} from "../../utils";
import Position from "../../interfaces/Position";
import Player from "../Player";
import Tilemap from "../../interfaces/Tilemap";

export function handleShoot(socket:any, io:any, players:Player[], username:string, tilemap:Tilemap) {
    socket.on('shoot-location', (position:Position) => {
        // get player at that position
        const player = players.find(p => p.username === username);
        if(!player) return;
        const playerAtPos = players.find(player => player!.position.x === position.x && player!.position.y === position.y);
        // get tiles that were painted in advance because energy cost depends on it
        const tilesPainted = calcStraightLine(player.position, position);
        tilesPainted.forEach((key, value) => {
            tilemap.tiles[key.x][key.y] = player.color;
        })
        const shot = player?.attemptShoot(position.x, position.y,tilesPainted.length);
        if(!shot) return;
        if(playerAtPos){
            playerAtPos.takeDamage(1);
            console.log("player took damage")
            io.emit('took-damage', {attacker: player, hurtPlayer:playerAtPos, amount:1})
        }
        io.emit('painted-tiles', {tiles:tilesPainted,painter:player});
    });
}