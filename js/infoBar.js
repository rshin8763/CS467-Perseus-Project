import {Worker} from './worker.js';
import {Building} from './building.js';
import {Unit} from './unit.js';
import {Resource} from './resource.js';
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

class InfoBar
{
    constructor(x,y, Perseus){
        this.infoElements = [];
        this.size = 0;
        this.elemHeight = 48;
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
        infoBox.drawRect(this.x, this.y-10,192,192+50);
        infoBox.fixedToCamera = true;
        // this.infoTitle = this.Perseus.game.add.text(32, 160, 'Selected:', style);
        // this.infoTitle.fixedToCamera = true;
        this.infoBox = infoBox;
        this.ui.add(infoBox);
        // 2/ this.ui.add(this.infoTitle);
        // this.clearInfoBar();

    }

    clearInfoBar(){
        this.infoElements.forEach((elem)=>{
            elem.destroy();
        });
        this.size = 0;
    }

    renderHP(obj){
        let hpstr = obj.hp + '/' + obj.maxHP;
        return this.renderText('HP', hpstr)
    }
    renderText(type, value){
        let text = type + ': ' + value;
        let elem = this.Perseus.game.add.text(this.x+20, this.y + this.size*this.elemHeight, text, style);
        this.size++;
        elem.fixedToCamera = true;
        this.ui.add(elem);
        return elem;
    }
    fillUnitStats(obj){
        this.infoElements.push(this.renderText('Selected', obj.type)); 
        this.infoElements.push(this.renderHP(obj)); 
        this.infoElements.push(this.renderText('Attack', obj.attk));
        this.infoElements.push(this.renderText('Defense', obj.defense));
        if (obj instanceof Worker)
            this.addBuildProgress(obj);
    }

    fillBuildingStats(obj){
        this.infoElements.push(this.renderText('Selected', obj.type)); 
        this.infoElements.push(this.renderHP(obj)); 
        this.addBuildProgress(obj);
    }

    fillResourceStats(obj){
        this.infoElements.push(this.renderText('Selected', obj.name)); 
        this.infoElements.push(this.renderText('Type', obj.type)); 
        this.infoElements.push(this.renderText('Resources Amount', obj.resourceAmount)); 
    }

    fillInfoBar(obj){
        this.clearInfoBar();
        if (obj instanceof Building){
            this.fillBuildingStats(obj);
        } else if (obj instanceof Unit){
            this.fillUnitStats(obj);
        } else if (obj instanceof Resource){
            this.fillResourceStats(obj);
        }
    }

    updateBuildProgress(obj){
        if (obj.building) {
            if (obj.building == true){
                if (this.progressBar) this.progressBar.destroy();
                let percent = obj.buildProgress/100;
                let progress = this.Perseus.game.add.graphics();
                progress.beginFill(0xFFFFFF);
                progress.drawRect(this.x +20, this.y + this.size * this.elemHeight, percent*160, 20);
                progress.fixedToCamera = true;
                progress.endFill();
                this.ui.add(progress);
                this.infoElements.push(progress);
                this.progressBar = progress;
            }
        }
    }

    addBuildProgress(obj){
        let bar = this.Perseus.game.add.graphics();
        bar.lineStyle(2, 0xFFFFFF, 1);
        bar.drawRect(this.x +20, this.y + this.size*this.elemHeight, 160, 20);
        bar.fixedToCamera = true;
        this.ui.add(bar);
        this.infoElements.push(bar);
    }

    update(obj){
        if (!obj) return;
        this.updateBuildProgress(obj) ;
    }
}
export {InfoBar}
