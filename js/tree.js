import {GameObject} from './gameObject.js'
class Tree extends GameObject{
    constructor(x, y, Perseus){
        super(false, Perseus);
        this.sprite = null;
        this.resourceAmount = 1000;
        this.exhausted = false;
        let square = this.Perseus.navigator.getSquare(x,y);
        let coords = this.Perseus.navigator.getCoords(square.x, square.y);
        this.addSprite(coords.x, coords.y);
        this.type = 'wood';
        this.x = square.x;
        this.y = square.y;

        for(let i = 0; i < 2; i++)
        {
            for(let j = 0; j < 2; j++){
                this.Perseus.navigator.markOccupied(this.x+i, this.y+j);
            }
        }

    }

    addSprite(x, y){    
        this.sprite = this.game.add.sprite(x, y, 'tree');
        // this.sprite.anchor.x = 0.5;
        // this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.select(this);
        }, this);

        this.sprite.events.onInputUp.add(function(){
            this.Perseus.controller.endWithSelect(this);
        }, this);
    }
    takeDamage(rate){
        this.resourceAmount -= rate;
        console.log("The current resource amount is: " + this.resourceAmount)
        if (this.resourceAmount <= 0) {
            this.exhausted = true;
        }
    }
}
export {Tree};
