const settings = require("./settings.json");
import {calcStraightLine, distance} from "../utils"
import Position from "../interfaces/Position";
import IPlayer from "../interfaces/IPlayer";

export default class Player implements IPlayer {

    username:string;
    position:Position;
    color:string;
    energy:number;
    health:number;

	constructor(username:string,x:number,y:number,color:string){
		this.username = username;
		this.position = {x:Math.floor(x), y:Math.floor(y)};
		this.color = color;
        this.energy = settings.startingEnergy ?? 1;
        this.health = settings.startingHealth;
	}

    canSpendEnergy(amount:number){
        return amount <= this.energy;
    }

    spendEnergy(amount:number){
        this.energy -= Math.abs(Math.round(amount));
        if(this.energy < 0) this.energy = 0;
    }

    takeDamage(amount:number){
        this.health -= Math.abs(Math.round(amount));
        if(this.health <= 0) this.health = 0;
    }

    gainEnergy(){
        this.energy++;
    }

    attemptShoot(x:number,y:number,energyCost:number){
        if(this.canSpendEnergy(energyCost) == false) return false;
        this.spendEnergy(energyCost);
        return true;
    }

	move(x:number, y:number, playerList:Player[], tiles:Array<Array<string>>){

        // compute energy
        const requiredEnergy = calcStraightLine(this.position, {x,y}).length
        if(this.canSpendEnergy(requiredEnergy) == false) return false;

        // clamp to bounds
        if(x >= settings.width) x = settings.width - 1;
		if(x < 0) x = 0;
		if(y >= settings.height) y = settings.height - 1;
		if(y < 0) y = 0;

        // check for player collisions
		let collided = false;
		playerList.forEach(p => {
			if(p.position.x === x && p.position.y === y && p !== this){
				collided = true;
			}
		})

        if(collided) return false;

        if(tiles[x][y] !== this.color) return false;

        this.spendEnergy(requiredEnergy);
        this.position.x = x;
        this.position.y = y;
        return true;
	}
}