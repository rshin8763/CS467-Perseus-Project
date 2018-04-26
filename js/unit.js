class Unit{
    constructor(hp, attk, defense, attkSpeed, scene){

        this.hp = hp;
        this.attk = attk;
        this.attkSpeed = attkSpeed;
        this.defense = defense;
        this.moving = false;
        this.destx = null;
        this.desty = null;
        this.speed = 1;
        this.sprite = null;
        this.scene = scene;
        this.movable = true;
        this.target = null;
        this.attacking = false;
        this.cooldown = 0;

        
    }

    sayHi(){
    console.log("I'm a unit!");
    }

    addSprite(x, y, unitType){        
        this.sprite = this.scene.add.sprite(x, y, unitType);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(function(pointer){
            if(this.scene.selected.movable && this.scene.input.activePointer.rightButton.isDown)
            {
                this.scene.selected.attack(this);
            }else {
            this.scene.selected = this;
            }
        }, this);

    }

    move(x, y){
        this.destx = x;
        this.desty = y;
        this.moving = true;
    }

    attack(target)
    {
        this.target = target;
        this.attacking = true;
    }

    takeDamage(damage)
    {
        this.hp -= (damage - this.defense);
        console.log(this.hp);
        if(this.hp < 1)
        {
            for(let i = 0; i < this.scene.objects.length; i++)
            {
                if(this.scene.objects[i] === this )
                {
                    this.scene.objects.splice(i, 1);
                }
            }

            this.sprite.destroy();

            return true;
        }

        return false;
    }

    update(){
        //Process movement if unit is moving
        if(this.attacking)
        {
           
            
            if(Math.abs(this.sprite.x - this.target.sprite.x) > 32 || Math.abs(this.sprite.y - this.target.sprite.y) > 32)
            {
                this.move(this.target.sprite.x, this.target.sprite.y)
            } else{
                this.moving = false;
                if(this.cooldown > 0)
                {
                    this.cooldown--;
                }else{
                    if(this.sprite.x < this.target.sprite.x - 32)
                    {
                        this.sprite.animations.play('atk_right', true);
                    }else{
                        this.sprite.animations.play('atk_left',true);

                    }


                    let targetDead = this.target.takeDamage(this.attk);
                    console.log(targetDead);
                    console.log(this);
                    this.cooldown = 200 / this.attkSpeed;
                    
                    if(targetDead)
                    {
                        this.attacking = false;
                        this.target = null;
                        this.sprite.animations.stop();
                    }
                }
            }
        }
        if(this.moving)
        {
            if(this.sprite.x < this.destx)
            {
                this.sprite.x += this.speed;
                this.sprite.animations.play('wlk_right');
            }
            if(this.sprite.x > this.destx)
            {
                this.sprite.x -= this.speed;
                this.sprite.animations.play('wlk_left');
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

