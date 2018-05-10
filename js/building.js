class Building{
    constructor(hp, x, y, Perseus){
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.building = false;
        this.current = null;
        this.units = {};
        this.movable = false;
    }

    addSprite(x, y, buildingType){        
        this.sprite = this.game.add.sprite(x, y, buildingType);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.game.selected = this;
            this.drawSelectionCircle();
        }, this);
    }

    update(){

    }

    //TODO set anchor points.
    drawSelectionCircle(){
        let circle = this.game.add.graphics();
        this.Perseus.selectionCircles.push(circle);
        console.log('drawing circle');
        circle.lineStyle(2, 0xFFFFFF, 1);
        circle.drawCircle(this.x,this.y, 128);
    }
    unDrawSelectionCircle(){
    }


    
}

export {Building};
