import {Unit} from './unit.js';
import {Fireball} from './fireball.js';
class Wizard extends Unit {
    constructor(faction, x, y, Perseus){
        super(x,y, faction, 100, 15, 10, 1, Perseus);
        this.woodCost = 100;
        this.goldCost = 500;
        this.maxHP = 100;
        this.range = 5;
        this.fireball = false;
        this.fireballSprite = null;
        if (Math.random() >= 0.5){
            this.type="Wizard";
            this.addSprite('wizard_male');


        } else {
            this.type="Wizard";
            this.addSprite('wizard_female'); 
        }

        this.uiData = {
            canBuild: false,
            commandList:[{"M" : "Move"}, {"A" : "Attack"}],
            buildList:[]
        };

        this.sprite.animations.add('atk_right', [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259], 10, true);
        this.sprite.animations.add('atk_left', [13, 14, 15, 16, 17, 18, 19], 10, true);

    }

    attackTick()
    {
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y)  > (this.sprite.width / 2) * this.range )
        {
            this.move(this.target.sprite.x, this.target.sprite.y)
        } else{
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.sprite.x < this.target.sprite.x - (this.sprite.width / 2))
                {
                    this.sprite.animations.play('atk_right', null, false, false);
                }else{
                    this.sprite.animations.play('atk_left', null, false, false);

                }
                if (this.Perseus.objects.includes(this.target))
                {
                    new Fireball(this.sprite.x, this.sprite.y + 32, this, this.target, this.Perseus, 60);
                    this.cooldown = 200 / this.attkSpeed;
                } else {
                    this.attacking = false;
                    this.target = null;
                    this.sprite.animations.stop();
                }

                // if(targetDead)
                // {
                //     this.attacking = false;
                //     this.target = null;
                //     this.sprite.animations.stop();
                // }
            }
        }
    }

}
export {Wizard};