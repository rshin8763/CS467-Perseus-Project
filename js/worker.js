import {Mine} from './mine.js';
import {Unit} from './unit.js'
import {Fort} from './fort.js'
import {Barracks} from './barracks.js'
import {ArcheryRange} from './archeryrange.js'
import {WizardTower} from './wizardtower.js'
import {Farm} from './farm.js'
import {AI} from './ai.js';
import {Player} from './player.js';
import {Resource} from './resource.js';

var woodHarvest = 10, goldMined = 10;

class Worker extends Unit{
    constructor(faction, x,y,Perseus){
        //Call Unit Constructor
        super(x,y, faction,'worker', 70, 17, 5, 3, Perseus);
        this.woodCost = 0;
        this.goldCost = 300;
        this.maxHP = 70;
        this.type="Worker";
        this.placing = false;
        this.building = false;
        this.buildProgress = 0;
        this.selectedBuilding = null;
        this.selectedSprite = null;
        this.selectedX = null;
        this.selectedY = null;
        this.squareMarkers = [];
        this.gatherState = 0;
        this.gatherProgress = 0;
        this.lastResource = null;
        this.priority = 1;
        this.validToPlace = true;

        this.woodCosts = {
            Fort : 150,
            Barracks: 150,
            Mine: 100,
            ArcheryRange : 300,
            WizardTower : 100,
            Farm : 100
        }

        this.goldCosts = {
            Fort : 250,
            Barracks: 0,
            Mine: 0,
            ArcheryRange : 300,
            WizardTower : 500,
            Farm : 0
        }

        //Create sprite
        if(Math.random() >= 0.5){
            this.addSprite('worker_male');
        } else {
            this.addSprite('worker_female')
        }

        this.uiData = {
            commandList: {M: "Move", A: "Attack", G:"Gather", B:"Build"},
            buildList:{F: "Fort", R: "Barracks", M: "Mine", A: "Archery Range", W: "Wizard Tower", F: "Farm"}  
        };

        //Add Animations
        this.sprite.animations.add('work_left', [65, 66, 67, 68, 69, 70, 71, 72], 10, true);
        this.sprite.animations.add('work_right', [91, 92, 93, 94, 95, 96, 97, 98], 10, true);
        this.sprite.animations.add('atk_right', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);
    }

    //Cancel placing a building
    cancelPlacing(){
        this.squareMarkers.forEach((elem)=>{
            elem.destroy();
        });
        if(this.selectedSprite)
            this.selectedSprite.destroy();
        this.selectedX = null;
        this.selectedY = null;
        this.buildProgress = 0;
        this.gatherState = 0;
        this.sprite.animations.stop();
        this.building = false;
        this.placing = false;
    }

    //Find the nearest fort to the units current postion
    findNearestFort(){

        let x = this.x;
        let y = this.y;

        let closest = null;
        let min = Number.MAX_SAFE_INTEGER;
        this.Perseus.objects.forEach((obj)=>{
            if (obj instanceof Fort && obj.faction == this.faction){
                //get distance
                if (Math.hypot(x-obj.x, y-obj.y) < min){
                    min = Math.hypot(x-obj.x, y-obj.y) < min;
                    closest = obj;
                }
            }
        });
        console.log('found fort ', closest);
        return closest;
    }

    //For controller to call for correct build option
    build(str){
        switch (str) {
            default:
            case 'F':
                return this.buildFort();
                break;
            case 'M':
                return this.buildMine();
                break;
            case 'R':
                return this.buildBarracks();
                break;
            case 'A':
                return this.buildArcheryRange();
                break;
            case 'W':
                return this.buildWizardTower();
                break;
            case 'F':
                return this.buildFarm();
                break;

        }
    }

    //Allow user to place a fort
    buildFort()
    {
        if(this.Perseus.Player.playerWood >= this.woodCosts.Fort 
                && this.Perseus.Player.playerGold > this.goldCosts.Fort)
        {            
            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'fort' + "_" + this.faction);
            this.selectedBuilding = "Fort";
            this.placing = true;
            this.gatherState = 0;
            this.Perseus.controller.state = 'place';

            this.createConflictSquares();
            return true;
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.woodCosts.Fort, this.goldCosts.Fort), 100, '#ff0000');   
            return false;
        }

    }

    //Allow a user to palce a mine
    buildMine()
    {
        if(this.Perseus.Player.playerWood >= this.woodCosts.Mine 
                && this.Perseus.Player.playerGold >= this.goldCosts.Mine)
        {            
            this.selectedSprite = this.game.add.sprite(this.game.input.x+64, this.game.input.y+64, 'mine');
            this.selectedSprite.height = 64;
            this.selectedSprite.width = 64;
            this.selectedBuilding = "Mine";
            this.placing = true;
            this.gatherState = 0;
            this.Perseus.controller.state = 'place';

            this.createMineConflictSquares();
            return true;
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.woodCosts.Mine, this.goldCosts.Mine), 100, '#ff0000');   
            console.log('not enough resources');
            return false;
        }

    }

    //Allow a user to place a barracks
    buildBarracks()
    {
        if(this.Perseus.Player.playerWood  >= this.woodCosts.Barracks 
                && this.Perseus.Player.playerGold  >= this.goldCosts.Barracks)
        {            
            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'barracks' + "_" + this.faction);
            this.selectedBuilding = "Barracks";
            this.gatherState = 0;
            this.placing = true;
            this.Perseus.controller.state = 'place';

            this.createConflictSquares();
            return true;
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.woodCosts.Barracks, this.goldCosts.Barracks), 100, '#ff0000');   
            console.log('not enough resources');
            return false;
        }

    }
    
    //Allow a user to place an Archery Range
    buildArcheryRange()
    {
        if(this.Perseus.Player.playerWood >= this.woodCosts.ArcheryRange 
                && this.Perseus.Player.playerGold >= this.goldCosts.ArcheryRange)
        {

            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'archeryrange' + "_" + this.faction);
            this.selectedBuilding = "ArcheryRange";
            this.gatherState = 0;
            this.placing = true;
            this.Perseus.controller.state = 'place';

            this.createConflictSquares();
            return true;
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.woodCosts.ArcheryRange, this.goldCosts.ArcheryRange), 100, '#ff0000');   
            console.log('not enough resources');
            return false;
        }
    }

    //Allow a user to place a Wizard Tower
    buildWizardTower()
    {
        if(this.Perseus.Player.playerWood >= this.woodCosts.WizardTower 
                && this.Perseus.Player.playerGold >= this.goldCosts.WizardTower)
        {

            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'wizardtower' + "_" + this.faction);
            this.selectedBuilding = "WizardTower";
            this.gatherState = 0;
            this.placing = true;
            this.Perseus.controller.state = 'place';

            this.createConflictSquares();    
            return true;
        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.woodCosts.WizardTower, this.goldCosts.WizardTower), 100, '#ff0000');
            console.log('not enough resources');
            return false;
        }
    }

    //Allow a user to place a Farm
    buildFarm()
    {
        if(this.Perseus.Player.playerWood >= this.woodCosts.Farm 
                && this.Perseus.Player.playerGold >= this.goldCosts.Farm)
        {
            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'farm' + "_" + this.faction);
            this.selectedBuilding = "Farm";
            this.gatherState = 0;
            this.placing = true;
            this.Perseus.controller.state = 'place';

            this.createConflictSquares(); 
            return true;
        } else {
            console.log('not enough resources');
            return false;
        }
    }

    //Create sprites that will show up if you try to place a building in an invalid place
    createConflictSquares()
    {
        this.squareMarkers = [];

        for(let i = 0; i < 16; i++)
        {
            let square = this.Perseus.navigator.getSquare(this.selectedSprite.x , this.selectedSprite.y );
            let coords = this.Perseus.navigator.getCoords(square.x + i % 4, square.y+ Math.floor(i / 4));
            let newSquare = this.Perseus.game.add.sprite(coords.x, coords.y, 'navSquare');
            newSquare.alpha = 0;
            this.squareMarkers[i] = newSquare;
        }
    }

    createMineConflictSquares()
    {
        this.squareMarkers = [];

        for(let i = 0; i < 4; i++)
        {
            let square = this.Perseus.navigator.getSquare(this.selectedSprite.x , this.selectedSprite.y );
            let coords = this.Perseus.navigator.getCoords(square.x + i % 2, square.y+ Math.floor(i / 2));
            let newSquare = this.Perseus.game.add.sprite(coords.x, coords.y, 'navSquare');
            newSquare.alpha = 0;
            this.squareMarkers[i] = newSquare;
        }
    }

    //Place the building currently being placed and start building it
    place(){
        if(this.validToPlace == true)
        {
            this.gatherState = 0;
            this.placing = false;
            this.building = true;
            // Reduce Resources 
            
            this.selectedSprite.alpha = 0.75;
            this.selectedX = this.selectedSprite.x; 
            this.selectedY = this.selectedSprite.y; 
            let square = this.Perseus.navigator.getSquare(this.selectedSprite.x, this.selectedSprite.y);
            if (this.selectedBuilding == "Mine"){
                for(let i = 0; i < 2; i++)
                {
                    for(let j = 0; j < 2; j++){
                        this.Perseus.navigator.markOccupied(square.x+i, square.y+j);
                    }
                }
            }else {
                for(let i = 0; i < 4; i++)
                {
                    for(let j = 0; j < 4; j++){
                        this.Perseus.navigator.markOccupied(square.x+i, square.y+j);
                    }
                }
            }
            //unmark the top left square so the worker can stand there while building
            this.Perseus.navigator.markNotOccupied(square.x, square.y)
        }
    }

    //Called if the unit is attacking this frame
    attackTick()
    {
        //if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width) * this.range )
        if(this.x != this.attackSquare.x || this.y != this.attackSquare.y)
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y);
        } else{
            if(Math.abs(this.x - this.target.x) > this.range || Math.abs(this.y - this.target.y > this.range))
            {
                //This wont work for buildings, but they shouldn't move so it should't ever come up.
                //It also isn't done as a group, so a group following somebody might stack.
                let emptySquare = this.Perseus.navigator.findEmpty(this.target.x, this.target.y);
                this.attack(this.target, emptySquare);
                return;
            }
            //console.log(this.target);
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.x < this.target.x)
                {
                    this.sprite.animations.play('atk_right', true);
                }else{
                    this.sprite.animations.play('atk_left',true);
                }

                if(this.target.hp > 1)
                {
                    this.cooldown = 200 / this.attkSpeed;
                    this.target.takeDamage(this.attk, this);
                }else {
                    this.stopAttack();
                }

            }
        }
    }

    gather(resource){
        if (!(resource instanceof Resource)){
            this.Perseus.prompter.drawToScreen('Must Click on Resource!', 100, '#ff0000');
            this.Perseus.controller.state = 'default';
            return;
        }

        this.gatherProgress = 0;
        if (resource.exhausted == true){
            this.gatherState = 0;
            console.log('Resource node is exhausted!');
        }
        this.moveTo(resource);
        this.gatherState = 1;
        this.lastResource = resource;
    }

    move(x,y){
        super.move(x,y);
        this.gatherState = 0;
        //console.log(this.destx, this.desty);
    }

    moveTo(obj){
        let border = this.Perseus.navigator.findObjectBorder(obj, {x : this.x, y : this.y});

        //let rand = Math.floor(Math.random() * border.length);

        //console.log("moving to ", obj.sprite.x, " ", obj.sprite.y);
        let coords = this.Perseus.navigator.getCoords(border[0].x, border[0].y);
        this.move(coords.x, coords.y);
    }

    update(){
        super.update();
        if (this.gatherState == 1){ // heading to resource node
            if (this.moving == false){
                this.gatherState = 2;
            }
        } if (this.gatherState == 2){ //gathering at node
            if (this.gatherProgress < 300){
                this.sprite.animations.play('work_right');
                this.gatherProgress += 1;
            } 
            else 
            {
                this.sprite.animations.stop();
                if (this.lastResource)
                    this.lastResource.loseResource(1);
                this.moveTo(this.findNearestFort());
                this.gatherState = 3;
            }
        } 
        if (this.gatherState == 3)
        { // returning to fort
            if (this.moving == false)
            {
                if (this.lastResource.type == 'wood')
                {
                    if(this.faction == 'orc') // IF IS AI, UPDATE AI
                    {
                        console.log("1");
                        this.Perseus.AI.UpdateStock(woodHarvest, 'wood');
                    }
                    else // ELSE IS PLAYER
                    {
                        console.log("2");
                        this.Perseus.Player.UpdateStock(woodHarvest, 'wood');
                    }

                } 
                else // MUST BE GOLD 
                {
                    if(this.faction == 'orc') // 
                    {
                        this.Perseus.AI.UpdateStock(goldMined, 'gold');
                    }
                    else
                    {
                        this.Perseus.Player.UpdateStock(goldMined, 'gold');
                    }
                }
                // CHECKS TO SEE IF RESOURCE IS EXHAUSTED
                if (this.lastResource && this.lastResource.exhausted == true)
                {
                    this.gatherState = 0;
                    this.moveTo(this.findNearestFort());
                }
                else
                {
                    this.gather(this.lastResource);
                }
            }
            //loop
        }

        //If the unit is palcing a building show a partially transparent version of that building at the cursor and turn on the correct conflict square if the
        //  user hovers over an invalid square
        if(this.placing)
        {
            let selectedSquare = this.Perseus.navigator.getSquare(this.game.input.activePointer.x + this.game.camera.view.x, this.game.input.activePointer.y + this.game.camera.view.y);
            let coords = this.Perseus.navigator.getCoords(selectedSquare.x, selectedSquare.y);

            if (this.selectedBuilding == "Mine"){

                this.selectedSprite.x = coords.x - 32;
                this.selectedSprite.y = coords.y - 32;

                for(let i = 0; i < 4; i++)
                {
                    let square = this.Perseus.navigator.getSquare(this.selectedSprite.x , this.selectedSprite.y );
                    let coords = this.Perseus.navigator.getCoords(square.x + i % 2, square.y+ Math.floor(i / 2));


                    this.squareMarkers[i].x = coords.x;
                    this.squareMarkers[i].y = coords.y;
                }

                let square = this.Perseus.navigator.getSquare(this.selectedSprite.x, this.selectedSprite.y,);
                coords = this.Perseus.navigator.getCoords(square.x, square.y);

                let conflicts = 0;

                if(square.x > 0 && square.y > 0)
                {
                    for(let i = 0; i < 2; i++)
                    {
                        for (let j = 0; j < 2; j++)
                        {
                            let index = i + j*2
                                if(this.Perseus.navigator.navmap[square.x+i][square.y+j] != 2){
                                    this.squareMarkers[index].alpha = .5;
                                    conflicts++;
                                } else {
                                    this.squareMarkers[index].alpha = .0;
                                }

                        }
                    }
                }

                if(conflicts > 0)
                {
                    this.validToPlace = false;
                }else{
                    this.validToPlace = true;
                }
                console.log(selectedSquare);

            } else {
                this.selectedSprite.x = coords.x - 64;
                this.selectedSprite.y = coords.y - 64;

                for(let i = 0; i < 16; i++)
                {
                    let square = this.Perseus.navigator.getSquare(this.selectedSprite.x , this.selectedSprite.y );
                    let coords = this.Perseus.navigator.getCoords(square.x + i % 4, square.y+ Math.floor(i / 4));


                    this.squareMarkers[i].x = coords.x;
                    this.squareMarkers[i].y = coords.y;
                }

                let square = this.Perseus.navigator.getSquare(this.selectedSprite.x, this.selectedSprite.y,);
                coords = this.Perseus.navigator.getCoords(square.x, square.y);

                let conflicts = 0;

                if(square.x > 0 && square.y > 0)
                {
                    for(let i = 0; i < 4; i++)
                    {
                        for (let j = 0; j < 4; j++)
                        {
                            let index = i + j*4
                                if(this.Perseus.navigator.navmap[square.x+i][square.y+j] == 1){
                                    this.squareMarkers[index].alpha = .5;
                                    conflicts++;
                                } else {
                                    this.squareMarkers[index].alpha = .0;
                                }

                        }
                    }
                }

                if(conflicts > 0)
                {
                    this.validToPlace = false;
                }else{
                    this.validToPlace = true;
                }
                console.log(selectedSquare);
            }
        }

        if(this.building)
        {
            //Move to the place we're going to build
            if(Math.abs(this.sprite.x - this.selectedX) > this.sprite.width || Math.abs(this.sprite.y - this.selectedY) > this.sprite.height)
            {

                this.move(this.selectedX, this.selectedY)
            } else {
                //If the build progress has finished, create the building and push it to the objects array
                if(this.buildProgress > 1000)
                {

                    if(this.selectedBuilding == "Fort")
                    {
                        new Fort(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    if(this.selectedBuilding == "Barracks")
                    {
                        new Barracks(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    if(this.selectedBuilding == "Mine")
                    {
                        new Mine(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    if(this.selectedBuilding == "ArcheryRange")
                    {
                       new ArcheryRange(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    if(this.selectedBuilding == "WizardTower")
                    {
                        new WizardTower(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    if(this.selectedBuilding == "Farm")
                    {
                        new Farm(this.faction, this.selectedSprite.x, this.selectedSprite.y, this.Perseus);
                    }
                    this.building = false;
                    this.Perseus.Player.reduceResources(this.woodCosts[this.selectedBuilding], this.goldCosts[this.selectedBuilding]);
                    this.selectedSprite.destroy();
                    this.selectedX = null;
                    this.selectedY = null;
                    this.buildProgress = 0;
                    this.sprite.animations.stop();

                } else {
                    this.sprite.animations.play('work_right');
                    this.buildProgress += 1;
                }
            }
        }
    }
}

export {Worker};
