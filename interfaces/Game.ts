import Player from "./Player"
import Position from "./Position"
import Settings from "./Settings"
import {Socket} from "socket.io-client"

export default interface Game {
    players: Player[],
    username: string,
    setPlayer: Function,
    settings: Settings,
    cursor: Position,
    socket: Socket | null,
}