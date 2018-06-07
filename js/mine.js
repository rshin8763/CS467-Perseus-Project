import {GameObject} from './gameObject.js'
class Mine extends GameObject{
    constructor(faction, x, y, Perseus){
        super(false, faction, Perseus);
        this.sprite = null;
        this.resourceAmount = 100;
        this.exhausted = false;
        let square = this.Perseus.navigator.getSquare(x,y);
        let coords = this.Perseus.navigator.getCoords(square.x, square.y);
        this.addSprite(coords.x, coords.y);
        this.type = 'gold';
        this.x = square.x;
        this.y = square.y;

        for(let i = 0; i < 2; i++)
        {
            for(let j = 0; j < 2; j++){
                console.log(this.x, ' ', this.y);
                this.Perseus.navigator.markOccupied(this.x+i, this.y+j);
            }
        }
    }

    addSprite(x, y){    
        this.sprite = this.game.add.sprite(x, y, 'mine');
        this.sprite.frame = 1;
        this.sprite.scale.setTo(0.6667, 0.6667);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.select(this);
        }, this);

        this.sprite.events.onInputUp.add(function(){
            this.Perseus.controller.endWithSelect(this);
        }, this);
        
        this.Perseus.gameSprites.add(this.sprite);
    }

    loseResource(rate){
        this.resourceAmount -= rate;
        console.log("The current resource amount is: " + this.resourceAmount)
        if (this.resourceAmount <= 0) {
            this.exhausted = true;
            this.sprite.frame = 0;
        }
    }
}
export {Mine};
