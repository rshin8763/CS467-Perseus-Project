class Tree{
    constructor(x, y, Perseus){
        this.sprite = null;
        this.game = Perseus.game;
        this.resourceAmount = 1000;
        this.exhausted = false;
        this.addSprite(x,y);
    }

    addSprite(x, y){    
        console.log(this.game);
        this.game.add.sprite(x, y, 'tree');
    }
}
export {Tree};
