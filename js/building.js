class Building{
    constructor(faction, hp, x, y, Perseus){
        this.faction = faction;

        this.hp = hp;
        this.x = x;
        this.y = y;
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.building = false;
        this.current = null;
        this.units = {};
        this.movable = false;
        this.circle = null;
    }

    addSprite(x, y, buildingType){        
        this.sprite = this.game.add.sprite(x, y, buildingType);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.boxSelect = false;
            this.Perseus.controller.select(this);
        }, this);
    }

    update(){

    }

    drawSelectionCircle(){
        this.circle = this.game.add.graphics();
        console.log('drawing circle');
        this.circle.lineStyle(2, 0xFFFFFF, 1);
        this.circle.drawCircle(this.x,this.y, 128);
    }

    unDrawSelectionCircle(){
        this.circle.destroy();
    }
    
}

export {Building};
