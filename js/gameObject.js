class GameObject {
    constructor(movable, Perseus){
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.movable = movable;
        this.circle = null;
        this.uiData = null;
    }
    drawSelectionCircle(){
        this.circle = this.game.add.graphics();
        console.log('drawing circle');
        this.circle.lineStyle(1, 0xFFFFFF, 1);
        this.circle.drawCircle(this.sprite.x,this.sprite.y, this.sprite.height);
        this.Perseus.controller.selectionCircles.push(this.circle);
    }
}
export {GameObject}
