import {Building} from './building.js';
import {Worker} from './worker.js'


class Fort extends Building{
    constructor(x,y,game){
        super(2500, x, y, game);
        this.addSprite(x,y, 'fort');
        this.type = "Fort";
        this.WORKER = 1;
        this.buildSpeed = 1;
    }


    buildWorker()
    {
        if(!this.building)
        {
            this.building = true;
            this.buildProgress = 0;
        }
    }

    update(){
        if(this.building)
        {
            console.log(this.buildProgress);
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress = 0;


                this.spawnUnit(this.x + 129, this.y+ 64,this.current);
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        console.log(this.game);

            this.game.objects.push(new Worker(x, y, this.game));     
        
    }



}

export {Fort}