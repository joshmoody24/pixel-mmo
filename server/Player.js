const settings = require("./settings.json");
const distance = require("./utils.js");

class Player {
	constructor(username,x,y,color){
		this.username = username;
		this.position = {};
        this.position.x = parseInt(x);
		this.position.y = parseInt(y);
		this.color = color;
        this.energy = parseInt(settings.startingEnergy) ?? 1;
        this.health = settings.startingHealth;
	}

    canSpendEnergy(amount){
        return amount <= this.energy;
    }

    spendEnergy(amount){
        this.energy -= Math.abs(parseInt(amount));
        if(this.energy < 0) this.energy = 0;
    }

    takeDamage(amount){
        this.health -= Math.abs(parseInt(amount));
        if(this.health <= 0) this.health = 0;
    }

    gainEnergy(){
        this.energy++;
    }

	move(x, y, playerList){

        // compute energy
        const requiredEnergy = distance(this.position.x,this.position.y,x,y);
        if(this.canSpendEnergy(requiredEnergy) == false) return false;

        this.spendEnergy(requiredEnergy);

        // check for player collisions
		let collided = false;
		playerList.forEach(p => {
			if(p.x === x && p.y === y && p !== this){
				collided = true;
			}
		})

        if(collided) return false;

        this.position.x = x;
        this.position.y = y;
        
		if(this.x >= settings.width) this.x = settings.width - 1;
		if(this.x < 0) this.x = 0;
		if(this.y >= settings.height) this.y = settings.height - 1;
		if(this.y < 0) this.y = 0;
        return true;
	}
}

module.exports = Player;