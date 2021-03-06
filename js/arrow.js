class Arrow{
    constructor(x,y, parent, target, Perseus, animWait){
        //Assign the correct sprite depending on which way the arrow will be flying
        if (target.sprite.x > x)
        {
            this.sprite = Perseus.game.add.sprite(x + 32, y, 'arrow_right');
        } else {
            this.sprite = Perseus.game.add.sprite(x, y, 'arrow_left');
        }

        //Initialize some valies
        this.parent = parent;
        this.target = target;
        this.Perseus = Perseus;
        this.Perseus.objects.push(this);
        this.active = true;
        this.sprite.visible = false;

        //The time to wait before moving the arrow (for attack animation)
        this.animWait = animWait;
 


    }

    update()
    {
        if(this.target.hp < 1 || this.parent.dead == true) //If the target is dead, or the parent is dead (ie sprite has been removed)
        {
            for(let i = 0; i < this.Perseus.objects.length; i++)
            {
                if(this.Perseus.objects[i] === this )
                {
                    this.Perseus.objects.splice(i, 1);
                }
            }
            this.sprite.destroy();
        }
        //While this arrow is active
        if(this.active)
        {
            //If the wait time has expired
            if(this.animWait < 1)
            {    
                //Sprite should be visible
                this.sprite.visible = true;

                //Move the arrow closer to the target by 1/60th
                if (this.sprite.x < this.target.sprite.x)
                {
                    this.sprite.x += Math.abs(this.target.sprite.x - this.sprite.x) / 60 + 1; //+1 to prevent a Xeno's Paradox thing I had going on
                }

                if (this.sprite.x > this.target.sprite.x)
                {
                    this.sprite.x -= Math.abs(this.target.sprite.x - this.sprite.x) / 60 + 1;
                }

                if (this.sprite.y < this.target.sprite.y)
                {
                    this.sprite.y += Math.abs(this.target.sprite.y - this.sprite.y) / 60 + 1;
                }

                if (this.sprite.y > this.target.sprite.y)
                {
                    this.sprite.y -= Math.abs(this.target.sprite.y - this.sprite.y) / 60 + 1;
                }

                //If the arrow is clsoe to the target...
                if(Math.abs(this.sprite.x - this.target.sprite.x) < (this.target.sprite.width/2))
                {
                    if(Math.abs(this.sprite.y - this.target.sprite.y) < (this.target.sprite.height/2))  
                    {
                        //Set active to false, destroy the sprite, and cause damage to the target
                        this.active = false;
                        this.sprite.destroy();
                        this.target.takeDamage(35, this.parent);           
                    }
                }
            }else {
                this.animWait--;
            }
        }
    }
}

export {Arrow};