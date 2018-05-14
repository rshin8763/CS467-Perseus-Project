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
        this.sprite = this.game.add.sprite(x, y, 'tree');
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
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
