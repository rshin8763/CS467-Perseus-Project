import {Unit} from './unit.js';

class SwordInfantry extends Unit {
    constructor(faction, x, y, Perseus){
        super(faction, 100, 30, 15, 3, Perseus);
        this.maxHP = 100;
        if (Math.random() >= 0.5){
            this.type="Swordsman";
            this.addSprite(x,y,'swordsman');


        } else {
            this.type="Swordswoman";
            this.addSprite(x,y,'swordswoman'); 
        }

        this.uiData = {
            canBuild: false,
            commandList:[{"M" : "Move"}, {"A" : "Attack"}],
            buildList:[]
        };

        this.sprite.animations.add('atk_right', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);

    }

    attackTick()
    {
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width) * this.range )
        {
            this.move(this.target.sprite.x, this.target.sprite.y)
        } else{
            console.log(this.target);
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.sprite.x < this.target.sprite.x - (this.sprite.width / 2))
                {
                    this.sprite.animations.play('atk_right', true);
                }else{
                    this.sprite.animations.play('atk_left',true);

                }


                let targetDead = this.target.takeDamage(this.attk);
                console.log(targetDead);
                console.log(this);
                this.cooldown = 200 / this.attkSpeed;
                
                if(targetDead)
                {
                    this.attacking = false;
                    this.target = null;
                    this.sprite.animations.stop();
                }
            }
        }
    }

}
export {SwordInfantry};
