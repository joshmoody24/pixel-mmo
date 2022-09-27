import Color, {defaultColors} from "./Color";
import Position from "./Position";

export default interface Player {
    position: Position,
    energy: number,
    color: string,
    username: string,
    health: number,
}

export const defaultPlayer : Player = {
    position: {x:0,y:0},
    energy: 0,
    color: "default",
    username: "default",
    health: 0,
}