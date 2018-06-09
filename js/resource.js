import {GameObject} from './gameObject.js'
class Resource  extends GameObject{
    constructor(faction, type, Perseus){
        super(false, faction, Perseus);
        this.sprite = null;
        this.type = type;
        this.resourceAmount = 50;
        this.exhausted = false;
    }

    loseResource(rate){
        this.resourceAmount -= rate;

        if (this.resourceAmount <= 0) {
            console.log('resources is now exhasuted');
            this.exhausted = true;
        }
    }
    takeDamage(rate){
        return;
    }
}
export {Resource};
