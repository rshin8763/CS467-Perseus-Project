import {GameObject} from './gameObject.js'
class Resource  extends GameObject{
    constructor(faction, type, Perseus){
        super(false, faction, Perseus);
        this.sprite = null;
        this.type = type;
        this.resourceAmount = 100;
        this.exhausted = false;
    }

    loseResource(rate){
        this.resourceAmount -= rate;
        console.log("The current resource amount is: " + this.resourceAmount);

        if (this.resourceAmount <= 0) {
            console.log('resources is now exhasuted');
            this.exhausted = true;
        }
    }
}
export {Resource};
