import React, { createContext, useState } from "react";
import Player, {defaultPlayer} from "../../../interfaces/IPlayer";
import Settings, { defaultSettings } from "../../../interfaces/Settings";
import Tilemap from "../../../interfaces/Tilemap"

interface game {
    players: Map<string,Player>,
    username: string,
    settings: Settings | null,
    cursor: {x:number, y:number, active:boolean},
    socket: any,
    tilemap: Tilemap | null,
}

const defaultValues: game = {
    players: new Map<string,Player>(),
    username: "default",
    settings: defaultSettings,
    cursor: {x:0, y:0, active:false},
    socket: null,
    tilemap: null,
}

const GameContext = createContext(defaultValues);

export default GameContext;