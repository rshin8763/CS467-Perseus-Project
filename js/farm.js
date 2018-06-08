import {Building} from './building.js';


class Farm extends Building{

    constructor(faction, x,y, Perseus){
        super(faction, 750, x, y, Perseus);
        this.woodCost = 50;
        this.goldCost = 80;
        this.addSprite('farm');
        this.type="Farm";

        //TODO: Increase population cap
    }

}  

export {Farm}
