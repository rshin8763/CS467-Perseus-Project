import {Unit} from './unit.js';

class Pikeman extends Unit {
    constructor(faction, x, y, Perseus){
        super(x,y,faction, 100, 40, 15, 3, Perseus);
        this.woodCost = 100;
        this.goldCost = 400;
        this.maxHP = 100;
        if (Math.random() >= 0.5){
            this.type="Pikeman";
            this.addSprite('pikeman_male');


        } else {
            this.type="Pikeman";
            this.addSprite('pikeman_female'); 
        }

        this.uiData = {
            canBuild: false,
            commandList:[{"M" : "Move"}, {"A" : "Attack"}],
            buildList:[]
        };
        

        this.sprite.animations.add('atk_left', [65, 66, 67, 68, 69, 70], 10, true);
        this.sprite.animations.add('atk_right', [91, 92, 93, 94, 95, 96], 10, true);

    }

    attackTick()
    {
        //if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width / 2) * this.range )
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
                if(this.x < this.target.x )
                {
                    this.sprite.animations.play('atk_right', true);
                }else{
                    this.sprite.animations.play('atk_left',true);

                }

                if(this.target.hp > 1)
                {
                    this.cooldown = 200 / this.attkSpeed;
                    this.target.takeDamage(this.attk, this);
                }else {
                    this.stopAttack();
                }

            }
        }
    }

}
export {Pikeman};
