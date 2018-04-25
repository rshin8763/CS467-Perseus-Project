import {Unit} from './unit.js';

class SwordInfantry extends Unit {
    constructor(x, y, scene){
        super(100, 10, 15, scene);
        if (Math.random() >= 0.5){
            this.type="Swordsman";
            this.addSprite(x,y,'swordsman_walk');
            this.sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
            this.sprite.animations.add('left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);

        } else {
            this.type="Swordswoman";
            this.addSprite(x,y,'swordswoman_walk');
            this.sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
            this.sprite.animations.add('left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
        }

    }

}
export {SwordInfantry};