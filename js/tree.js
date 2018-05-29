import {GameObject} from './gameObject.js'
class Tree extends GameObject{
    constructor(x, y, Perseus){
        super(false, Perseus);
        this.sprite = null;
        this.resourceAmount = 1000;
        this.exhausted = false;
        this.addSprite(x,y);
        this.type = 'wood';
        this.x = x;
        this.y = y;
    }

    addSprite(x, y){    
        this.sprite = this.game.add.sprite(x, y, 'tree');
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.select(this);
        }, this);

        this.sprite.events.onInputUp.add(function(){
            this.Perseus.controller.endWithSelect(this);
        }, this);
    }
    takeDamage(rate){
        resourceAmount -= rate;
        console.log("The current resource amount is: " + this.resourceAmount)
        if (resourceAmount <= 0) {
            this.exhausted = true;
        }
    }
}
export {Tree};
