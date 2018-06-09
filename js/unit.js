import {GameObject} from './gameObject.js';
//import {AI} from './ai.js';

/**********************
 * Unit Template class
 * 
 ***********************/
class Unit extends GameObject{
    constructor(x,y, faction, type, hp, attk, defense, attkSpeed, Perseus){
        //Call GameObject constuctor
        super(true, faction, Perseus);
        
        this.id = type;
        this.range = 1;
        this.dead=false;
        let unitSquare = this.Perseus.navigator.getSquare(x,y);
        this.x = unitSquare.x;
        this.y = unitSquare.y;
        this.centerX = x;
        this.centerY = y;
        this.hp = hp;
        this.attk = attk;
        this.attkSpeed = attkSpeed;
        this.defense = defense;
        this.moving = false;
        this.dest = {x: this.x, y: this.y};
        this.speed = 1;
        this.sprite = null;
        this.target = null;
        this.attacking = false;
        this.cooldown = 0;
        this.range=1;
        this.priority=0; // commandList priority
        this.hpbar = null; 
        this.nudgeY = 0;
        this.nudgeX = 0;
        this.currentPath = null;
        this.pathStep = 0;
        this.attackMoving = false;
        this.attackMoveDest = null;

        //Add object to object array
        Perseus.objects.push(this);
        Perseus.navigator.units.push(this);
    }

    //Create a sprite to represent the unit
    addSprite(unitType){
        //Choose the correct sprite for faction
        if(this.faction == 'orc')
        {
            unitType += '_orc';
            //update ai unitcount?
        }else {
            unitType +='_human';
        }

        let coords = this.Perseus.navigator.getCoords(this.x, this.y);    
        this.sprite = this.game.add.sprite(coords.x, coords.y, unitType);
        //Move sprite anchor to the middle of the sprite
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.frame = 26;
        this.sprite.inputEnabled = true;

        //Add animations
        this.sprite.animations.add('wlk_up', [104, 105, 106, 107, 108, 109, 110, 111, 112], 10, true);
        this.sprite.animations.add('wlk_down', [130, 131, 132, 133, 134, 135, 136, 137, 138], 10, true);
        this.sprite.animations.add('wlk_right', [143, 144, 145, 146, 147, 148, 149, 150, 151], 10, true);
        this.sprite.animations.add('wlk_left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 10, true);


        //Add HP Bar
        this.hpbar = this.game.add.sprite(coords.x,coords.y, 'hpbar_' + this.faction);
        this.hpbar.anchor.x = 0.5;
        this.hpbar.anchor.y = 6;
        this.sprite.events.onInputDown.add(function(pointer){
            this.Perseus.controller.select(this);
        }, this);

        this.sprite.events.onInputUp.add(function(pointer){
            this.Perseus.controller.endWithSelect(this);
        }, this);


        //Add Sprites to sprite group
        this.Perseus.gameSprites.add(this.sprite);
        this.Perseus.gameSprites.add(this.hpbar);
        // this.Perseus.uiGraphics.add(this.hpbar);

    }



    //Move a unit to the square in which point (x, y) is.
    move(x, y){

        
        //Get nav square of the x,y coordinates
        this.dest = this.Perseus.navigator.getSquare(x, y);

        //If the square is occupied, don't bother trying to move there
        if(this.Perseus.navigator.navmap[this.dest.x][this.dest.y] == 1)
        {
            this.Perseus.prompter.drawToScreen('Cannot move to that location!', 100, '#ff0000')   
            console.log("Can not move to location " + this.dest.x + " , " + this.dest.y);
            this.dest.x = this.x;
            this.dest.y = this.y;
            return;
        }

        //Don't move if youre already standing in the square
        if(this.x == this.dest.x && this.y == this.dest.y)
        {
            return;
        }

        this.currentPath = this.Perseus.navigator.findPath(this, this.dest);

        //If there is no path, dont try to move to square
        if(!this.currentPath)
        {
            this.Perseus.prompter.drawToScreen('Cannot move right now!', 100, '#ff0000')   
            this.moving=false;
            return;
        }

        this.nextSquare = this.currentPath[0];
        this.moving = true;
        this.Perseus.prompter.clearText();
    }


    //Designate an object as this unit's target, and the square to which the unit 
    //  has been assigned as the unit's attackSquare, then set attacking to true. 
    attack(target, square)
    {

        if(this.faction == target.faction)
        {
            return;
        }
        this.target = target;
        this.attackSquare = square;
        this.attacking = true;
    }

    //Move to a point, attacking hostile units along the way
    attackMove(x,y)
    {
        console.log("Attack Moving!");
        let square = this.Perseus.navigator.getSquare(x,y);
        this.attackMoveDest = {x: square.x ,y: square.y};

        this.attackMoving = true;
        this.move(x,y);

    }


    //Take damage from an attacker and handle this unit dying
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
        //console.log(this.hp);
        if(this.hp < 1)
        {
            this.dead=true;
            for(let i = 0; i < this.Perseus.objects.length; i++)
            {
                if(this.Perseus.objects[i] === this )
                {
                    this.Perseus.objects.splice(i, 1);
                }
            }
            
            //this.Perseus.AI.printArrays();
            //this.Perseus.AI.GetAIStats();
            this.sprite.destroy();
            this.hpbar.destroy();
            this.fireball=false;
            this.arrow=false;
            this.attacking = false;
            this.moving = false;
            attacker.stopAttack();
            if (this.faction == 'orc')
            {
                this.Perseus.AI.DeleteUnit(this);
            }
            
        }

        this.hpbar.width = (this.hp / this.maxHP) * 64;

        return false; //Unit not dead
    }


    //DEPRECIATED
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

    //Stop all attacking functions for this unit
    stopAttack()
    {
        this.sprite.animations.stop();
        this.attacking = false;
        this.target = null;
        this.cooldown = 0;

    }

    //Stop all movement for this unit
    stop()
    {
        this.moving = false;
        this.pathStep = 0;
        this.dest.x = this.x;
        this.dest.y = this.y;
        this.nextSquare = null;

        this.sprite.animations.stop();

    }


    //Called every frame by the main update loop of the Phaser Game Object
    update(){

        //Make sure this unit isn't standing on another unit, or heading toward the same square as another unit
        this.Perseus.navigator.checkCollision(this);


        //Handle attack moving
        if(this.attackMoving)
        {
            if(this.y == this.attackMoveDest.y && this.x == this.attackMoveDest.x)
            {
                this.attackMoving = false;
                this.moving = false;
            } else{

                if(!this.attacking)
                {
                    this.Perseus.objects.forEach((obj) =>{
                        //If there is an enemy unit within three squares, attack it
                        if(Math.abs(obj.x - this.x) < 3 && Math.abs(obj.y - this.y) < 3 && obj.faction != this.faction)
                        {
                            //Won't work for buildings. Possible TODO
                            let emptySquare = this.Perseus.navigator.findEmpty(obj.x, obj.y);
                            this.attack(obj, emptySquare);
                            return;
                        }else{
                            if(!this.moving)
                            {
                                let coords = this.Perseus.navigator.getCoords(this.attackMoveDest.x, this.attackMoveDest.y);
                                this.move(coords.x, coords.y);
                            }
                        }
                    })
                }
            }
        }

        //If this unit is attacking, call the unit's attackTick() fucntion (Implemented in the derived class)
        if(this.attacking)
        {
            this.attackTick();

        }

        //Handle movement
        if(this.moving)
        {
            //Calculate the coordinates of the centers of the destination square, and the next square
            let destCoords = this.Perseus.navigator.getCoords(this.dest.x, this.dest.y);
            let nextSquareCoords = this.Perseus.navigator.getCoords(this.nextSquare.x, this.nextSquare.y);


            //Update the current x, or y value of the unit if it has passed into a new row or column
            if(this.sprite.y == nextSquareCoords.y)
            {
                this.y = this.nextSquare.y;
            }
            if(this.sprite.x == nextSquareCoords.x)
            {
                this.x = this.nextSquare.x;
            }

            //If the unit has reached the center of the destination square, stop all movement
            //If the unit has reached the center of the next square in the path, increment the path counter and check
                    // for collisions.
            //Otherweise, move the sprite in the direction of the next square along the path.
            if(this.sprite.y == destCoords.y && this.sprite.x == destCoords.x)
            {
                this.x = this.dest.x;
                this.y = this.dest.y;
                this.stop();

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

            }else{

                if(this.x < this.nextSquare.x)
                {   
                    this.sprite.x += this.speed;
                    this.hpbar.x += this.speed;
                    if(this.circle)this.circle.x += this.speed;
                    this.sprite.animations.play('wlk_right');
                }
                if(this.x > this.nextSquare.x)
                {

                    this.sprite.x -= this.speed;
                    this.hpbar.x -= this.speed;
                    if(this.circle) this.circle.x -= this.speed;
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
                    if(this.circle) this.circle.y += this.speed;
                }
                if(this.y > this.nextSquare.y)
                {

                    if(this.x == this.nextSquare.x)
                    {
                        this.sprite.animations.play('wlk_up');
                    }
                    this.sprite.y -= this.speed;
                    this.hpbar.y -= this.speed;
                    if(this.circle) this.circle.y -= this.speed;
                }
            }            
        }
    }
}

export {Unit};



