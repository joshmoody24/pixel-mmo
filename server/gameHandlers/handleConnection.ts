import Settings from "../../interfaces/Settings";
import Player from "../Player";
import Position from "../../interfaces/Position";
import { handleShoot } from "./handleShoot";
import Tilemap from "../../interfaces/Tilemap"


export function handleConnection(io:any, connections:Map<string,string>, settings:Settings,players:Map<string,Player>, tilemap:Tilemap) {
    const playerList = () => Array.from(players.keys()).map((key) => players.get(key)!);
    try{
        io.on('connection', (socket:any) => {
            const username = socket.handshake.query.username;
            let player:Player;
            const socketId = socket.id.toString();
            console.log(`${username} joined the game.`);
            const randomColor = settings.colors[Math.floor(Math.random() * settings.colors.length)]?.name;
            if(players.get(username)){
                console.log(players.get(username), players)
                console.log("username already exists")
                socket.disconnect();
                return;
            }
            else{
                players.set(username, new Player(username, Math.random() * settings.width, Math.random() * settings.height, randomColor ?? "errorColor"))
            }
            connections.set(socketId, username);
            player = players.get(username)!;
            // for some reason, sending maps doesn't work.
            socket.emit('initialize-game', {settings, players:playerList(), username, tilemap});
            socket.broadcast.emit('player-joined', player);
        
            // auto regenerate energy
            setInterval(() => {
                player.gainEnergy();
                io.emit('gained-energy', {username, energy:player.energy});
            },settings.energyRegenSpeed * 1000);
        
            socket.on('change-color', (colorName:string) => {
                console.log(`${username} changed color to ${colorName}`)
                // make sure it's a real color
                const selectedColor = settings.colors.find(c => c.name === colorName);
                if(!selectedColor) return;
                player.color = colorName;
                io.emit('change-color', {username: player.username, color: selectedColor});
            });
        
            socket.on('move-player', (position:Position) => {
                // todo: check for collisions
                const moved = player.move(position.x, position.y, playerList(), tilemap.tiles);
                if(moved){
                    io.emit('move-player', player);
                    console.log(`${username} moved to ${position.x},${position.y}`)
                }
                else{
                    console.log(`${username} tried to move to ${position.x},${position.y}, but lacked energy`)
                }
            });
        
            handleShoot(socket, io, playerList(), username, tilemap);
        
            socket.on('disconnect', () => {
                console.log(`${username} (${socketId}) disconnected.`);
                io.emit('player-disconnect', username);
                connections.delete(socketId);
                players.delete(username);
            })
        
            socket.on('connect_error', (err:any) => console.log("something went wrong", err));
        })
    } catch(err:any){
        console.error(err);
    }
}