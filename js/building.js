import {GameObject} from './gameObject.js';

class Building extends GameObject{
    constructor(faction, hp, x, y, Perseus){
        super(false, faction, Perseus);
        this.Perseus = Perseus;
        this.hp = hp;
        this.x = this.Perseus.navigator.getSquare(x,y).x;
        this.y = this.Perseus.navigator.getSquare(x,y).y;
        this.centerX = x + 2;
        this.centerY = y + 2;
        this.building = false;
        this.current = null;
        this.units = {};
        this.Perseus.objects.push(this);
        this.movable = false;
    }

    addSprite(buildingType){       
        let x = this.x;
        let y = this.y;
        let coords = this.Perseus.navigator.getCoords(x,y);
        this.sprite = this.game.add.sprite(coords.x, coords.y, buildingType);
        // this.sprite.anchor.x = 0.5;
        // this.sprite.anchor.y = 0.5;
        this.sprite.inputEnabled = true;

<<<<<<< HEAD
        if (this.faction == 'human'){
            //this.Perseus.Player.AddBuilding(1, buildingType);
        } else {
            //update ai buildingCount?
            this.drawEnemyCircle();
        }

=======
>>>>>>> master
        for(let i = 0; i < 4; i++)
        {
            for(let j = 0; j < 4; j++){
                this.Perseus.navigator.markOccupied(this.x+i, this.y+j);
            }
        }

        
        this.sprite.events.onInputDown.add(function(){
            this.Perseus.controller.select(this);
        }, this);
        this.sprite.events.onInputUp.add(function(){
            this.Perseus.controller.endWithSelect(this);
        }, this);

        this.Perseus.gameSprites.add(this.sprite);

        
    }

    update(){

    }

    takeDamage(damage, attacker)
    {
        this.hp -= damage;
        console.log("The hp is now " + this.hp);
        if(this.hp < 1)
        {
            attacker.stopAttack();

            this.Perseus.AI.DeleteBuilding(this.tag);
            //this.Perseus.AI.printArrays();
            //this.Perseus.AI.GetAIStats();
            this.sprite.destroy();

            for(let i = 0; i < this.Perseus.objects.length; i++)
            {
                if(this.Perseus.objects[i] === this )
                {
                    this.Perseus.objects.splice(i, 1);
                }
            }
        }
    }

    
}
export {Building};
