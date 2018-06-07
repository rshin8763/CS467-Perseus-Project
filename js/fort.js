import {Building} from './building.js';
import {Worker} from './worker.js';
import {Player} from './player.js';
import {AI} from './ai.js';


class Fort extends Building{
    constructor(faction, x,y,Perseus){
        super(faction, 2500, x, y, Perseus);
        this.addSprite('fort');
        this.faction = faction;
        this.type = "Fort";
        this.WORKER = 1;
        this.buildSpeed = 1;
        this.uiData = {
            commandList: {B:"Build"},
            buildList: {W: "Worker"}  
        };
        this.WorkerCosts = {
            wood : 0,
            gold : 400
        }
    }


    buildWorker()
    {
            //TODO:  Move logic inside loop once resources are available
            // if(this.Perseus.resources.wood > this.WorkerCosts.wood
            //     && this.Persesus.resources.gold > this.WorkerCosts.gold)
            //     {
            //     }
        if(!this.building)
        {
            this.building = true;
            this.buildProgress = 0;
        }
    }

    update(){
        if(this.building)
        {
            //console.log(this.buildProgress);
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress = 0;
                let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
                this.spawnWorker(coords.x, coords.y);
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

    spawnWorker(x,y)
    {

        let worker = new Worker(this.faction, x, y, this.Perseus)
        this.Perseus.objects.push(worker);     
        this.Perseus.selected = worker;
        

    }



}

export {Fort}
