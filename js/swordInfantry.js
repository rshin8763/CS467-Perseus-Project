import {Unit} from './unit.js';

class SwordInfantry extends Unit {
    constructor(x, y, scene){
        super(100, 30, 15, 3, scene);
        if (Math.random() >= 0.5){
            this.type="Swordsman";
            this.addSprite(x,y,'swordsman');
            this.sprite.animations.add('wlk_right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
            this.sprite.animations.add('wlk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
            this.sprite.animations.add('atk_right', [18, 19, 20, 21, 22, 23], 10, true);
            this.sprite.animations.add('atk_left', [24, 25, 26, 27, 28, 29], 10, true);

        } else {
            this.type="Swordswoman";
            this.addSprite(x,y,'swordswoman');
            this.sprite.animations.add('wlk_right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
            this.sprite.animations.add('wlk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
            this.sprite.animations.add('atk_right', [18, 19, 20, 21, 22, 23], 10, true);
            this.sprite.animations.add('atk_left', [24, 25, 26, 27, 28, 29], 10, true);
        }

    }

}
export {SwordInfantry};