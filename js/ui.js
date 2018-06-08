var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

import {Player} from './player.js'

class Ui
{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.bar;
        this.ui;
        this.infoBox;
        this.textBox;
        this.commandBox;
        this.woodText;
        this.goldText;
        this.pause_button;
        this.mute_button;
        this.saveButton;
        this.quitButton;
        this.newGameButton;
        this.resumeButton;
        this.enemyHealthText;
        // this.minimap = new Minimap(Perseus);
        this.commandButtons = [];
        this.initialize();
    }

    initialize(){
        this.ui = this.Perseus.gui;

        // Create GUI bar
        let bar = this.Perseus.game.add.sprite(0,0,'ui');
        bar.fixedToCamera = true;
        bar.height = 600;
        bar.width =  224;
        this.bar = bar;
        this.ui.add(bar);

        // Create GUI info box
        let infoBox = this.Perseus.game.add.graphics();
        let style = { font: "12px Arial", fill: "#ffffff", align: "center" };
        infoBox.lineStyle(2, 0xFFFFFF, 1);
        infoBox.drawRect(16,200,192,192);
        infoBox.fixedToCamera = true;
        this.infoBox = infoBox;
        this.ui.add(infoBox);

        // Create GUI command box
        let commandBox = this.Perseus.game.add.graphics();
        commandBox.lineStyle(2, 0xFFFFFF, 1);
        commandBox.drawRect(16,400,192,192);
        //console.log(commandBox.x);
        commandBox.fixedToCamera = true;
        this.commandBox = commandBox;
        this.commandList = [];
        this.ui.add(commandBox);

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                let x =  64*i + 16;
                let y =  64*j + 400;
                let tile = commandBox.drawRect(x,y,64,64);
                this.ui.add(tile);
            }
        }

        // ------------------------------------------------------------------------
        // PAUSE BUTTON, MUTE, MENU
        // MENU BAR
        this.menuBar = this.Perseus.game.add.sprite(0, 0, 'menuBar'); // ADD MENU
        this.menuBar.fixedToCamera = true;
        this.ui.add(this.menuBar);

        // GOLD COUNT DISPLAY
        this.goldText = this.Perseus.game.add.text(0, 0, 'Gold: ' + 0,
                style);
        this.goldText.fixedToCamera = true;
        this.goldText.cameraOffset.setTo(70, 3);
        this.ui.add(this.goldText);
        this.updateText('gold');

        // WOOD COUNT DISPLAY
        this.woodText = this.Perseus.game.add.text(0, 0, 'Wood: ' + 0,
                style);
        this.woodText.fixedToCamera = true;
        this.woodText.cameraOffset.setTo(170, 3);
        this.ui.add(this.woodText);
        this.updateText('wood');

        //Enemy Building Count
        this.enemyHealthText = this.Perseus.game.add.text(0, 0, 
                'Enemy Buildings: ' + 0, style);
        this.enemyHealthText.fixedToCamera = true;
        this.enemyHealthText.cameraOffset.setTo(270, 3);
        this.ui.add(this.enemyHealthText);

        this.pause_button = this.Perseus.game.add.text(0, 0, 'Pause', style);
        this.pause_button.fixedToCamera = true;
        this.pause_button.cameraOffset.setTo(10, 3);
        this.pause_button.inputEnabled = true;
        this.pause_button.events.onInputUp.add(function(){this.pause()}, this);
        this.ui.add(this.pause_button);

        this.mute_button = this.Perseus.game.add.text(0, 0, 'Mute', style);
        this.mute_button.fixedToCamera = true;
        this.mute_button.cameraOffset.setTo(755, 3);
        this.mute_button.inputEnabled = true;
        this.mute_button.events.onInputUp.add(this.muteMusic);
        // this.pause_button.events.onInputUp.add(()=>{this.pause}, this);
        this.ui.add(this.mute_button);

    }

    clearCommandList(){
        this.commandButtons.forEach((elem)=>{
            elem.destroy();
        });
    }

    updateBuildList(object){
        this.clearCommandList();

        if (object == null)
            return;

        let count = 0;

        console.log(object.uiData);
        for (let prop in object.uiData.buildList){
            let x = count%3*64 + 16;
            let y = Math.floor(count/3)*64 + 400;
            count++;
            let text = prop;
            let style = { font: "32px Arial", fill: "#ffffff", align: "center" };
            let button = this.Perseus.game.add.text(x+16,y+16,text,style);
            button.Perseus = this.Perseus;
            button.inputEnabled = true;
            button.fixedToCamera = true;
            button.events.onInputDown.add(function(){
                this.Perseus.ui.commandButtons.forEach(function (obj){
                    obj.tint = 0xffffff;
                });
                this.tint = 0x00ff00;
                this.Perseus.controller.input(text);
            }, button);

            button.events.onInputUp.add(function(){
                this.Perseus.ui.commandButtons.forEach(function (obj){
                    obj.tint = 0xffffff;
                });
            }, button);

            this.commandButtons.push(button);
        }

    }

    highlightButton(command){
        this.commandButtons.forEach((elem)=>{
            if (elem.action == command){
                elem.tint = 0x00ff00;
            }
            else elem.tint = 0xffffff;
        });
    }

    updateCommandList(object){
        // Clear grid
        this.clearCommandList();
        if (object == null)
            return;

        let count = 0;
        for (let prop in object.uiData.commandList){
            let x = count%3*64 + 16;
            let y = Math.floor(count/3)*64 + 400;
            count++;

            let button = this.Perseus.game.add.sprite(x,y,'command_buttons');
            button.Perseus = this.Perseus;
            button.inputEnabled = true;
            button.events.onInputDown.add(function(){
                this.Perseus.ui.commandButtons.forEach(function (obj){
                    obj.tint = 0xffffff;
                });
                this.tint = 0x00ff00;
                this.Perseus.controller.input(this.action);
            } , button);


            button.scale.setTo(2.0, 2.0);
            button.fixedToCamera = true;
            this.ui.add(button);
            console.log(this.ui);

            if (prop == 'A'){
                button.frame = 0;
                button.action = 'A'
                    this.commandButtons.push(button);
            } else if (prop == 'B') {
                button.frame = 18;
                button.action = 'B'
                    this.commandButtons.push(button);
            } else if (prop == 'G') {
                button.frame = 9;
                button.action = 'G'
                    this.commandButtons.push(button);
            } else if (prop == 'M') {
                button.frame = 7;
                button.action = 'M'
                    this.commandButtons.push(button);
            }
        }
    }

    updateInfoBox(){
        clearInfoBox();
        if(this.Perseus.controller.selectedObjects.length == 0){
            clearInfoBox();
        } else if(this.Perseus.controller.selectedObjects.length == 1){
        } else {
        }
    }

    pause()
    {
        console.log('hello?');
        if (this.Perseus.game.paused) 
        {
            // do nothing
        }
        else
        {
            // ADD MENU BUTTONS
            this.resumeButton = this.Perseus.game.add.button(this.Perseus.game.camera.x + 300, this.Perseus.game.camera.y + 50,
                    'resumeButton', this.unpause, this, 2, 1, 0);

            this.saveButton = this.Perseus.game.add.button(this.Perseus.game.camera.x + 300, this.Perseus.game.camera.y + 160,
                    'saveButton', this.saveGame, this, 2, 1, 0);

            this.quitButton = this.Perseus.game.add.button(this.Perseus.game.camera.x + 300, this.Perseus.game.camera.y + 268,
                    'quitButton', this.quitGame, this, 2, 1, 0);

            this.newGameButton = this.Perseus.game.add.button(this.Perseus.game.camera.x + 300, this.Perseus.game.camera.y + 376,
                    'newGameButton', this.newGame, this, 2, 1, 0);
            this.Perseus.game.paused = true;
        }

    }

    muteMusic()
    {
        if(music.mute == true)
        {
            music.mute = false;
        }
        else
        {
            music.mute = true;
        }

    }

    unpause()
    {
        if(this.Perseus.game.paused)
        {
            this.Perseus.game.paused = false;
            this.saveButton.destroy();
            this.quitButton.destroy();
            this.newGameButton.destroy();
            this.resumeButton.destroy();
        }
    }

    saveGame()
    {
        this.Perseus.SaveGame.SaveGame();
    }
    quitGame()
    {
        this.unpause();
    }

    newGame()
    {
        this.Perseus.SaveGame.LoadGame();
    }

    updateText(kind)
    {
        if(kind == 'wood' || kind == 'Wood')
        {
            this.woodText.setText('Wood: ' + this.Perseus.Player.playerWood);
        }
        else if (kind == 'gold' || kind == 'Gold') 
        {
            this.goldText.setText('Gold: ' + this.Perseus.Player.playerGold);
        }
        // else if (kind == 'fort' || kind == 'Fort')
        // {
        //     fortText.setText('Forts: ' + this.Perseus.Player.playerForts);
        // }
        // else if (kind == 'barracks' || kind == 'Barracks')
        // {
        //     barracksText.setText('Barracks: ' + this.Perseus.Player.playerBarracks);
        // }
        // else if (kind == 'wizard tower' || kind == 'Wizard Tower')
        // {
        //     towerText.setText('Tower: ' + this.Perseus.Player.playerTowers);
        // }
        else if (kind == 'enemy' || kind == 'Enemy')
        {
            this.enemyHealthText.setText('Enemy Buildings: ' + this.Perseus.AI.AIAllBuildings);
        }
        else
        {
            console.log("You tried to update a UI text and failed.");
        }
    }
}

export {Ui}
