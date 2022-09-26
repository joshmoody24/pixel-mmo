import Player from "./Player"
import Position from "./Position"
import Settings from "./Settings"


export default interface Game {
    players: Player[],
    player: Player,
    settings: Settings,
    cursor: Position,
}