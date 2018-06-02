import {Building} from './building.js';


class Farm extends Building{


    constructor(faction, x,y, Perseus){
        super(faction, 750, x, y, Perseus);
        this.woodCost = 500;
        this.goldCost = 800;
        this.addSprite('farm');
        this.type="Farm";

        //TODO: Increase population cap
    }



 

}  

export {Farm}
