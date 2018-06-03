import {Unit} from './unit.js';
import {Arrow} from './arrow.js';
class Archer extends Unit {
    constructor(faction, x, y, Perseus){
        super(x,y, faction, 100, 15, 10, 1, Perseus);
        this.woodCost = 100;
        this.goldCost = 500;
        this.maxHP = 100;
        this.range = 5;
        this.arrow = false;
        this.arrowSprite = null;
        if (Math.random() >= 0.5){
            this.type="Archer";
            this.addSprite('archer_male');


        } else {
            this.type="Archer";
            this.addSprite('archer_female'); 
        }

        this.uiData = {
            canBuild: false,
            commandList:[{"M" : "Move"}, {"A" : "Attack"}],
            buildList:[]
        };

        this.sprite.animations.add('atk_right', [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259], 10, true);
        this.sprite.animations.add('atk_left', [221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233], 10, true);

    }

    attackTick()
    {
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y)  > (this.sprite.width / 2) * this.range )
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y)
        } else{
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
  
                new Arrow(this.sprite.x, this.sprite.y + 32, this, this.target, this.Perseus, 60);
                this.cooldown = 200 / this.attkSpeed;
        
   
                

            }
        }
    }

}
export {Archer};