import {GameObject} from './gameObject.js' 
class Building extends GameObject{
    constructor(faction, hp, x, y, Perseus){
        super(false, Perseus);
        this.faction = faction;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.building = false;
        this.current = null;
        this.units = {};
    }

    addSprite(x, y, buildingType){        
        this.sprite = this.game.add.sprite(x, y, buildingType);
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

    update(){

    }
}

export {Building};
