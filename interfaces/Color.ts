export default interface Color {
    name: string,
    softHex: string,
    strongHex:string,
    variation:number
}

export const defaultColors : Color[] = [
    {name: "red", strongHex: "#f00", softHex: "#f666", variation:0.1}
]