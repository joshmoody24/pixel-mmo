const settings = require("./settings.json");

class Player {
	constructor(username,x,y,color){
		this.username = username;
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.color = color;
	}
	move(direction, playerList){
		const origX= this.x;
		const origY =  this.y;

		if(direction === "up"){
			this.y--;
		}
		else if (direction === "down"){
			this.y++;
		}
		else if(direction === "left"){
			this.x--;
		}
		else if(direction === "right"){
			this.x++;
		}
		if(this.x >= settings.width) this.x = settings.width - 1;
		if(this.x < 0) this.x = 0;
		if(this.y >= settings.height) this.y = settings.height - 1;
		if(this.y < 0) this.y = 0;

		// check for player collisions
		let collided = false;
		playerList.forEach(p => {
			if(p.x === this.x && p.y === this.y && p !== this){
				collided = true;
			}
		})
		if(collided){
			this.x = origX;
			this.y = origY;
		}
	}
}

module.exports = Player;