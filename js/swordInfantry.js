import {Unit} from './unit.js';

class SwordInfantry extends Unit {
    constructor(faction, x, y, Perseus){
        super(x,y, faction, 100, 30, 15, 3, Perseus);
        this.woodCost = 0;
        this.goldCost = 500;
        this.maxHP = 100;

        if (Math.random() >= 0.5){
            this.type="Swordsman";
            this.addSprite('swordsman');


        } else {
            this.type="Swordswoman";
            this.addSprite('swordswoman'); 
        }

        this.uiData = {
            commandList: {M: "Move", A: "Attack"},
            buildList:{}
        };

        this.sprite.animations.add('atk_right', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);
        this.priority = 2;

    }

    attackTick()
    {
        //if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width) * this.range )
         if(this.x != this.attackSquare.x || this.y != this.attackSquare.y)
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y);
        } else{
            console.log(this.target);
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.x < this.target.x)
                {
                    this.sprite.animations.play('atk_right', true);
                }else{
                    this.sprite.animations.play('atk_left',true);

                }

                if(this.target.hp > 1)
                {
                    this.cooldown = 200 / this.attkSpeed;
                    this.target.takeDamage(this.attk, this);
                } else {
                    this.stopAttack();
                }
                

            }
        }
    }

}
export {SwordInfantry};
