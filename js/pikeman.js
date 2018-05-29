import {Unit} from './unit.js';

class Pikeman extends Unit {
    constructor(faction, x, y, Perseus){
        super(faction, 100, 40, 15, 3, Perseus);
        if (Math.random() >= 0.5){
            this.type="Pikeman";
            this.addSprite(x,y,'pikeman_male');


        } else {
            this.type="Pikeman";
            this.addSprite(x,y,'pikeman_female'); 
        }

        this.uiData = {
            canBuild: false,
            commandList: {M: "Move", A: "Attack"},
            buildList:{}
        };
        

        this.sprite.animations.add('atk_left', [65, 66, 67, 68, 69, 70], 10, true);
        this.sprite.animations.add('atk_right', [91, 92, 93, 94, 95, 96], 10, true);
        this.priority = 2;

    }

    attackTick()
    {
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width / 2) * this.range )
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
export {Pikeman};
