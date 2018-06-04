import {Building} from './building.js';
import {Worker} from './worker.js'


class Fort extends Building{
    constructor(faction, x,y,Perseus){
        super(faction, 2500, x, y, Perseus);

        this.addSprite(x,y, 'fort');
        this.type = "Fort";
        this.WORKER = 1;
        this.buildSpeed = 1;

        this.uiData = {
            commandList: {B:"Build"},
            buildList: {W: "Worker"}  
        };
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

        let worker = new Worker(this.faction, x, y, this.Perseus)
            this.Perseus.objects.push(worker);     
            this.Perseus.selected = worker;
            

    }



}

export {Fort}
