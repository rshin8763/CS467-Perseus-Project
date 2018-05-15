import {GameObject} from './gameObject.js'
class Resource  extends GameObject{
    constructor(x, y, Perseus){
        super(false, Perseus);
        this.sprite = null;
        this.resource = null;
        this.resourceAmount = 1000;
        this.exhausted = false;
        this.x = x;
        this.y = y;
    }

    takeDamage(rate){
        resourceAmount -= rate;
        if (resouceAmount <= 0) {
            this.exhausted = true;
        }
    }
}
export {Resource };
