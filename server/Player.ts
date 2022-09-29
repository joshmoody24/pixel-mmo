const settings = require("./settings.json");
import {distance} from "../utils"
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

    attemptShoot(x:number,y:number){
        const requiredEnergy = distance(this.position.x,this.position.y,x,y);
        if(this.canSpendEnergy(requiredEnergy) == false) return false;
        this.spendEnergy(requiredEnergy);
        return true;
    }

	move(x:number, y:number, playerList:Player[]){

        // compute energy
        const requiredEnergy = distance(this.position.x,this.position.y,x,y);
        if(this.canSpendEnergy(requiredEnergy) == false) return false;

        this.spendEnergy(requiredEnergy);

        // check for player collisions
		let collided = false;
		playerList.forEach(p => {
			if(p.position.x === x && p.position.y === y && p !== this){
				collided = true;
			}
		})

        if(collided) return false;

        this.position.x = x;
        this.position.y = y;
        
		if(this.position.x >= settings.width) this.position.x = settings.width - 1;
		if(this.position.x < 0) this.position.x = 0;
		if(this.position.y >= settings.height) this.position.y = settings.height - 1;
		if(this.position.y < 0) this.position.y = 0;
        return true;
	}
}