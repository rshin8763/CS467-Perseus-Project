class Building{
    constructor(hp, x, y,scene){
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.building = false;
        this.current = null;
        this.units = {};
        this.movable = false;
    }

    
    addSprite(x, y, buildingType){        
        this.sprite = this.scene.add.sprite(x, y, buildingType);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.scene.selected = this;
        }, this);
    }

    update(){

    }


    
}

export {Building};