import {Unit} from './unit.js';

class SwordInfantry extends Unit {
    constructor(x, y, game){
        super(100, 30, 15, 3, game);
        if (Math.random() >= 0.5){
            this.type="Swordsman";
            this.addSprite(x,y,'swordsman');
            // this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
            // this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
            // this.sprite.animations.add('atk_right', [182, 183, 184, 185, 186, 187], 10, true);
            // this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);

        } else {
            this.type="Swordswoman";
            this.addSprite(x,y,'swordswoman'); 
            // this.sprite.animations.add('wlk_right', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
            // this.sprite.animations.add('wlk_left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
            // this.sprite.animations.add('atk_right', [182, 183, 184, 185, 186, 187], 10, true);
            // this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);
        }

    }

}
export {SwordInfantry};