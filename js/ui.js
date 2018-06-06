class Ui
{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.bar;
        this.ui;
        this.infoBox;
        this.textBox;
        this.commandBox;
        // this.minimap = new Minimap(Perseus);
        this.commandButtons = [];
        this.initialize();
    }

    initialize(){
        this.ui = this.Perseus.game.add.group();

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
            button.fixedToCamera = true;
            this.commandButtons.push(button);
        }

    }

    highlightButton(command){
        this.commandButtons.forEach((elem)=>{
            if (elem.action == command){
                elem.tint = 0x00ff00;
            }
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
}
export {Ui}
