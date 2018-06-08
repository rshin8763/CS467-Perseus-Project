import {Unit} from './unit.js'
import {Worker} from './worker.js'
class Controller{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.game = Perseus.game;
        this.state = 'default';
        this.commandState = 'default';

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.pointer = this.game.input.mousePointer;
        this.keys = {};
        this.keys.A = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
        this.keys.G = this.game.input.keyboard.addKey(Phaser.KeyCode.G);
        this.keys.M = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
        this.keys.B = this.game.input.keyboard.addKey(Phaser.KeyCode.B);
        this.keys.F = this.game.input.keyboard.addKey(Phaser.KeyCode.F);
        this.keys.X = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.keys.W = this.game.input.keyboard.addKey(Phaser.KeyCode.W);
        this.keys.S = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        this.keys.P = this.game.input.keyboard.addKey(Phaser.KeyCode.P);
        this.keys.R = this.game.input.keyboard.addKey(Phaser.KeyCode.R);
        this.selectedObjects = [];
        this.highestPrioritySelected = null;
        this.lastPointerState; 
        this.boxStartPos = {};
        this.boxEndPos = {};
        this.wasDown = false;
        this.boxSelect = true;
        this.updateProgress = 0;
        this.cooldownTimer = 0;
    }
    isPointerInUi() {
        console.log(this.pointer.position <= 198);
        return (this.pointer.position.x  <= 198);
    }

    select(obj){
        if (this.state == 'default'){
            this.selectedObjects.forEach((elem)=>{elem.undrawCircle();});
            this.selectedObjects = [];
            if(obj.faction == 'human'){
                this.selectedObjects.push(obj);
                this.highestPrioritySelected = obj;
                obj.drawSelectionCircle();
                this.Perseus.ui.updateCommandList(obj);
                this.Perseus.ui.infoBar.fillInfoBar(obj);
            }
        } else if (this.state == 'attack'){
            this.Perseus.prompter.clearText();
            let emptySquares = [];
            let origin = {x:this.selectedObjects[0].x, y: this.selectedObjects[0].y};
            if(obj.movable == false)
            {    
                emptySquares = this.Perseus.navigator.findObjectBorder(obj, origin);
            }else{
                emptySquares = this.Perseus.navigator.findAllEmpty(obj.x, obj.y, origin);
            }
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
            this.state = 'default';
        } else if (this.state == 'gather'){
            this.selectedObjects.forEach( (elem) => {
                if (elem instanceof Worker ) {
                    elem.gather(obj);
                }
            });
            this.state = 'default';
        }
    }

    selectInBox(){
        this.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y)+ this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));

        this.selectedObjects.forEach((elem)=>{elem.undrawCircle();});
        this.selectedObjects = [];
        this.highestPrioritySelected = null;
        this.Perseus.ui.clearCommandList();

        // Select objects
        this.Perseus.objects.forEach(function(obj){
            if(obj instanceof Unit){
                if(obj.faction == 'human'){
                    if(this.boxStartPos.x + this.game.camera.x <= obj.sprite.x  && obj.sprite.x <= this.boxEndPos.x + this.game.camera.x 
                            || this.boxEndPos.x + this.game.camera.x <= obj.sprite.x && obj.sprite.x <= this.boxStartPos.x + this.game.camera.x ){
                        if (this.boxStartPos.y + this.game.camera.y <= obj.sprite.y && obj.sprite.y <= this.boxEndPos.y + this.game.camera.y 
                                || this.boxEndPos.y + this.game.camera.y <= obj.sprite.y && obj.sprite.y <= this.boxStartPos.y + this.game.camera.y){
                            this.selectedObjects.push(obj);
                            if (this.highestPrioritySelected == null || this.highestPrioritySelected.priority < obj.priority) 
                                this.highestPrioritySelected = obj;
                            obj.drawSelectionCircle();
                        }
                    }
                }
            }
        }, this);

        if (this.highestPrioritySelected != null) this.Perseus.ui.updateCommandList(this.highestPrioritySelected);
    }

    cameraPan(){
        if(this.cursors.up.isDown || this.game.camera.height - this.pointer.position.y >= this.game.camera.height-32){
            let temp = this.game.camera.y; 
            this.game.camera.y -= 15;
        }
        if(this.cursors.down.isDown || this.game.camera.height - this.pointer.position.y <= 32){
            let temp = this.game.camera.y;
            this.game.camera.y += 15;
        }
        if(this.cursors.left.isDown || (this.game.camera.width - this.pointer.position.x) >= this.game.camera.width-32 ){
            let temp = this.game.camera.x; 
            this.game.camera.x -= 15;
        }
        if(this.cursors.right.isDown || (this.game.camera.width - this.pointer.position.x) <= 32 ){
            let temp = this.game.camera.x; 
            this.game.camera.x += 15;
        }
    }

    isViableCommand(string){
        if (this.selectedObjects.length == 0) return false;
        if (this.commandState == 'build'){
            for (let prop in this.highestPrioritySelected.uiData.buildList){
                if (prop == string) return true;
            }
        } else {
            for (let prop in this.highestPrioritySelected.uiData.commandList){
                if (prop == string) return true;
            }
        }
        return false;
    }

    input(state){
        switch (state){
            case 'A':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('A');
                    this.cooldownTimer = 20;
                } else {
                    this.state = 'attack';
                    this.cooldownTimer = 20;
                }
                break;
            case 'B':
                this.state = 'default';
                this.commandState = 'build';
                this.Perseus.ui.updateBuildList(this.highestPrioritySelected);
                break;
            case 'G':
                this.state = 'gather';
                break;
            case 'S':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('S');
                    this.cooldownTimer = 20;
                }
                break;
            case 'P':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('P');
                    this.cooldownTimer = 20;
                }
                break;
            case 'M':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('M');
                    this.cooldownTimer = 20;
                } else {
                    this.state = 'move';
                    this.cooldownTimer = 20;
                }
                break;
            case 'F':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('F');
                    this.cooldownTimer = 20;
                }
                break;
            case 'W':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('W');
                    this.cooldownTimer = 20;
                }
                break;
            case 'R':
                if (this.commandState == 'build'){
                    this.selectedObjects[0].build('R');
                    this.cooldownTimer = 20;
                }
                break;
        }
    }

    update(){
        console.log(this.state);
        if(this.selectionBox){
            this.selectionBox.destroy();
        }

        if (this.updateProgress >= 9){
            this.Perseus.ui.infoBar.update(this.highestPrioritySelected);
            this.updateProgress = 0;
        }
        else this.updateProgress++;

        this.selectionBox = this.game.add.graphics();
        this.selectionBox.lineStyle(2, 0xFFFFFF, 1);

        this.cameraPan();

        if(this.state != 'pointerHold' && this.commandState != 'build'){
            if(this.keys.A.isDown){
                if (this.isViableCommand('A')){
                    this.Perseus.ui.highlightButton('A');
                    this.Perseus.prompter.drawToScreen('Choose Attack Target', -1);
                    //console.log('input attack command');
                    this.state = 'attack';
                }
            }
            if(this.keys.M.isDown){
                if (this.isViableCommand('M')){
                    this.Perseus.ui.highlightButton('M');
                    this.state = 'move';
                    this.Perseus.prompter.drawToScreen('Choose Target Location', -1);
                }
            }

            if(this.keys.G.isDown){
                if (this.isViableCommand('G')){
                    this.Perseus.ui.highlightButton('G');
                    this.state = 'gather';
                    this.Perseus.prompter.drawToScreen('Click on a Resource', -1);
                }
            }

            if(this.keys.B.isDown){
                if (this.isViableCommand('B')){
                    this.Perseus.ui.highlightButton('B');
                    this.commandState = 'build';
                    this.Perseus.ui.updateBuildList(this.highestPrioritySelected);
                }
            }
        }
        if(this.commandState == 'build'){
            if (this.isViableCommand('W')){
                if(this.keys.W.isDown) {
                    if (this.cooldownTimer == 0){
                        this.selectedObjects[0].build('W')
                            //cooldown
                            this.cooldownTimer = 20;
                    }
                }
            }
            if (this.isViableCommand('M')){
                if(this.keys.M.isDown) {
                    if (this.cooldownTimer == 0){
                        this.selectedObjects[0].build('M')
                            //cooldown
                            this.cooldownTimer = 20;
                    }
                }
            }
            if(this.keys.A.isDown) {
                if (this.isViableCommand('A')){
                    if (this.cooldownTimer == 0){
                        if (this.selectedObjects[0].build('A')){
                            //cooldown
                            this.cooldownTimer = 20;
                        }
                    }
                }
            }
            if(this.keys.P.isDown) {
                if (this.isViableCommand('P')){
                    if (this.cooldownTimer == 0){
                        if (this.selectedObjects[0].build('P')){
                            //cooldown
                            this.cooldownTimer = 20;
                        }
                    }
                }
            }
            if(this.keys.S.isDown) {
                if (this.isViableCommand('S')){
                    if (this.cooldownTimer == 0){
                        if (this.selectedObjects[0].build('S')){
                            //cooldown
                            this.cooldownTimer = 20;
                        }
                    }
                }
            }
            if(this.keys.F.isDown) {
                if (this.isViableCommand('F')){
                    if (this.cooldownTimer == 0){
                        if(this.selectedObjects[0].build('F')){
                            //cooldown
                            this.cooldownTimer = 20;
                        }
                    }
                }
            }
            if(this.keys.R.isDown) {
                if (this.isViableCommand('R')){
                    if (this.cooldownTimer == 0){
                        if(this.selectedObjects[0].build('R')){
                            //cooldown
                            this.cooldownTimer = 20;
                        }
                    }
                }
            }
        }
        // Cancel command
        if (this.keys.X.isDown){
            this.selectedObjects.forEach((obj)=>{
                if (obj instanceof Worker)
                    obj.cancelPlacing();
            });
            this.state = 'default';
            this.commandState = 'default';
            this.Perseus.ui.updateCommandList(this.highestPrioritySelected);
            this.Perseus.prompter.clearText();
        }

        if (this.state == 'default' ){
            if (this.pointer.isDown == true){
                if (!this.isPointerInUi()){
                    this.boxStartPos = this.pointer.positionDown; 
                    //console.log(this.pointer.positionDown);
                }
            }
        }
        if (this.state == 'move'){
            if (this.pointer.isDown == true){
                if (!this.isPointerInUi()){
                    this.selectedObjects.forEach((obj) => {
                        if (obj instanceof Unit){
                            obj.move(this.pointer.positionDown.x + this.Perseus.game.camera.view.x, this.pointer.positionDown.y + this.Perseus.game.camera.view.y);
                        }
                    }, this);

                    this.state = 'default';
                    this.commandState = 'default';
                }
            }
        } 
        if (this.state == 'attack'){
            //wait for click event
        } 
        if (this.state == 'place'){
            if (this.pointer.isDown == true){
                if (!this.isPointerInUi()){
                    this.highestPrioritySelected.place(this.pointer.positionDown.x, this.pointer.positionDown.y);
                    this.state = 'default';
                    this.commandState = 'default';
                }
            }
        }
        if (this.state == 'pointerHold') {
            if (this.pointer.isDown == false){
                //console.log('finishing selection box');
                this.boxEndPos = this.pointer.positionUp;
                //console.log(this.boxEndPos);
                this.selectInBox();
                this.state = 'default';
                this.commandState = 'default';
            } else {
                //draw rectangle
                this.boxEndPos = this.pointer.position;
                this.selectionBox.drawRect(Math.min(this.boxStartPos.x, this.boxEndPos.x) + this.game.camera.x, Math.min(this.boxStartPos.y, this.boxEndPos.y) + this.game.camera.y, Math.abs(this.boxEndPos.x-this.boxStartPos.x), Math.abs(this.boxEndPos.y-this.boxStartPos.y));
            }
        }
        if (this.state == 'default' && this.pointer.isDown){
            if (!this.isPointerInUi()){
                if(this.selectedObjects.length > 0 && this.selectedObjects[0].placing)
                {
                    this.selectedObjects[0].place();
                }else{
                    this.state = 'pointerHold';
                }
            }
        }
        if (this.cooldownTimer > 0 )this.cooldownTimer--;
    }

    endWithSelect(obj){
        this.update();
        if (this.selectedObjects.length == 0 || obj instanceof Unit){
            if(obj.faction == 'human'){
                this.selectedObjects.push(obj);
                this.Perseus.ui.updateCommandList(obj);
                obj.drawSelectionCircle();
                console.log("selected:", this.selectedObjects);
                if (this.highestPrioritySelected == null || this.highestPrioritySelected.priority < obj.priority) 
                    this.highestPrioritySelected = obj;

            }
        }
    }
}
export {Controller}
