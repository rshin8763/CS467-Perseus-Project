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
    }

    buildArcher()
    {
        if(!this.building)
        {
      
            this.building = true;
            this.current = 'Archer';
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
                this.spawnArcher();
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnArcher()
    {

        this.Perseus.objects.push(new Archer(this.faction, this.x +3, this.y + 3 , this.Perseus));     
        
    }

}  

export {ArcheryRange}
