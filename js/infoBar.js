var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

class InfoBar
{
    constructor(x,y, Perseus){
        this.infoElements = [];
        this.Perseus = Perseus;
        this.progressBar;
        this.stats;
        this.x = x;
        this.y = y;
        this.initialize();
        this.infoBox;
        this.infoTitle;
    }

    initialize(){
        this.ui = this.Perseus.gui;

        // Create GUI info box
        let infoBox = this.Perseus.game.add.graphics();
        infoBox.lineStyle(2, 0xFFFFFF, 1);
        infoBox.drawRect(this.x, this.y,192,192+50);
        infoBox.fixedToCamera = true;
        this.infoTitle = this.Perseus.game.add.text(32, 160, 'Selected:', style);
        this.infoBox = infoBox;
        this.ui.add(infoBox);
        this.ui.add(this.infoTitle);

    }
    clearInfoBar(){
        this.infoElements.forEach((elem)=>{
            elem.destroy();
        });
    }

    fillUnitStats(){
    }
    fillBuildingStats(){
    }

    fillResourceStats(){
    }

    fillInfoBar(obj){
    }

    addBuildProgress(obj){
        if (obj instanceof Building){
        }
    }

    update(){
        this.addBuildProgress(this.Perseus.controller.highestPrioritySelected);
    }
}

export {InfoBar}
