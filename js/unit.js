class Unit{
    constructor(hp, attk, defense, attkSpeed, game){
        this.hp = hp;
        this.attk = attk;
        this.attkSpeed = attkSpeed;
        this.defense = defense;
        this.moving = false;
        this.destx = null;
        this.desty = null;
        this.speed = 1;
        this.sprite = null;
        this.game = game;
        this.movable = true;
        this.target = null;
        this.attacking = false;
        this.cooldown = 0;
    }

    sayHi(){
    console.log("I'm a unit!");
    }

    addSprite(x, y, unitType){    
        console.log(this);    
        this.sprite = this.game.add.sprite(x, y, unitType);
        this.sprite.frame = 26;
        this.sprite.inputEnabled = true;
        this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
        this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
        this.sprite.animations.add('atk_left', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_right', [169, 170, 171, 172, 173, 174], 10, true);
        this.sprite.animations.add('work_right', [91, 92, 93, 94, 95, 96, 97, 98], 10, true);
        this.sprite.events.onInputDown.add(function(pointer){

            //NOTE(Michael): So for this I had a game.selected variable that held the one unit I was
            //  selecting at the time. In the actual game we're going to want to have selected
            //  be an array so that we can add multiple units.
            if(this.game.selected)
            {
                if(this.game.selected.movable && this.game.input.activePointer.rightButton.isDown)
                {
                    this.game.selected.attack(this);
                }else {
                    this.game.selected = this;
                }
            } else {
                this.game.selected = this;
            }
        }, this);

    }

    move(x, y){
        this.destx = x - (this.sprite.width/2);
        this.desty = y - (this.sprite.width/2);
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
            for(let i = 0; i < this.game.objects.length; i++)
            {
                if(this.game.objects[i] === this )
                {
                    this.game.objects.splice(i, 1);
                }
            }

            this.sprite.destroy();

            return true; //Unit is dead
        }

        return false; //Unit not dead
    }

    checkColision(direction)
    {
        let coord = {}

        if(direction == "up")
        {
            coord.x = this.sprite.x;
            coord.y = this.sprite.y - this.speed;
            
        }
        if(direction == "down")
        {
            coord.x = this.sprite.x;
            coord.y = this.sprite.y + this.speed;
            
        }
        if(direction == "left")
        {
            coord.x =  this.sprite.x - this.speed;
            coord.y = this.sprite.y;
            
        }
        if(direction == "right")
        {
   
            coord.x = this.sprite.x + this.speed;
            coord.y = this.sprite.y;
            
        }

        for(let i = 0; i < this.game.objects.length; i++)
        {
            if(this.game.objects[i].movable == false)
            {
                let obj = this.game.objects[i].sprite;
                if(coord.y + 64 > obj.y && coord.y +16 < obj.y + obj.height)
                {
                    if(coord.x + 48 > obj.x  && coord.x + 16 < obj.x + obj.width)
                    {
                        console.log(coord.y + ", "+ obj.y + " + " + obj.height) 
                        return true;
                    }
                }
            }
        }

        return false;

    }

    update(){
        //Process movement if unit is moving
        if(this.attacking)
        {
            if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width / 2) || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width / 2))
            {
                this.move(this.target.sprite.x, this.target.sprite.y)
            } else{
                this.moving = false;
                if(this.cooldown > 0)
                {
                    this.cooldown--;
                }else{
                    if(this.sprite.x < this.target.sprite.x - (this.sprite.width / 2))
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
                if(!this.checkColision('right'))
                {
                    this.sprite.x += this.speed;
                    this.sprite.animations.play('wlk_right');
                }

            }
            if(this.sprite.x > this.destx)
            {
                if(!this.checkColision('left'))
                {
                this.sprite.x -= this.speed;
                this.sprite.animations.play('wlk_left');
                }
            }
            if(this.sprite.y < this.desty)
            {
                if(!this.checkColision('down'))
                {
                    this.sprite.y += this.speed;
                }

            }
            if(this.sprite.y > this.desty)
            {
                if(!this.checkColision('up'))
                {
                    this.sprite.y -= this.speed;
                }

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

