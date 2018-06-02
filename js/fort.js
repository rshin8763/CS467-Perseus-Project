import {Building} from './building.js';
import {Worker} from './worker.js';
import {Player} from './player.js';
import {AI} from './ai.js';


class Fort extends Building{
    constructor(faction, x,y,Perseus){
        super(faction, 2500, x, y, Perseus);
        this.faction = faction;
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
                if(this.faction == 'orc') // UPDATES AI/PLAYER COUNTS BASED ON FACTION
                {
                    this.Perseus.AI.UpdateAIBuildings(1, 'Fort');
                }
                else
                {
                    this.Perseus.Player.UpdatePlayerBuildings(1, 'Fort');
                }
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
