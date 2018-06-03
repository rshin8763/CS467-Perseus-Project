import {Unit} from './unit.js'
class Controller{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.state = 'default';
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.pointer = this.game.input.mousePointer;
        this.keys = {};
        this.keys.A = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.keys.G = this.game.input.keyboard.addKey(Phaser.KeyCode.G);
        this.keys.M = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
        this.keys.B = this.game.input.keyboard.addKey(Phaser.KeyCode.B);
        this.keys.F = this.game.input.keyboard.addKey(Phaser.KeyCode.F);
        this.keys.X = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.selectedObjects = [];
        this.lastPointerState; 
        this.boxStartPos = {};
        this.boxEndPos = {};
        this.wasDown = false;
        this.boxSelect = true;
        this.selectionCircles = [];
    }

    select(obj){
        if (this.state == 'default'){
            this.selectionCircles.forEach((elem)=> {elem.destroy();});
            this.selectedObjects = [];
            this.selectedObjects.push(obj);
            obj.drawSelectionCircle();
        } else if (this.state == 'attack'){
            /***********MICHAEL ADDED THIS************** */
                //Get the empty squares around the object to be attacked
                let emptySquares = this.Perseus.navigator.findAllEmpty(obj.x, obj.y);
                let limit;
                //If there are more empty squares then attackers, the number of attackers is limiting. Otherwise, the number of empty squares is. 
                if(this.selectedObjects.length < emptySquares.length)
                {
                    limit = this.selectedObjects.length;
                }else{
                    limit = emptySquares.length;
                }

                //Assign one attacker to each empty square.
                for(let i = 0; i < limit; i++)
                {
                    //Don't move the unit if it's already within attack range
                    if(Math.abs(this.selectedObjects[i].x - obj.x) <= 1 && Math.abs(this.selectedObjects[i].y - obj.y) <= 1 )
                    {
                        this.selectedObjects[i].attack(obj, {x: this.selectedObjects[i].x, y: this.selectedObjects[i].y});
                    }else{
                        this.selectedObjects[i].attack(obj, emptySquares[i]);
                    }
                }
            /********************************************* */
            // this.selectedObjects.forEach( (elem) => {
            //     elem.attack(obj);
            // });
            this.state = 'default';
        } else if (this.state == 'gather'){
            this.selectedObjects.forEach( (elem) => {
                elem.gather(obj);
            });
            this.state = 'default';
        }
    }

    selectInBox(){
        this.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y)+ this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));

        this.selectedObjects = [];
        this.selectionCircles.forEach((circle)=>{
            circle.destroy();
        });
        // Select objects
        this.Perseus.objects.forEach(function(obj){
            if(obj instanceof Unit){
                console.log(obj.sprite.x, obj.sprite.y);
                // Put this logic in function.
                if(this.boxStartPos.x <= obj.sprite.x  && obj.sprite.x <= this.boxEndPos.x 
                        || this.boxEndPos.x <= obj.sprite.x && obj.sprite.x <= this.boxStartPos.x){
                    if (this.boxStartPos.y <= obj.sprite.y && obj.sprite.y <= this.boxEndPos.y
                            || this.boxEndPos.y <= obj.sprite.y && obj.sprite.y <= this.boxStartPos.y){
                        console.log("this is inside foreach");
                        this.selectedObjects.push(obj);
                        console.log(this.selectedObjects);
                        obj.drawSelectionCircle();
                    }
                }
            }
        }, this);
    }

    cameraPan(){
        if(this.cursors.up.isDown || this.game.camera.height - this.pointer.position.y >= this.game.camera.height-32){
            let temp = this.game.camera.y; 
            this.game.camera.y -= 10;
        }
        if(this.cursors.down.isDown || this.game.camera.height - this.pointer.position.y <= 32){
            let temp = this.game.camera.y;
            this.game.camera.y += 10;
        }
        if(this.cursors.left.isDown || (this.game.camera.width - this.pointer.position.x) >= this.game.camera.width-32 ){
            let temp = this.game.camera.x; 
            this.game.camera.x -= 10;
        }
        if(this.cursors.right.isDown || (this.game.camera.width - this.pointer.position.x) <= 32 ){
            let temp = this.game.camera.x; 
            this.game.camera.x += 10;
        }
    }

    update(){
        if(this.selectionBox){
            this.selectionBox.destroy();
        }

        this.selectionBox = this.game.add.graphics();
        this.selectionBox.lineStyle(2, 0xFFFFFF, 1);

        this.cameraPan();

        if(this.state != 'pointerHold'){

            if(this.keys.A.isDown){
                console.log('input attack command');
                this.state = 'attack';
            }
        }
        if(this.keys.M.isDown){
            this.state = 'move';
            console.log('input move command');
        }

        if(this.keys.G.isDown){
            this.state = 'gather';
            console.log('click on a resource');
        }

        if(this.keys.B.isDown){
            this.selectedObjects[0].buildWorker();
        }
        // Cancel command ( no right click yet)
        if (this.keys.X.isDown){
            this.state = 'default';
            console.log('controller state is default');
        }

        if (this.state == 'default'){
            if (this.pointer.isDown == true){
                console.log('starting selection box');
                this.boxStartPos = this.pointer.positionDown; 
                console.log(this.pointer.positionDown);
            }
        }
        if (this.state == 'move'){
            if (this.pointer.isDown == true){
                this.selectedObjects.forEach((obj) => {
                    console.log('moving');
                    obj.move(this.pointer.positionDown.x + this.Perseus.game.camera.view.x, this.pointer.positionDown.y + this.Perseus.game.camera.view.y);
                    this.state = 'default';
                }, this);
            }
        } 
        if (this.state == 'attack'){
            //wait for click event
        } 
        if (this.state == 'pointerHold') {
            if (this.pointer.isDown == false){
                console.log('finishing selection box');
                this.boxEndPos = this.pointer.positionUp;
                console.log(this.boxEndPos);
                this.selectInBox();
                this.state = 'default';
            } else {
                //draw rectangle
                this.boxEndPos = this.pointer.position;
                this.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y) + this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));
            }
        }
        if (this.state == 'default' && this.pointer.isDown){
            if(this.selectedObjects.length > 0 && this.selectedObjects[0].placing)
            {
                this.selectedObjects[0].place();
            }else{
            this.state = 'pointerHold';
            }
        }
    }

    endWithSelect(obj){
        this.update();
        this.selectedObjects.push(obj);
        obj.drawSelectionCircle();
    }

}
export {Controller}
