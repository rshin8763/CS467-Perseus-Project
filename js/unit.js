class Unit{
    constructor(hp, attk, arm, scene){

        this.hp = hp;
        this.attk = attk;
        this.arm = arm;
        this.moving = false;
        this.destx = null;
        this.desty = null;
        this.speed = 1;
        this.sprite = null;
        this.scene = scene;
        this.movable = true;

        
    }

    sayHi(){
    console.log("I'm a unit!");
    }

    addSprite(x, y, unitType){        
        this.sprite = this.scene.add.sprite(x, y, unitType);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(){
            this.scene.selected = this;
        }, this);

    }

    move(x, y){
        this.destx = x;
        this.desty = y;
        this.moving = true;
    }

    update(){
        //Process movement if unit is moving
        if(this.moving)
        {
            if(this.sprite.x < this.destx)
            {
                this.sprite.x += this.speed;
                this.sprite.animations.play('right');
            }
            if(this.sprite.x > this.destx)
            {
                this.sprite.x -= this.speed;
                this.sprite.animations.play('left');
            }
            if(this.sprite.y < this.desty)
            {
                this.sprite.y += this.speed;

            }
            if(this.sprite.y > this.desty)
            {
                this.sprite.y -= this.speed;

            }

            if(this.sprite.y == this.desty && this.sprite.x ==this.destx)
            {
                this.sprite.animations.stop();
                this.moving = false;
            }
        }
    }

}

export {Unit};

