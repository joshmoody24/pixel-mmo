export default class Tilemap {
    height:number;
    width: number;
    tiles: Array<Array<string>>;
    constructor(width:number,height:number){
        this.height = height;
        this.width = width;
        this.tiles = new Array<string[]>();
        for(let i = 0; i < width; i++){
            this.tiles.push(new Array<string>());
            for(let j = 0; j < height; j++){
                this.tiles[i].push("");
            }
        }
    }
}