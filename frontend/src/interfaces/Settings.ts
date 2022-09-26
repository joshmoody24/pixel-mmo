export default interface Settings{
    height: number,
    width: number,
    canvasScale: number,
    colors: Map<string,string>,
}

export const defaultSettings : Settings = {
    height: 25,
    width: 25,
    canvasScale: 60,
    colors: new Map<string,string>()
}