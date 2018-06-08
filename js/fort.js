import {Building} from './building.js';
import {Worker} from './worker.js';
import {Player} from './player.js';
import {AI} from './ai.js';


class Fort extends Building{
    constructor(faction, x,y,Perseus){
        super(faction, 350, x, y, Perseus);
        this.addSprite('fort');
        this.faction = faction;
        this.type = "Fort";
        this.WORKER = 1;
        this.buildSpeed = .25;
        this.uiData = {
            commandList: {B:"Build"},
            buildList: {W: "Worker"}  
        };
        this.WorkerCosts = {
            wood : 50,
            gold : 0
        }
    }

    build(str){
        switch(str){
            case 'W':
                return this.buildWorker();
        }
    }

    buildWorker()
    {
        if(this.Perseus.Player.playerWood >= this.WorkerCosts.wood
                && this.Perseus.Player.playerGold >= this.WorkerCosts.gold)
        {
            if(!this.building)
            {
                this.building = true;
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.WorkerCosts.wood, this.WorkerCosts.gold);
            }
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.WorkerCosts.wood, this.WorkerCosts.gold), 100, '#ff0000');   
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
                    // this.Perseus.AI.UpdateAIBuildings(1, 'Fort');
                }
                else
                {
                    // this.Perseus.Player.UpdatePlayerBuildings(1, 'Fort');
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
