import {GameObject} from './gameObject.js' 
class Building extends GameObject{
    constructor(faction, hp, x, y, Perseus){
        super(false, Perseus);

        this.faction = faction;
        this.hp = hp;
        this.x = this.Perseus.navigator.getSquare(x,y).x;
        this.y = this.Perseus.navigator.getSquare(x,y).y;
        this.building = false;
        this.current = null;
        this.units = {};
    }

    addSprite(buildingType){       
        let x = this.x;
        let y = this.y;
        let coords = this.Perseus.navigator.getCoords(x,y);
        this.sprite = this.game.add.sprite(coords.x, coords.y, buildingType);
        this.sprite.anchor.x = 0.25;
        this.sprite.anchor.y = 0.25;
        this.sprite.inputEnabled = true;


        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++){
                this.Perseus.navigator.markOccupied(this.x+i, this.y+j);
            }
        }
        this.Perseus.navigator.markOccupied(this.x, this.y);
        this.Perseus.navigator.markOccupied(this.x, this.y+1);
        this.Perseus.navigator.markOccupied(this.x+1, this.y);
        this.Perseus.navigator.markOccupied(this.x+1, this.y+1);
        
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.select(this);
        }, this);
        this.sprite.events.onInputUp.add(function(){
            this.Perseus.controller.endWithSelect(this);
        }, this);


    }

    update(){

    }

    takeDamage(damage)
    {
        //TODO: Implement
    }
    
}

export {Building};
