import {Unit} from './unit.js'
import {Fort} from './fort.js'

class Worker extends Unit{
    constructor(x,y,Perseus){
        super(70, 17, 5, 3, Perseus)
        this.type="Worker";
        this.placing = false;
        this.building = false;
        this.buildProgress = 0;
        this.selectedBuilding = null;
        this.selectedSprite = null;
        this.selectedX = null;
        this.selectedY = null
        
        
        if(Math.random() >= 0.5){
            this.addSprite(x,y, 'worker_male');
        } else {
            this.addSprite(x,y, 'worker_female')
        }

        this.sprite.animations.add('work_right', [91, 92, 93, 94, 95, 96, 97, 98], 10, true);

        this.sprite.animations.add('atk_left', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_right', [169, 170, 171, 172, 173, 174], 10, true);
    }


    build(type)
    {
        alert("Build!")
        if(type = "Fort")
        {
            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'fort')
            this.selectedBuilding = "Fort";
            this.placing = true;
        }

    }

    place(x, y){
            console.log("Place called!")
            this.placing = false;
            this.building = true;
            this.selectedSprite.alpha = 0.75;
            this.selectedSprite.x = x;
            this.selectedSprite.y = y;
             //I used wdith/4 after some testing because it got close to the building without getting trapped by it
            this.selectedX = x - this.sprite.width / 4; 
            this.selectedY = y - this.sprite.width / 4;
    
    }

    attackTick()
    {
        if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) * this.range > (this.sprite.width / 2) * this.range )
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

    update(){
        super.update();
        if(this.placing)
        {
            this.selectedSprite.x = this.game.input.x - this.sprite.width;
            this.selectedSprite.y = this.game.input.y - this.sprite.height;
        }

        if(this.building)
        {
            if(Math.abs(this.sprite.x - this.selectedX) > this.sprite.width || Math.abs(this.sprite.y - this.selectedY) > this.sprite.height)
            {

                this.move(this.selectedX, this.selectedY)
            } else {
                console.log(this.buildProgress);

                if(this.buildProgress > 1000)
                {
                    if(this.selectedBuilding == "Fort")
                    {
                        this.game.objects.push(new Fort(this.selectedSprite.x, this.selectedSprite.y, this.game));
                    }
                    this.building = false;
                    this.selectedSprite.destroy();
                    this.selectedX = null;
                    this.selectedY = null;
                    this.buildProgress = 0;
                    this.sprite.animations.stop();

                } else {
                    this.sprite.animations.play('work_right');
                    this.buildProgress += 1;
                }
            }
        }
    }
}

export {Worker};
