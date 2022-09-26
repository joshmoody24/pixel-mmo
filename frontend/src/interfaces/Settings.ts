export default interface Settings{
    height: number,
    width: number,
    canvasScale: number,
}

export const defaultSettings : Settings = {
    height: 25,
    width: 25,
    canvasScale: 60,
}