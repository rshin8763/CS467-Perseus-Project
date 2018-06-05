import {} from ''
Minimap {
    constructor(Perseus){
        let infoBox = this.Perseus.game.add.graphics();
        let style = { font: "12px Arial", fill: "#ffffff", align: "center" };
        infoBox.lineStyle(2, 0xFFFFFF, 1);
        infoBox.drawRect(16,8,192,192);
        infoBox.fixedToCamera = true;
        this.infoBox = infoBox;
    }

    otherfunct(){
    }

}
export {Minimap}
