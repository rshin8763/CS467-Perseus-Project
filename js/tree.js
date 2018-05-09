class Tree{
    constructor(x, y, game){
        this.sprite = null;
        this.game = game;
        this.resourceAmount = 1000;
        this.exhausted = false;
    }

    addSprite(x, y){    
        this.game.add.sprite(x, y, 'tree');
    }
}
export {Tree};
