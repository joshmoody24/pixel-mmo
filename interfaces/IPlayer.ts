import Color, {defaultColors} from "./Color";
import Position from "./Position";

export default interface IPlayer {
    position: Position,
    energy: number,
    color: string,
    username: string,
    health: number,
}

export const defaultPlayer : IPlayer = {
    position: {x:0,y:0},
    energy: 0,
    color: "default",
    username: "default",
    health: 0,
}