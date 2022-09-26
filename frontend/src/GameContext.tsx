import { createContext } from "react";
import Player, {defaultPlayer} from "./interfaces/Player";
import { defaultSettings } from "./interfaces/Settings";

const GameContext = createContext({
    players: new Array<Player>(),
    player: defaultPlayer,
    settings: defaultSettings,
    cursor: {x:0, y:0, active:false}
});

export default GameContext;