class Controller{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.controlState = 'default';
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.pointer = this.game.input.mousePointer;
        this.keys = {};
        this.keys.A = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.keys.M = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
        this.keys.X = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.selectedObjects = [];
        this.lastPointerState; 
        this.boxStartPos = {};
        this.boxEndPos = {};
        this.wasDown = false;
    }

    takeInput(){
        if(this.Perseus.graphics.selectionBox){
            this.Perseus.graphics.selectionBox.destroy();
        }
        this.Perseus.graphics.selectionBox = this.game.add.graphics();
        this.Perseus.graphics.selectionBox.lineStyle(2, 0xFFFFFF, 1);

        if(this.cursors.up.isDown || (this.game.camera.height - this.pointer.position.y) >= 32 ){
            let temp = this.game.camera.y 
                this.game.camera.y -= 10;
            this.Perseus.ui.bar.y += this.game.camera.y - temp;
        }
        if(this.cursors.down.isDown || (this.game.camera.height - this.pointer.position.y) <= this.game.camera.height-32 ){
            let temp = this.game.camera.y 
                this.game.camera.y += 10;
            this.Perseus.ui.bar.y += this.game.camera.y - temp;
        }
        if(this.cursors.left.isDown || (this.game.camera.width - this.pointer.position.x) >= this.game.camera.width-32 ){
            let temp = this.game.camera.x 
                this.game.camera.x -= 10;
            this.Perseus.ui.bar.x += this.game.camera.x - temp;
        }
        if(this.cursors.right.isDown || (this.game.camera.width - this.pointer.position.x) <= 32 ){
            let temp = this.game.camera.x 
                this.game.camera.x += 10;
            this.Perseus.ui.bar.x += this.game.camera.x - temp;
        }

        if(this.keys.A.isDown){
            if (this.pointer.isDown == false){
                this.controlState = 'attack';
                console.log(this.controlState);
                console.log('input attack command');
            }
        }
        if(this.keys.M.isDown){
            if (this.pointer.isDown == false){
                this.controlState = 'move';
                console.log('input move command');
                console.log(this.controlState);
            }
        }
        // Cancel command ( no right click yet)
        if (this.keys.X.isDown){
            this.controlState = 'default';
            console.log('controller state is default');
        }

        // TODO force BOX selection to end at UI bar
        if (this.wasDown == false) {
            if (this.pointer.isDown == true){
                if (this.controlState == 'default'){
                    console.log('starting selection box');
                    this.boxStartPos = this.pointer.positionDown; 
                    console.log(this.pointer.positionDown);
                } else if (this.controlState == 'attack'){
                    this.selectedObjects.forEach((obj) => {
                        obj.move(this.pointer.positionDown.x, this.pointer.positionDown.y);
                        this.controlState = 'default';
                    }, this);
                } else if (this.controlState == 'move'){
                    this.selectedObjects.forEach((obj) => {
                        console.log('moving');
                        obj.move(this.pointer.positionDown.x, this.pointer.positionDown.y);
                        this.controlState = 'default';
                    }, this);
                }
            }
        } if (this.wasDown == true) {
            if (this.pointer.isDown == false){
                if (this.controlState == 'default'){
                    console.log('finishing selection box');
                    this.boxEndPos = this.pointer.positionUp;
                    console.log(this.boxEndPos);
                    this.Perseus.graphics.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y)+ this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));
                    //Add interesecting objects to selected Objects
                    this.selectedObjects = [];
                    // Select objects
                    this.Perseus.objects.forEach(function(obj){
                        console.log(obj.sprite.x, obj.sprite.y);
                        // Put this logic in function.
                        if(this.boxStartPos.x <= obj.sprite.x  && obj.sprite.x <= this.boxEndPos.x 
                                || this.boxEndPos.x <= obj.sprite.x && obj.sprite.x <= this.boxStartPos.x){
                            if (this.boxStartPos.y <= obj.sprite.y && obj.sprite.y <= this.boxEndPos.y
                                    || this.boxEndPos.y <= obj.sprite.y && obj.sprite.y <= this.boxStartPos.y){
                                console.log("this is inside foreach");
                                this.selectedObjects.push(obj);
                                console.log(this.selectedObjects);
                                this.selectedObjects.forEach((obj)=>{
                                    //TODO implement function to draw white circle around units.
                                    obj.drawSelectionCircle();
                                });
                            }
                        }
                    }, this);
                }
            }
            else if (this.pointer.isDown == true){
                if (this.controlState == 'default'){
                    //draw rectangle
                    this.boxEndPos = this.pointer.position;
                    this.Perseus.graphics.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y) + this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));
                }
            }
        }

        this.wasDown = this.pointer.isDown;

    }
}
export {Controller}
