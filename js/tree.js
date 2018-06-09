import {Resource} from './resource.js'
class Tree extends Resource{
    constructor(x, y, Perseus){
        super('neither', 'wood', Perseus);
        this.sprite = null;

        this.name = 'Tree';
        let square = this.Perseus.navigator.getSquare(x,y);
        let coords = this.Perseus.navigator.getCoords(square.x, square.y);
        this.addSprite(coords.x, coords.y);
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
        this.Perseus.gameSprites.add(this.sprite);
    }

    loseResource(rate){
        super.loseResource(rate);
        //console.log(this.exhausted);
        if (this.exhausted == true){
            this.sprite.destroy();
            for(let i = 0; i < 2; i++)
            {
                for(let j = 0; j < 2; j++){
                    this.Perseus.navigator.markNotOccupied(this.x+i, this.y+j);
                }
            }
        }
    }
}
export {Tree};
