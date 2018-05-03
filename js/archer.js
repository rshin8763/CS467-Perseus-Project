import {Unit} from './unit.js';

class Archer extends Unit {
    constructor(x, y, game){
        super(100, 15, 5, 1, game);
        this.range = 5;
        this.arrow = false;
        this.arrowSprite = null;

        if (Math.random() >= 0.5){
            this.type="Archer";
            this.addSprite(x,y,'archer_male');


        } else {
            this.type="Archer";
            this.addSprite(x,y,'archer_female'); 
        }

        this.sprite.animations.add('atk_right', [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259], 10, true);
        this.sprite.animations.add('atk_left', [221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233], 10, true);

    }

    attackTick()
    {
        if(this.arrow)
        {
            if (this.arrowSprite.x < this.target.sprite.x)
            {
                this.arrowSprite.x += Math.abs(this.target.sprite.x - this.sprite.x) / 60;
            }

            if (this.arrowSprite.x > this.target.sprite.x)
            {
                this.arrowSprite.x -= Math.abs(this.target.sprite.x - this.sprite.x) / 60;
            }

            if (this.arrowSprite.y < this.target.sprite.y)
            {
                this.arrowSprite.y += Math.abs(this.target.sprite.y - this.sprite.y) / 60;
            }

            if (this.arrowSprite.y < this.target.sprite.y)
            {
                this.arrowSprite.y += Math.abs(this.target.sprite.y - this.sprite.y) / 60;
            }

            if(Math.abs(this.arrowSprite.x - this.target.sprite.x) < 10)
            {
                if(Math.abs(this.arrowSprite.y - this.target.sprite.y) < 10)
                {
                    this.arrow = false;
                    this.arrowSprite.destroy();
                    this.arrowSprite = null;
                }
            }
        }
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) * this.range > (this.sprite.width / 2) * this.range )
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

                this.arrowSprite = this.game.add.sprite(this.sprite.x, this.sprite.y + (this.sprite.width /2), 'arrow');
                this.arrow = true;

                let targetDead = this.target.takeDamage(this.attk);

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
export {Archer};