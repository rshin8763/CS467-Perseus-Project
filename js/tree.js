class Tree{
    constructor(x, y, Perseus){
        this.sprite = null;
        this.game = Perseus.game;
        this.resourceAmount = 1000;
        this.exhausted = false;
        this.addSprite(x,y);
        this.circle = null;
    }

    addSprite(x, y){    
        console.log(this.game);
        this.game.add.sprite(x, y, 'tree');
    }

    drawSelectionCircle(){
        this.circle = this.game.add.graphics();
        console.log('drawing circle');
        this.circle.lineStyle(2, 0xFFFFFF, 1);
        this.circle.drawCircle(this.x,this.y, 64);
    }

    unDrawSelectionCircle(){
        this.circle.destroy();
    }
}
export {Tree};
