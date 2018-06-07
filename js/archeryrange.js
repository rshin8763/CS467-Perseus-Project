import {Building} from './building.js';
import {Archer} from './archer.js';


class ArcheryRange extends Building{


    constructor(faction, x,y,Perseus){
        super(faction, 1000, x, y, Perseus);

        this.addSprite('archeryrange');
        this.SWORD = 1;
        this.PIKE = 2;
        this.ARCH = 3;
        this.buildSpeed = .25;
        this.type="Archery Range";

        this.uiData = {
            commandList: {B:"Build"},
            buildList: {A: "Wizard"}  
        };
        this.ArcherCosts = {
            wood : 150,
            gold : 50
        }
    }

    build(str){
        switch(str){
            case 'A':
                return this.buildArcher();
        }
    }
    

    buildArcher()
    {
        if(!this.building)
        {
            if(this.Perseus.Player.playerWood >= this.ArcherCosts.wood
                    && this.Perseus.Player.playerGold >= this.ArcherCosts.gold)
            {
                this.building = true;
                this.current = 'Archer';
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.ArcherCosts.wood, this.ArcherCosts.gold);
            }
        }
    }

    update(){
        if(this.building)
        {
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress =0;
                this.spawnArcher();

            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnArcher()
    {
        let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
            this.Perseus.objects.push(new Archer(this.faction, coords.x, coords.y , this.Perseus));     

    }

}  

export {ArcheryRange}
