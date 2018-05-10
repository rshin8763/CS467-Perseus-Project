class Unit{
    constructor(hp, attk, defense, attkSpeed, game){

        this.hp = hp;
        this.attk = attk;
        this.attkSpeed = attkSpeed;
        this.defense = defense;
        this.moving = false;
        this.dest = null;
        this.destx = null;
        this.desty = null;
        this.speed = 1;
        this.sprite = null;
        this.game = game;
        this.movable = true;
        this.target = null;
        this.attacking = false;
        this.cooldown = 0;
        this.range=1;

        
    }

    addSprite(x, y, unitType){    
        this.sprite = this.game.add.sprite(x, y, unitType);
        this.sprite.frame = 26;
        this.sprite.inputEnabled = true;
        this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
        this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);

        this.sprite.events.onInputDown.add(function(pointer){

            // let node = {
            //     x : this.game.getSquare(this.game.input.activePointer.x, this.game.input.activePointer.y).x,
            //     y : this.game.getSquare(this.game.input.activePointer.x, this.game.input.activePointer.y).y,
            //     h : 0,
            //     g : 0,
            //     parent: null
            // };

            // let target = {
            //     x : 20,
            //     y : 5,
            //     h : 0,
            //     g : 0,
            //     parent: null
            // };

            // console.log(this.getNeightbors(node, target));

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
        /*
        this.destx = x - (this.sprite.width/2);
        this.desty = y - (this.sprite.width/2);
        */
        this.dest = this.game.navigator.getSquare(x, y);
        this.nextSquare = this.game.navigator.findNextNode(this, this.dest);
        this.destx = x
        this.desty = y
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
           
            this.attackTick();
          
        }
        if(this.moving)
        {
            let currentSquare = this.game.navigator.getSquare(this.sprite.x + 32, this.sprite.y +32);

            if(currentSquare.y == this.dest.y && currentSquare.x == this.dest.x)
            {
                this.sprite.animations.stop();
                this.moving = false;
            } else if(currentSquare.y == this.nextSquare.y && currentSquare.x == this.nextSquare.x) {
                this.nextSquare = this.game.navigator.findNextNode(this, this.dest);
            }else{

                if(currentSquare.x < this.nextSquare.x)
                {
                        this.sprite.x += this.speed;
                        this.sprite.animations.play('wlk_right');
                    
    
                }
                if(currentSquare.x > this.nextSquare.x)
                {

                    this.sprite.x -= this.speed;
                    this.sprite.animations.play('wlk_left');
                    
                }
                if(currentSquare.y < this.nextSquare.y)
                {

                        this.sprite.y += this.speed;
                    
    
                }
                if(currentSquare.y > this.nextSquare.y)
                {

                        this.sprite.y -= this.speed;
                    
    
                }

            }            
        }
    }

}

export {Unit};

