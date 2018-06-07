
class GameObject {
    constructor(movable, faction, Perseus){
        this.Perseus = Perseus;
        this.faction = faction;

        if(Perseus.idCounter == null)
        {
            Perseus.idCounter = 0;
        }

        this.tag = Perseus.idCounter;
        Perseus.idCounter++;

        if(faction == 'human'){
            this.Perseus.Player.addObject(this);
        }

        if(faction == 'orc'){
            // this.Perseus.enemy.addObject(this);
        }

        this.game = Perseus.game;
        this.movable = movable;
        this.circle = null;
        this.uiData = {
            commandList:{},
            buildList:{}
        };
    }
    drawSelectionCircle(){
        if (this.faction == 'human'){
            this.circle = this.game.add.graphics();
            this.circle.lineStyle(1, 0x00FF00, 1);
            this.circle.drawCircle(this.sprite.centerX,this.sprite.centerY, this.sprite.height);
            this.Perseus.controller.selectionCircles.push(this.circle);
        }
    }

    drawEnemyCircle(){
        this.circle = this.game.add.graphics();
        this.circle.lineStyle(1, 0xFF0000, 1);
        this.circle.drawCircle(this.sprite.centerX,this.sprite.centerY, this.sprite.height);
    }
}
export {GameObject}
