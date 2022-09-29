export function distance(x1:number,y1:number,x2:number,y2:number){
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

export function hexToRGB(hex:string){
    const cleanedHex = hex.replace("#","");
    const aRgbHex = cleanedHex.match(/.{1,2}/g);
    if(!aRgbHex) return {r:0,g:0,b:0};
    return {
        r: parseInt(aRgbHex[0], 16),
        g: parseInt(aRgbHex[1], 16),
        b: parseInt(aRgbHex[2], 16)
    };
}