import {GameObject} from './gameObject.js'
class Unit extends GameObject{
    constructor(faction, hp, attk, defense, attkSpeed, Perseus){
        super(true, Perseus);
        this.faction = faction;
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
        this.target = null;
        this.attacking = false;
        this.cooldown = 0;
        this.range=1;
        this.hpbar = null; 
    }

    addSprite(x, y, unitType){
        if(this.faction == 'orc')
        {
            unitType += '_orc';
        }else {
            unitType +='_human';
        }    
        this.sprite = this.game.add.sprite(x, y, unitType);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.frame = 26;
        this.sprite.inputEnabled = true;
        this.sprite.animations.add('wlk_up', [104, 105, 106, 107, 108, 109, 110, 111, 112], 10, true);
        this.sprite.animations.add('wlk_down', [130, 131, 132, 133, 134, 135, 136, 137, 138], 10, true);
        this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
        this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);

        this.hpbar = this.game.add.sprite(x,y, 'hpbar');
        this.hpbar.anchor.x = .5;
        this.hpbar.anchor.y = 6;
        this.sprite.events.onInputDown.add(function(pointer){
            this.Perseus.controller.select(this);

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
            // if(this.game.selected) {
            //     if(this.game.selected.movable && this.game.input.activePointer.rightButton.isDown) {
            //         this.game.selected.attack(this);
            //     }else {
            //         this.game.selected = this;
            //     }
            // } else {
            //     this.game.selected = this;
            // }
        }, this);

        this.sprite.events.onInputUp.add(function(pointer){
            this.Perseus.controller.endWithSelect(this);
        }, this);

    }

    move(x, y){
        /*
           this.destx = x - (this.sprite.width/2);
           this.desty = y - (this.sprite.width/2);
           */
        console.log("move!");
        this.dest = this.Perseus.navigator.getSquare(x, y);
        this.nextSquare = this.Perseus.navigator.findNextNode(this, this.dest);
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
            for(let i = 0; i < this.Perseus.objects.length; i++)
            {
                if(this.Perseus.objects[i] === this )
                {
                    this.Perseus.objects.splice(i, 1);
                }
            }

            this.sprite.destroy();
            this.hpbar.destroy();
            return true; //Unit is dead
        }

        this.hpbar.width = (this.hp / this.maxHP) * 64;


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

        for(let i = 0; i < this.Perseus.objects.length; i++)
        {
            if(this.Perseus.objects[i].movable == false)
            {
                let obj = this.Perseus.objects[i].sprite;
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

        if(this.attacking)
        {
            this.attackTick();

        }
        if(this.moving)
        {
            let currentSquare = this.Perseus.navigator.getSquare(this.sprite.x + 32, this.sprite.y +32);

            if(currentSquare.y == this.dest.y && currentSquare.x == this.dest.x)
            {
                this.sprite.animations.stop();
                this.moving = false;
            } else if(currentSquare.y == this.nextSquare.y && currentSquare.x == this.nextSquare.x) {
                this.nextSquare = this.Perseus.navigator.findNextNode(this, this.dest);
            }else{

                if(currentSquare.x < this.nextSquare.x)
                {
                    this.sprite.x += this.speed;
                    this.hpbar.x += this.speed;
                    this.sprite.animations.play('wlk_right');


                }
                if(currentSquare.x > this.nextSquare.x)
                {

                    this.sprite.x -= this.speed;
                    this.hpbar.x -= this.speed;

                    this.sprite.animations.play('wlk_left');

                }
                if(currentSquare.y < this.nextSquare.y)
                {
                    if(currentSquare.x == this.nextSquare.x)
                    {
                        this.sprite.animations.play('wlk_down');
                    }
                    this.sprite.y += this.speed;
                    this.hpbar.y += this.speed;



                }
                if(currentSquare.y > this.nextSquare.y)
                {
                    if(currentSquare.x == this.nextSquare.x)
                    {
                        this.sprite.animations.play('wlk_up');
                    }
                    this.sprite.y -= this.speed;
                    this.hpbar.y -= this.speed;



                }

            }            
        }
        // if(this.circle){
        //     this.circle.x = this.sprite.x;
        //     this.circle.y = this.sprite.y;
        // }
    }
}

export {Unit};

