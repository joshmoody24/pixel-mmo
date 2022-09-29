export default interface Color {
    name: string,
    softHex: string,
    strongHex:string,
}

export const defaultColors : Color[] = [
    {name: "red", strongHex: "#f00", softHex: "#f666"}
]