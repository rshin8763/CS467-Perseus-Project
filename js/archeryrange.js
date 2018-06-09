import {Building} from './building.js';
import {Archer} from './archer.js';

/****************
 * Archery Range Building
 *
 **************/
class ArcheryRange extends Building{


    constructor(faction, x,y,Perseus){
        //Call Building constructor
        super(faction, 1000, x, y, Perseus);

        //Create Sprite
        this.addSprite('archeryrange');


        
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

    //Control API function
    build(str){
        switch(str){
            case 'A':
                return this.buildArcher();
        }
    }
    buildArcher()
    {
        //Start building an archer, or tell the palyer there aren't enough resources
        if(!this.building)
        {
            if(this.Perseus.Player.playerWood >= this.ArcherCosts.wood
                    && this.Perseus.Player.playerGold >= this.ArcherCosts.gold)
            {
                this.building = true;
                this.current = 'Archer';
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.ArcherCosts.wood, this.ArcherCosts.gold);
            } else {
                if(this.faction == 'human')
                    this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.ArcherCosts.wood, this.ArcherCosts.gold), 100, '#ff0000');   
            }
                
        }
    }

    update(){
        //Update build progess until 100, then call spawn archer
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
        //Create an archer
        let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
            new Archer(this.faction, coords.x, coords.y , this.Perseus);     

    }

}  

export {ArcheryRange}
