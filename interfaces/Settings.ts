import Color from "./Color"

export default interface Settings{
    height: number,
    width: number,
    canvasScale: number,
    colors: Map<string,Color>,
    energyRegenSpeed: number,
}