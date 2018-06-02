import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {AI} from './ai.js';
import {Player} from './player.js';

class Barracks extends Building{


    constructor(faction, x,y,Perseus){
        super(faction, 1000, x, y, Perseus);

        this.addSprite(x,y,'barracks');
        this.SWORD = 1;
        this.PIKE = 2;
        this.ARCH = 3;
        this.buildSpeed = .25;
        this.type="Barracks";
        this.faction = faction;
    }

    buildSoldier()
    {
        if(!this.building)
        {
            this.building = true;
            this.current = this.SWORD;
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
                this.spawnUnit(this.x + this.sprite.width, this.y + this.sprite.height ,this.current);
                this.spawnUnit(this.x + this.sprite.width + 64, this.y + this.sprite.height + 64 , this.ARCH);
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

        if(unitType == this.ARCH){
            this.game.objects.push(new Archer(this.faction, x, y, this.Perseus));     

        }
    }

}  

export {Barracks}
