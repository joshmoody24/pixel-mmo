import Color, { defaultColors } from "./Color"

export default interface Settings{
    height: number,
    width: number,
    canvasScale: number,
    colors: Color[],
    energyRegenSpeed: number,
    playerAnimationSpeed: number,
}

export const defaultSettings : Settings | null= null