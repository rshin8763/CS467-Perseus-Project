import {Building} from './building.js';
import {Wizard} from './wizard.js';


class WizardTower extends Building{


    constructor(faction, x,y,Perseus){
        super(faction, 1000, x, y, Perseus);

        this.addSprite('wizardtower');
        this.SWORD = 1;
        this.PIKE = 2;
        this.ARCH = 3;
        this.buildSpeed = .25;
        this.type="Wizard Tower";
        this.WizardCosts = {
            wood : 0,
            gold : 200
        }
    }

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
            //TODO:  Move logic inside loop once resources are available
            // if(this.Perseus.resources.wood > this.WizardCosts.wood
            //     && this.Persesus.resources.gold > this.WizardCosts.gold)
            //     {
            //     }
      
            this.building = true;
            this.current = 'Wizard';
            this.buildProgress = 0;
        }
    }

    update(){
        if(this.building)
        {
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

        let coords = this.Perseus.navigator.getCoords(this.x + 4,this.y +4)
        this.Perseus.objects.push(new Wizard(this.faction, coords.x, coords.y , this.Perseus));      
        
    }

}  

export {WizardTower}
