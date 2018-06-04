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
        // Create GUI bar
        let bar = this.Perseus.game.add.sprite(0,0,'ui');
        bar.fixedToCamera = true;
        bar.height = 600;
        bar.width =  224;
        this.bar = bar;

        // Create GUI info box
        let infoBox = this.Perseus.game.add.graphics();
        let style = { font: "12px Arial", fill: "#ffffff", align: "center" };
        infoBox.lineStyle(2, 0xFFFFFF, 1);
        infoBox.drawRect(16,200,192,192);
        infoBox.fixedToCamera = true;
        this.infoBox = infoBox;

        // Create GUI command box
        let commandBox = this.Perseus.game.add.graphics();
        commandBox.lineStyle(2, 0xFFFFFF, 1);
        commandBox.drawRect(16,400,192,192);
        console.log(commandBox.x);
        commandBox.fixedToCamera = true;
        this.commandBox = commandBox;
        this.commandList = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                let x =  64*i + 16;
                let y =  64*j + 400;
                let tile = commandBox.drawRect(x,y,64,64);
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

        console.log(object);
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
    updateCommandList(object){
        // Clear grid
        this.clearCommandList();

        let count = 0;
        for (let prop in object.uiData.commandList){
            let x = count%3*64 + 16;
            let y = Math.floor(count/3)*64 + 400;
            count++;

            let button = this.Perseus.game.add.sprite(x,y,'command_buttons');
            button.scale.setTo(2.0, 2.0);
            button.fixedToCamera = true;

            if (prop == 'A'){
                button.frame = 0;
                this.commandButtons.push(button);
            } else if (prop == 'B') {
                button.frame = 0;
                this.commandButtons.push(button);
                button.frame = 18;
                this.commandButtons.push(button);
            } else if (prop == 'G') {
                button.frame = 0;
                this.commandButtons.push(button);
                button.frame = 9;
                this.commandButtons.push(button);
            } else if (prop == 'M') {
                button.frame = 7;
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
