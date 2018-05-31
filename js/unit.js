import {GameObject} from './gameObject.js'
class Unit extends GameObject{
    constructor(x,y, faction, hp, attk, defense, attkSpeed, Perseus){
        super(true, Perseus);
        this.x = x;
        this.y = y;
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
        this.nudgeY = 0;
        this.nudgeX = 0;
        this.currentPath = null;
        this.pathStep = 0;

        Perseus.navigator.units.push(this);

    }

    addSprite(unitType){
        if(this.faction == 'orc')
        {
            unitType += '_orc';
        }else {
            unitType +='_human';
        }
        let coords = this.Perseus.navigator.getCoords(this.x, this.y);    
        this.sprite = this.game.add.sprite(coords.x, coords.y, unitType);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.frame = 26;
        this.sprite.inputEnabled = true;
        this.sprite.animations.add('wlk_up', [104, 105, 106, 107, 108, 109, 110, 111, 112], 10, true);
        this.sprite.animations.add('wlk_down', [130, 131, 132, 133, 134, 135, 136, 137, 138], 10, true);
        this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
        this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);
 
        this.hpbar = this.game.add.sprite(coords.x,coords.y, 'hpbar');
        this.hpbar.anchor.x = .5;
        this.hpbar.anchor.y = 6;
        this.sprite.events.onInputDown.add(function(pointer){
            this.Perseus.controller.select(this);
        }, this);

        this.sprite.events.onInputUp.add(function(pointer){
            this.Perseus.controller.endWithSelect(this);
        }, this);

    }

    move(x, y){
        //this.stop();
        /*
           this.destx = x - (this.sprite.width/2);
           this.desty = y - (this.sprite.width/2);
           */
        console.log("move!");
        this.dest = this.Perseus.navigator.getSquare(x, y);
        this.currentPath = this.Perseus.navigator.findPath(this, this.dest);
        this.nextSquare = this.currentPath[0];
        this.destx = x;
        this.desty = y;
        this.moving = true;
    }


    attack(target, square)
    {
        this.target = target;
        this.attackSquare = square;
        this.attacking = true;
    }

    takeDamage(damage, attacker)
    {
        if(this.moving != true && this.attacking != true)
        {
            let atkSquare;
            
            if(attacker.type === "Archer" || attacker.type === "Wizard")
            {
                atkSquare = this.Perseus.navigator.findEmpty(attacker.x, attacker.y);
            } else {
                atkSquare = {x: this.x, y: this.y};
            }
            this.attack(attacker, atkSquare);
        }
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
            this.attacking = false;
            this.moving = false;
            return true; //Unit is dead
        }

        this.hpbar.width = (this.hp / this.maxHP) * 64;


        return false; //Unit not dead
    }
    
    checkCollision()
    {
        let x = this.sprite.x;
        let y = this.sprite.y;
        let r = this.sprite.width;

        for(let i = 0; i < this.Perseus.objects.length; i++)
        {
            if(this.Perseus.objects[i].isMovable == true)
            {
                let dx = obj.sprite.x - x;
                let dy = obj.sprite.y - y;

                if(((dx * dx) + (dy*dy)) < r*r)
                {
                    return true;
                }

            }
        }

        return false;
        
    }

    stop()
    {
        this.moving = false;
       // this.attacking = false;
        this.currentPath = null;
        this.pathStep = 0;
        this.dest = null;
        this.nextSquare = null;
   
        this.sprite.animations.stop();
        
    }
    

    update(){
        
        this.Perseus.navigator.checkCollision(this);
       
        if(this.attacking)
        {
            this.attackTick();

        }
        if(this.moving)
        {
            
            let destCoords = this.Perseus.navigator.getCoords(this.dest.x, this.dest.y);
            let nextSquareCoords = this.Perseus.navigator.getCoords(this.nextSquare.x, this.nextSquare.y);

            if(this.sprite.y == nextSquareCoords.y)
            {
                this.y = this.nextSquare.y;
            }

            if(this.sprite.x == nextSquareCoords.x)
            {
                this.x = this.nextSquare.x;
            }


            if(this.sprite.y == destCoords.y && this.sprite.x == destCoords.x)
            {

                this.x = this.dest.x;
                this.y = this.dest.y;
                this.stop();
                this.sprite.animations.stop();
                this.moving = false;
            } else if(this.sprite.y == nextSquareCoords.y && this.sprite.x == nextSquareCoords.x) {
                this.pathStep++;
                this.x = this.nextSquare.x;
                this.y = this.nextSquare.y;
                if(this.pathStep > this.currentPath.length -1)
                {
                    this.currentPath = this.Perseus.navigator.findPath(this, this.dest);
                    this.pathStep = 0;
                }
                this.nextSquare = this.currentPath[this.pathStep];
                this.Perseus.navigator.checkCollision(this);
                console.log(this.currentPath);
                console.log("Path Step:" + this.pathStep);
    


            }else{

                if(this.x < this.nextSquare.x)
                {   

                        this.sprite.x += this.speed;
                        this.hpbar.x += this.speed;
                        this.sprite.animations.play('wlk_right');
                }
                if(this.x > this.nextSquare.x)
                {

                        this.sprite.x -= this.speed;
                        this.hpbar.x -= this.speed;
                        this.sprite.animations.play('wlk_left');
                    
                }
                if(this.y < this.nextSquare.y)
                {
                         if(this.x == this.nextSquare.x)
                        {
                            this.sprite.animations.play('wlk_down');
                        }
                        this.sprite.y += this.speed;
                        this.hpbar.y += this.speed;
                    

                }
                if(this.y > this.nextSquare.y)
                {

                    if(this.x == this.nextSquare.x)
                    {
                        this.sprite.animations.play('wlk_up');
                    }
                    this.sprite.y -= this.speed;
                    this.hpbar.y -= this.speed;

                }


           
            }            
        }

    }
}

export {Unit};

