import Position from "./interfaces/Position";

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

export function calcStraightLine (startCoordinates:Position, endCoordinates:Position) {
    var coordinatesArray = new Array<Position>();
    // Translate coordinates
    var x1 = startCoordinates.x;
    var y1 = startCoordinates.y;
    var x2 = endCoordinates.x;
    var y2 = endCoordinates.y;
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push({x:x1, y:y1});
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        var e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push({x:x1,y:y1});
    }
    // Return the result
    return coordinatesArray;
}