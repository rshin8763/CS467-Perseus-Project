import {Unit} from './unit.js'
import {Fort} from './fort.js'
import {Barracks} from './barracks.js'
import {ArcheryRange} from './archeryrange.js'
import {WizardTower} from './wizardtower.js'
import {Farm} from './farm.js'


class Worker extends Unit{
    constructor(faction, x,y,Perseus){
        super(x,y, faction, 70, 17, 5, 3, Perseus)
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
        this.gatherState = 0;
        this.gatherProgress = 0;
        this.lastResource = null;
        this.validToPlace = true;
        this.woodCosts = {
            Fort : 1500,
            Barracks: 600,
            ArcheryRange : 1200,
            WizardTower : 1000,
            Farm : 500
        }

        this.goldCosts = {
            Fort : 2500,
            Barracks: 100,
            ArcheryRange : 900,
            WizardTower : 1500,
            Farm : 700
        }
        
        
        
        if(Math.random() >= 0.5){
            this.addSprite('worker_male');
        } else {
            this.addSprite('worker_female')
        }

        this.uiData = {
            canBuild: true,
            commandList:[{"M" : "Move"}, {"A" : "Attack"}],
            buildList:[{"F" : "Fort"}, {"B" : "Barracks"}, {"R" : "Archery Range"}, {"W" : "Wizard Tower"}, {"F" : "Farm"}]  
        };


        this.sprite.animations.add('work_right', [91, 92, 93, 94, 95, 96, 97, 98], 10, true);
        this.sprite.animations.add('atk_right', [195, 196, 197, 198, 199, 200], 10, true);
        this.sprite.animations.add('atk_left', [169, 170, 171, 172, 173, 174], 10, true);
    }

    findNearestFort(){
        let x = this.sprite.x;
        let y = this.sprite.y;

        let closest = null;
        let min = Number.MAX_SAFE_INTEGER;
        this.Perseus.objects.forEach((obj)=>{
            if (obj instanceof Fort){
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


    buildFort()
    {
        //TODO: Move logic inside this if statment once we have access to resource amounts
        // if(this.Perseus.resources.wood > this.woodCosts.Fort 
        //     && this.Perseus.resources.gold > this.goldCosts.Fort)
        // {
        // }

        this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'fort')
        this.selectedBuilding = "Fort";
        this.placing = true;

        this.createConflictSquares();

    }

    buildBarracks()
    {
        //TODO: Move logic inside this if statment once we have access to resource amounts
        // if(this.Perseus.resources.wood > this.woodCosts.Barracks 
        //     && this.Perseus.resources.gold > this.goldCosts.Barracks)
        // {
        // }

        this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'barracks')
        this.selectedBuilding = "Barracks";
        this.placing = true;
        this.createConflictSquares();
    }
    buildArcheryRange()
    {
        //TODO: Move logic inside this if statment once we have access to resource amounts
        // if(this.Perseus.resources.wood > this.woodCosts.ArcheryRange 
        //     && this.Perseus.resources.gold > this.goldCosts.ArcheryRange)
        // {
        // }

        this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'archeryrange')
        this.selectedBuilding = "ArcheryRange";
        this.placing = true;
        this.createConflictSquares();

    }

    buildWizardTower()
    {
        //TODO: Move logic inside this if statment once we have access to resource amounts
        // if(this.Perseus.resources.wood > this.woodCosts.WizardTower 
        //     && this.Perseus.resources.gold > this.goldCosts.WizardTower)
        // {
        // }
            this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'wizardtower')
            this.selectedBuilding = "WizardTower";
            this.placing = true;
            this.createConflictSquares();    
    }

    buildFarm()
    {

        this.selectedSprite = this.game.add.sprite(this.game.input.x, this.game.input.y, 'farm')
        this.selectedBuilding = "Farm";
        this.placing = true;
    }


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

    place(){
        if(this.validToPlace == true)
        {
            this.placing = false;
            this.building = true;
            this.selectedSprite.alpha = 0.75;
            this.selectedX = this.selectedSprite.x; 
            this.selectedY = this.selectedSprite.y; 
        }
    }

    attackTick()
    {
        // if(Math.abs(this.sprite.x - this.target.sprite.x) > (this.sprite.width) * this.range  || Math.abs(this.sprite.y - this.target.sprite.y) > (this.sprite.width) * this.range )
        if(this.x != this.attackSquare.x || this.y != attackSquare.y)
        {
            let attackCoords = this.Perseus.navigator.getCoords(this.attackSquare.x, this.attackSquare.y);
            this.move(attackCoords.x, attackCoords.y);
        } else{
            console.log(this.target);
            this.moving = false;
            if(this.cooldown > 0)
            {
                this.cooldown--;
            }else{
                if(this.sprite.x < this.target.sprite.x - (this.sprite.width / 2))
                {
                    this.sprite.animations.play('atk_right', true);
                }else{
                    this.sprite.animations.play('atk_left',true);

                }


                let targetDead = this.target.takeDamage(this.attk, this);
                console.log(targetDead);
                console.log(this);
                this.cooldown = 200 / this.attkSpeed;
                
                if(targetDead)
                {
                    this.attacking = false;
                    this.target = null;
                    this.sprite.animations.stop();
                }
            }
        }
    }

    gather(resource){
        this.gatherProgress = 0;
        this.moveTo(resource);
        this.gatherState = 1;
        this.lastResource = resource;
    }

    move(x,y){
        super.move(x,y);
        console.log(this.destx, this.desty);
    }

    moveTo(obj){
        console.log("moving to ", obj.sprite.x, " ", obj.sprite.y);
        this.move(obj.sprite.x+32, obj.sprite.y+32);
    }
    update(){
        super.update();
        // heading to resource node
        // console.log(this.gatherState);

        if (this.gatherState == 1){
            if (this.moving == false){
                this.gatherState = 2;
            }
        //gathering at node
        } if (this.gatherState == 2){
            if (this.gatherProgress < 150){
                this.gatherProgress += 1;
            } else {
                this.gatherState = 3;
                console.log('moving to fort');
                this.moveTo(this.findNearestFort());
            }
        // returning to fort
        } if (this.gatherState == 3){
            if (this.moving == false){
                if (this.lastResource.type == 'wood'){
                    this.Perseus.updateWood(10);
                } else {
                    this.Perseus.resources.gold += 10;
                }
                this.gather(this.lastResource);
            }
            //loop
        }

        if(this.placing)
        {

            let selectedSquare = this.Perseus.navigator.getSquare(this.game.input.activePointer.x, this.game.input.activePointer.y);
            let coords = this.Perseus.navigator.getCoords(selectedSquare.x, selectedSquare.y);
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

        if(this.building)
        {
            if(Math.abs(this.sprite.x - this.selectedX) > this.sprite.width || Math.abs(this.sprite.y - this.selectedY) > this.sprite.height)
            {

                this.move(this.selectedX, this.selectedY)
            } else {
                console.log(this.buildProgress);

                if(this.buildProgress > 1000)
                {

                    if(this.selectedBuilding == "Fort")
                    {
                        this.Perseus.objects.push(new Fort(this.faction, this.selectedSprite.x + 64, this.selectedSprite.y + 64, this.Perseus));
                    }
                    if(this.selectedBuilding == "Barracks")
                    {
                        this.Perseus.objects.push(new Barracks(this.faction, this.selectedSprite.x+64, this.selectedSprite.y+64, this.Perseus));
                    }
                    if(this.selectedBuilding == "ArcheryRange")
                    {
                        this.Perseus.objects.push(new ArcheryRange(this.faction, this.selectedSprite.x+64, this.selectedSprite.y+64, this.Perseus));
                    }
                    if(this.selectedBuilding == "WizardTower")
                    {
                        this.Perseus.objects.push(new WizardTower(this.faction, this.selectedSprite.x+64, this.selectedSprite.y+64, this.Perseus));
                    }
                    if(this.selectedBuilding == "Farm")
                    {
                        this.Perseus.objects.push(new Farm(this.faction, this.selectedSprite.x +64, this.selectedSprite.y +64, this.Perseus));
                    }
                    this.building = false;
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
