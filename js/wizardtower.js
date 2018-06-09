import {Building} from './building.js';
import {Wizard} from './wizard.js';

/****************
 * Wizard Tower Building
 *
 **************/
class WizardTower extends Building{


    constructor(faction, x,y,Perseus){
        //Call Building Constructor
        super(faction, 600, x, y, Perseus);

        //Create Sprite
        this.addSprite('wizardtower');
        
        this.buildSpeed = .25;
        this.type="Wizard Tower";

        this.uiData = {
            commandList: {B:"Build"},
            buildList: {W: "Wizard"}  
        };

        this.WizardCosts = {
            wood : 0,
            gold : 200
        }
    }

    //Control API function
    build(str){
        switch(str){
            case 'W':
                return this.buildWizard();
        }
    }


    buildWizard()
    {
        if(!this.building)
        {
            //Start building a wizard if there are enough resources
            if(this.Perseus.Player.playerWood >= this.WizardCosts.wood
                    && this.Perseus.Player.playerGold >= this.WizardCosts.gold)
            {
                this.building = true;
                this.current = 'Wizard';
                this.buildProgress = 0;
                this.Perseus.Player.reduceResources(this.WizardCosts.wood, this.WizardCosts.gold);
            }

        } else {
            if(this.faction == 'human')
                this.Perseus.prompter.drawToScreen(this.createResourceCostMsg(this.WizardCosts.wood, this.WizardCosts.gold), 100, '#ff0000');   
        }
    }

    update(){
        if(this.building)
        {
            //Increment building or spawn wizard if build is complete
            if(this.buildProgress >= 100)
            {
                this.building = false;
                this.buildProgress =0;
                this.spawnWizard();
            } else {
                this.buildProgress += this.buildSpeed;
            }
        }
    }

    spawnWizard()
    {
        //Create a Wizard object and push it to the objects array
        let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
           new Wizard(this.faction, coords.x, coords.y , this.Perseus);      

    }
}  
export {WizardTower}
