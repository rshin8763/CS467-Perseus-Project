import {Unit} from './unit.js';
import {Building} from './building.js';
import {Worker} from './worker.js';
import {Fort} from './fort.js'

class Player
{
    /*-----------------------------------------------------------------------*/
    // GAME CONSTRUCTOR
    constructor(Perseus)
    {
        // GENERAL
        this.Perseus = Perseus;
        // this.objects = this.Perseus.objects;
        // this.resources = this.Perseus.resources;

        this.units = [];
        this.buildings = [];

        // RESOURCES
        // TODO change these later, for testing
        this.playerGold = 0;
        this.playerWood = 0;

        // UNITS
        this.playerWorkers = 0;
        this.playerPikemen = 0;
        this.playerSwordInfantry = 0;
        this.playerArchers = 0;
        this.playerWizards = 0;

        // BUILDINGS
        this.playerForts = 0;
        this.playerBarracks = 0;
        this.playerTowers = 0;
        this.playerAllBuildings = 0;
    }

    hasLost(){
        if (this.buildings.length == 0) return true;
        else return false;
    }

    reduceResources(woodcost, goldcost){
        this.playerWood -= woodcost;
        this.playerGold -= goldcost;

        console.log(this.playerWood);

        this.Perseus.ui.updateText('wood');
        this.Perseus.ui.updateText('gold');
    }

    addObject(obj){
        if (obj instanceof Unit){
            this.units.push(obj);
            let type = obj.id;
            switch (type){
                case 'pikeman':
                    this.playerPikemen++;
                case 'worker':
                    this.playerWorkers++;
                    break;
                case 'swordsman':
                    this.playerSwordInfantry++;
                    break;
                case 'archer':
                    this.playerArchers++;
                    break;
                case 'wizard':
                    this.playerWizards++;
                    break;
            }
        }
        if (obj instanceof Building){
            this.buildings.push(obj);
            let type = obj.type;
            switch (type){
                case 'Fort':
                    this.playerForts++;
                    break;
                case 'Wizard Tower':
                    this.playerTowers++;
                    break;
                case 'Barracks':
                    this.playerBarracks++;
                    break;
                case 'Archery Range':
                    //add archery range
                    break;
            }
        }
    }

    removeObject(obj){
        if (obj instanceof Unit){
            let index = this.units.indexOf(obj);
            this.units.splice(index, 1);

            let type = obj.id;
            switch (type){
                case 'pikeman':
                    this.playerPikemen--;
                case 'worker':
                    this.playerWorkers--;
                    break;
                case 'swordsman':
                    this.playerSwordInfantry--;
                    break;
                case 'archer':
                    this.playerArchers--;
                    break;
                case 'wizard':
                    this.playerWizards--;
                    break;
            }
        }
        if (obj instanceof Building){
            this.buildings.remove(obj);
            let type = obj.type;
            switch (type){
                case 'Fort':
                    this.playerForts--;
                    break;
                case 'Wizard Tower':
                    this.playerTowers--;
                    break;
                case 'Barracks':
                    this.playerBarracks--;
                    break;
                case 'Archery Range':
                    //remove archery range
                    break;
            }
        }
    }



    // /*****************************************************************************/
    // 							// RESOURCES // 
    // /*****************************************************************************/

    // 	/*-----------------------------------------------------------------------*/
    UpdateStock(x, type)
    {
        if (type == 'wood' || type == 'Wood')
        {
            this.playerWood = this.playerWood + x;
            this.Perseus.ui.updateText(type);
        }
        else if (type == 'gold' || type == 'Gold')
        {
            this.playerGold = this.playerGold + x;
            this.Perseus.ui.updateText(type);
        }
        else
        {
            console.log("You tried to update the Player Resources and failed.");
            return false;
        }

    }

    /*****************************************************************************/
    // DEBUGGING // 
    /*****************************************************************************/

    /*-----------------------------------------------------------------------*/
    printArrays()
    {
        console.log("Buildings --------------");
        for(var m = 0; m < MyBuildings.length; m++)
        {
            console.log(" Array Index: " + m);
            console.log("id: " + MyBuildings[m].idNumber);
            console.log("kind: " + MyBuildings[m].kind);
        }

        console.log("Units --------------");
        for(m = 0; m < MyUnits.length; m++)
        {

            console.log("Array Index: " + m);
            console.log("id: " + MyUnits[m].idNumber);
            console.log("kind: " + MyUnits[m].kind);
        }

        console.log("Resources --------------");
        for (var x = 0; x < MyResources.length; x++)
        {
            console.log("Index: " + x);
            console.log("idNumber: " + MyResources[x].idNumber);
            console.log("type: " + MyResources[x].kind);
            console.log("depleated: " + MyResources[x].depleated);
            console.log("xCoor: " + MyResources[x].xCoor);
            console.log("yCoor: " + MyResources[x].yCoor);
        }
    }

    /*-----------------------------------------------------------------------*/
    // 	RETREIVES PLAYER STATISTICS
    GetPlayerStats()
    {
        console.log("Current Amounts for Player 1");
        console.log("Gold: " + this.playerGold);
        console.log("Wood: " + this.playerWood);
        console.log("Workers: " + this.playerWorkers);
        console.log("Pikemen: " + this.playerPikemen);
        console.log("Swordsman: " + this.playerSwordInfantry);
        console.log("Archers: " + this.playerArchers);
        console.log("Wizards: " + this.playerWizards);
        console.log("Forts: " + this.playerForts);
        console.log("Barracks: " + this.playerBarracks);
        console.log("Wizard Towers: " + this.playerTowers);
        console.log("All Buildings: " + this.playerAllBuildings);
    }

    /*****************************************************************************/
    // MAIN // 
    /*****************************************************************************/

    ///*-----------------------------------------------------------------------*/
    EasyMode()
    {
        let worker1 = new Worker ('human', 800, 350, this.Perseus);
        this.addObject(worker1);
        let worker2 = new Worker ('human', 700, 350, this.Perseus);
        this.addObject(worker2);
        let fort1 = new Fort('human', 650, 100, this.Perseus);
        this.addObject(fort1);
    }

    HardMode()
    {
        let worker2 = new Worker ('human', 700, 350, this.Perseus);
        this.addObject(worker2);
        let fort1 = new Fort('human', 650, 100, this.Perseus);
        this.addObject(fort1);
    }

    TestSaveMode()
    {
        let worker1 = new Worker ('human', 800, 350, this.Perseus);
        this.Perseus.objects.push(worker1);
        this.addObject(worker1);
        let worker2 = new Worker ('human', 700, 350, this.Perseus);
        this.Perseus.objects.push(worker2);
        this.addObject(worker2);
        let fort1 = new Fort('human', 650, 100, this.Perseus);
        this.Perseus.objects.push(fort1);
        this.addObject(fort1);
        let thisUnit = null;
        fort1 = new Fort('human', 700, 800, this.Perseus);
        this.addObject(fort1);
    }
}

export {Player};
