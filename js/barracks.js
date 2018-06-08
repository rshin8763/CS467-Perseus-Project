import {Building} from './building.js';
import {SwordInfantry} from './swordInfantry.js';
import {Pikeman} from './pikeman.js';
import {AI} from './ai.js';
import {Player} from './player.js';


class Barracks extends Building{


    constructor(faction, x,y,Perseus){
        super(faction, 200, x, y, Perseus);

        this.addSprite('barracks');
        this.SWORD = 1;
        this.PIKE = 2;
        this.buildSpeed = .25;
        this.type="Barracks";
        this.uiData = {
            commandList: {B:"Build"},
            buildList: {S: "Swordsperson", P: "Pikemen"}  
        };
        this.SwordInfantryCosts = {
            wood : 50,
            gold : 50
        };
        this.PikemanCosts = {
            wood : 60,
            gold : 90
        };
        this.faction = faction;
        this.Perseus = Perseus;
    }

    build(str){
        switch(str){
            case 'S':
                return this.buildSword();
            case 'P':
                return this.buildPike();
        }
    }

    buildSword()
    {
        if(!this.building)
        {
            if(this.Perseus.Player.playerWood >= this.SwordInfantryCosts.wood
                    && this.Perseus.Player.playerGold >= this.SwordInfantryCosts.gold)
            {
                this.building = true;
                this.current = this.SWORD;
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.SwordInfantryCosts.wood, this.SwordInfantryCosts.gold);
            } else {
                if(this.faction == 'human')
                    this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.SwordInfantryCosts.wood, this.SwordInfantryCosts.gold), 100, '#ff0000');   
            }
        }
    }

    buildPike()
    {
        if(!this.building)
        {
            if(this.Perseus.Player.playerWood >= this.PikemanCosts.wood
                    && this.Perseus.Player.playerGold >= this.PikemanCosts.gold)
            {
                this.building = true;
                this.current = this.PIKE;
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.PikemanCosts.wood, this.PikemanCosts.gold);
            } else {
                if(this.faction == 'human')
                    this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.PikemanCosts.wood, this.PikemanCosts.gold), 100, '#ff0000');   
            }
        }
    }

    update(){
        if(this.building)
        {
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress =0;
                let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
                    this.spawnUnit(coords.x, coords.y ,this.current);
                if(this.faction == 'orc') // update orc or player buildings count;
                {
                    this.Perseus.AI.UpdateAIBuildings(1, 'Barracks', this.Perseus.idCounter - 1);
                }
                else
                {
                }
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnUnit(x,y, unitType)
    {
        if(unitType == this.SWORD){
            this.Perseus.objects.push(new SwordInfantry(this.faction, x, y, this.Perseus));     
        }

        if(unitType == this.PIKE){
            this.Perseus.objects.push(new Pikeman(this.faction, x, y, this.Perseus));     

        }
    }

}  

export {Barracks}
