import React, { createContext, useState } from "react";
import Player, {defaultPlayer} from "../interfaces/Player";
import { defaultSettings } from "../interfaces/Settings";

const GameContext = createContext({
    players: {},
    username: "default",
    settings: defaultSettings,
    cursor: {x:0, y:0, active:false},
    socket: null
});

export default GameContext;