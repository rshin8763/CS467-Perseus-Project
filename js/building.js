class Building{
    constructor(hp, x, y, game){
        console.log(game);
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.game = game;
        this.building = false;
        this.current = null;
        this.units = {};
        this.movable = false;
        
    }

    
    addSprite(x, y, buildingType){        
        this.sprite = this.game.add.sprite(x, y, buildingType);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.game.selected = this;
        }, this);
    }

    update(){

    }


    
}

export {Building};