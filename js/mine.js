import {GameObject} from './gameObject.js'
import {Resource} from './resource.js'
class Mine extends Resource{
    constructor(faction, x, y, Perseus){
        super(faction, 'gold', Perseus);
        this.sprite = null;
        let square = this.Perseus.navigator.getSquare(x,y);
        let coords = this.Perseus.navigator.getCoords(square.x, square.y);
        this.x = square.x;
        this.y = square.y;
        this.addSprite(coords.x, coords.y);

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
        super.loseResource(rate);
        if (this.exhausted == true){
            this.sprite.frame = 0;
        }
    }
}
export {Mine};
