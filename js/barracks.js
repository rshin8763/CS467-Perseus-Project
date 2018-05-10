import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';


class Barracks extends Building{

    constructor(x,y,Perseus){
        super(1000, x, y, Perseus);
        this.addSprite(x,y,'barracks');
        this.SWORD = 1;
        this.PIKE = 2;
        this.ARCH = 3;
        this.buildSpeed = .25;
        this.type="Barracks";
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
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        if(unitType == this.SWORD){
            this.Perseus.objects.push(new SwordInfantry(x, y, this.game));     
        }
    }

}  

export {Barracks}
