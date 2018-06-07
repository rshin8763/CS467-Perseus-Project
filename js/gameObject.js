class GameObject {
    constructor(movable, Perseus){
        this.Perseus = Perseus;
        if(Perseus.idCounter == null)
        {
            Perseus.idCounter = 0;
        }

        this.tag = Perseus.idCounter;
        Perseus.idCounter++;

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
