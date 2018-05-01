import {Unit} from './unit.js'
import {Fort} from './fort.js'

class Worker extends Unit{
    constructor(x,y,game){
        super(70, 17, 5, 3, game)
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