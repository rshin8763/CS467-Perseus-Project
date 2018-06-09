import {Unit} from './unit.js';
import {Fireball} from './fireball.js';

/**********************
 * Wizard Unit
 * 
 **********************/

class Wizard extends Unit {
    constructor(faction, x, y, Perseus){
        //Call Unit constructro
        super(x,y, faction, 'wizard', 100, 20, 10, 1, Perseus);
        this.name = 'Wizard';
        this.woodCost = 0;
        this.goldCost = 700;
        this.maxHP = 100;
        this.range = 5;
        this.fireball = false;
        this.fireballSprite = null;
        this.priority = 2;

        //Create Sprite
        if (Math.random() >= 0.5){
            this.type="Wizard";
            this.addSprite('wizard_male');
        } else {
            this.type="Wizard";
            this.addSprite('wizard_female'); 
        }

        this.uiData = {
            commandList: {M : "Move", A : "Attack" },
            buildList: {}
        };

        this.sprite.animations.add('atk_right', [39, 40, 41, 42, 43, 44, 45], 10, true);
        this.sprite.animations.add('atk_left', [13, 14, 15, 16, 17, 18, 19], 10, true);

    }


    attackTick()
    {
        //Move to within range of target
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y)  > (this.sprite.width / 2) * this.range )
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y)
        } else{
            //Start attacking
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.x < this.target.x)
                {
                    this.sprite.animations.play('atk_right', null, false, false);
                }else{
                    this.sprite.animations.play('atk_left', null, false, false);

                }

                //If unit is still alive, shoot a fireball at it
                if(this.target.hp > 1)
                {
                    this.cooldown = 200 / this.attkSpeed;
                    new Fireball(this.sprite.x, this.sprite.y + 32, this, this.target, this.Perseus, 60);
                }else {
                    //Otherwise, stop attacking
                    this.stopAttack();
                }



            }
        }
    }

}
export {Wizard};
