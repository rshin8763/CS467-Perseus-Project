import {GameObject} from './gameObject.js'
class Resource  extends GameObject{
    constructor(x, y, Perseus){
        super(false, faction, Perseus);
        this.sprite = null;
        this.resource = null;
        this.resourceAmount = 100;
        this.exhausted = false;
        let square = this.Perseus.navigator.getSquare(x,y);
        this.x = square.x;
        this.y = square.y;
    }

    takeDamage(rate){
        resourceAmount -= rate;
        if (resouceAmount <= 0) {
            this.exhausted = true;
        }
    }
}
export {Resource };
