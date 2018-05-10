import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';

class Barracks extends Building{

    constructor(x,y,game){
        super(1000, x, y, game);
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
                this.spawnUnit(this.x + this.sprite.width + 64, this.y + this.sprite.height + 64 , this.ARCH);
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        if(unitType == this.SWORD){
            this.game.objects.push(new SwordInfantry(x, y, this.game));     
        }

        if(unitType == this.ARCH){
            this.game.objects.push(new Archer(x, y, this.game));     
        }
    }

}  

export {Barracks}