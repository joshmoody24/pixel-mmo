import Color, {defaultColors} from "./Color";
import Position from "./Position";

export default interface Player {
    position: Position,
    energy: number,
    color: Color,
    username: string,
}

export const defaultPlayer : Player = {
    position: {x:0,y:0},
    energy: 0,
    color: defaultColors[0],
    username: "default"
}