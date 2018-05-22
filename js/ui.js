class Ui{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.bar;
        this.ui;
        this.infoBox;
        this.textBox;
        this.commandBox;
        initialize();
    }

    initialize(){
        // Create GUI bar
        let bar = this.add.sprite(0,0,'ui');
        bar.fixedToCamera = true;
        bar.height = 600;
        bar.width =  192;
        this.bar = bar;

        // Create GUI info box
        let infoBox = this.add.graphics();
        let style = { font: "12px Arial", fill: "#ffffff", align: "center" };
        infoBox.lineStyle(2, 0xFFFFFF, 1);
        infoBox.drawRect(10,410,172,180);
        infoBox.fixedToCamera = true;
        this.infoBox = infoBox;

        // Create GUI command box
        let commandBox = this.add.graphics();
        commandBox.lineStyle(2, 0xFFFFFF, 1);
        commandBox.drawRect(10,210,172, 180);
        commandBox.fixedToCamera = true;
        this.commandBox = commandBox;
        this.commandList = [];
        for (int i; i < 3; i++){
            for (jnt j; j < 3; j++){
                let x =  172*i/3 + 10;
                let y =  180*j/3 + 210;
                tile = commandBox.drawRect(x,y,57,60);
            }
        }
    }

    updateUI(controller){
        updateCommandList();
    }

    updateCommandList(object){
        object.commandList = object.commandList;
    }

}
export {Ui}
