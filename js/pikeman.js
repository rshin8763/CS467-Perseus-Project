import {Unit} from './unit.js';


/******************
 * Pike Unit
 * 
 *****************/
class Pikeman extends Unit {
    constructor(faction, x, y, Perseus){
        //Call Unit constructor
        super(x,y,faction,'pikeman', 120, 40, 15, 3, Perseus);


        this.woodCost = 100;
        this.goldCost = 600;
        this.maxHP = 100;
        
        
        //Create Sprite
        if (Math.random() >= 0.5){
            this.type="Pikeman";
            this.addSprite('pikeman_male');
        } else {
            this.type="Pikeman";
            this.addSprite('pikeman_female'); 
        }

        this.uiData = {
            commandList: {M: "Move", A: "Attack"},
            buildList:{}
        };
        

        this.sprite.animations.add('atk_left', [65, 66, 67, 68, 69, 70], 10, true);
        this.sprite.animations.add('atk_right', [91, 92, 93, 94, 95, 96], 10, true);
        this.priority = 2;

    }



    /*****************************************************************
     * attackTick() is called each update if the unit is attacking
     * 
     ****************************************************************/
    attackTick()
    {
        //Move to the target
        if(this.x != this.attackSquare.x || this.y != this.attackSquare.y)
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y);
        } else{
            //Start attacking
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

                //if the target is still alive, damage it, and reset attack cooldown.
                if(this.target.hp > 1)
                {
                    this.cooldown = 200 / this.attkSpeed;
                    this.target.takeDamage(this.attk, this);
                }else {
                    //Otherwise stop attacking
                    this.stopAttack();
                }

            }
        }
    }

}
export {Pikeman};
