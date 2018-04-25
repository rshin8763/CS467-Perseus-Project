import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';


class Barracks extends Building{

    constructor(x,y,scene){
        super(1000, x, y, scene);
        this.addSprite(x,y,'barracks');
        this.SWORD = 1;
        this.PIKE = 2;
        this.ARCH = 3;
        this.buildSpeed = .25;
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
                this.spawnUnit(this.x + 64, this.y+64,this.current);
            } else {
                this.buildProgress += this.buildSpeed;
                console.log(this.buildProgress);
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        if(unitType == this.SWORD){
            this.scene.objects.push(new SwordInfantry(x, y, this.scene));     
        }
    }

}  

export {Barracks}