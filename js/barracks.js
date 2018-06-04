import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';
import {Pikeman} from './pikeman.js';
import {AI} from './ai.js';
import {Player} from './player.js';


class Barracks extends Building{


    constructor(faction, x,y,Perseus){
        super(faction, 1000, x, y, Perseus);

        this.addSprite('barracks');
        this.SWORD = 1;
        this.PIKE = 2;
        this.buildSpeed = .25;
        this.type="Barracks";
        this.SwordInfantryCosts = {
            wood : 300,
            gold : 700
        };
        this.PikemanCosts = {
            wood : 600,
            gold : 900
        };
        this.faction = faction;

    }

    buildSword()
    {
        if(!this.building)
        {
        //TODO:  Move logic inside loop once resources are available
            // if(this.Perseus.resources.wood > this.SwordInfantry.wood
            //     && this.Persesus.resources.gold > this.SwordInfantry.gold)
            //     {
            //     }
            this.building = true;
            this.current = this.SWORD;
            this.buildProgress = 0;
        }
    }

    buildPike()
    {
        if(!this.building)
        {
        //TODO:  Move logic inside loop once resources are available
            // if(this.Perseus.resources.wood > this.Pikeman.wood
            //     && this.Persesus.resources.gold > this.Pikeman.gold)
            //     {
            //     }
            this.building = true;
            this.current = this.PIKE;
            this.buildProgress = 0;
        }
    }

    update(){
        if(this.building)
        {
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress =0;
                let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
                this.spawnUnit(coords.x, coords.y ,this.current);
                if(this.faction == 'orc') // update orc or player buildings count;
                {
                    this.Perseus.AI.UpdateAIBuildings(1, 'Barracks');
                }
                else
                {
                    this.Perseus.Player.UpdatePlayerBuildings(1, 'Barracks');
                }
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        if(unitType == this.SWORD){
            this.Perseus.objects.push(new SwordInfantry(this.faction, x, y, this.Perseus));     
        }

        if(unitType == this.PIKE){
            this.Perseus.objects.push(new Pikeman(this.faction, x, y, this.Perseus));     

        }
    }

}  

export {Barracks}
