import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Worker} from './worker.js';
import {Barracks} from './barracks.js';


/**** GLOBALS *****/
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};
var goldText, woodText, healthText, menuBar, fortText, barracksText;
/******************/

class Player
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR
	constructor(Perseus)
	{
		// GENERAL
		this.Perseus = Perseus;
		this.health = 0;
		
		// RESOURCES
		this.playerGold = 0;
		this.playerWood = 0;

		// UNITS
		this.playerWorkers = 0;
		this.playerPikemen = 0;
		this.playerSwordsInfantry = 0;
		this.playerArchers = 0;
		this.playerHealth = 0;

		// BUILDINGS
		this.playerForts = 0;
		this.playerBarracks = 0;
		this.playerAllBuildings = 0;
	}

	/*-----------------------------------------------------------------------*/
	// 	UPDATES RESOURCES AND COUNT DISPLAY - TAKES NUMBER AND TYPE
	UpdatePlayerResources(x, type)
	{
		if (type == 'wood' || type == 'Wood')
		{
			this.wood = this.wood + x;
			woodText.text = 'Wood: ' + this.wood;
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.playerGold = this.playerGold + x;
			goldText.text = 'Gold: ' + this.playerGold;
		}
		else
		{
			console.log("You entered an invalid type: " + type);
			return false;
		}
		
	}

	/*-----------------------------------------------------------------------*/
	// UPDATES WORKER COUNT DISPLAY - TAKES NUMBER AND TYPE
	UpdatePlayerUnits(x, type)
	{
		if (type == 'worker' || type == 'Worker')
		{
			this.playerWorkers = this.playerWorkers + x;
			console.log("Player has " + this.playerWorkers + " workers");
		}
		else if (type == 'swordsman' || type == 'Swordsman')
		{
			this.playerSwordsInfantry = this.playerSwordsInfantry + x;
			console.log("Player has " + this.playerSwordsInfantry + " swordsmen");
		}
		else if (type == 'archer' || type == 'Archer')
		{
			this.playerArchers = this.playerArchers + x;
			console.log("Player has " + this.playerArchers + " archers");
		}
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			this.playerPikemen = this.playerPikemen + x;
			console.log("Player has " + this.playerPikemen + " pikemen");
		}
		else
		{
			console.log("You entered an invalid type: " + type);
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	// UPDATES BUILDINGS COUNT  - TAKES NUMBER AND TYPE
	UpdatePlayerBuildings(x, type)
	{
		// ADDS OR DETRACTS HEALTH POINTS BASED ON GAINING OR LOSING A BUILDING
		var healthCount, workerCount;
		if (x == 1)
		{
			workerCount = 1;
		}
		else
		{
			workerCount = 0;
		}

		// ADDS X TO CURRENT COUNT OF FORTS AND BARRACKS; UPDATES HEALTH
		if(type == 'Fort' || type == 'fort')
		{
			this.playerForts = this.playerForts + x;
			this.playerWorkers = this.playerWorkers + workerCount;
			fortText.text = 'Forts: ' + this.playerForts;
		}
		else if (type == 'barracks' || type == 'Barracks')
		{
			this.playerBarracks = this.playerBarracks + x;
			barracksText.text = 'Barracks: ' + this.playerBarracks;
		}
		else
		{
			console.log("You entered an invalid type: " + type);
			return false;
		}

		this.playerAllBuildings = this.playerAllBuildings + x;

		// CHECKS TO SEE IF ANY BUILDINGS LEFT; IF NOT, GAME ENDS
		if(this.playerAllBuildings <= 0)
		{
			// GO TO GAME OVER IN GAMESTATE CLASS
		}
	}

	/*-----------------------------------------------------------------------*/
	// ADDS STARTING WORKER AND FORT - TAKES AND RETURNS NOTHING
	AddStartingSprites()
	{
		// ADD ONE FORT AND ONE WORKER
		this.Perseus.objects.push(new Fort('human', 340, 300, this.Perseus));
		this.Perseus.objects.push(new Worker('human', 300, 350, this.Perseus));
		this.UpdatePlayerBuildings(1, 'Fort');
	}

	/*-----------------------------------------------------------------------*/
	// MAIN FUNCTION FOR CALLING FUNCTIONS OUT OF TYPED ORDER :)
	Main()
	{
		// MENU BAR
	    menuBar = this.Perseus.game.add.sprite(0, 0, 'menuBar'); // ADD MENU
    	menuBar.fixedToCamera = true;
    	menuBar.cameraOffset.setTo(0, 0);
	    menuBar.fixedToCamera = true;
   		menuBar.cameraOffset.setTo(0, 0);

		// GOLD COUNT DISPLAY
	    goldText = this.Perseus.game.add.text(0, 0, 'Gold: ' + this.playerGold,
	     style);
	    goldText.fixedToCamera = true;
	    goldText.cameraOffset.setTo(200, 0);
	    
	    // WOOD COUNT DISPLAY
	    woodText = this.Perseus.game.add.text(0, 0, 'Wood: ' + this.playerWood,
	     style);
    	woodText.fixedToCamera = true;
    	woodText.cameraOffset.setTo(300, 0);

    	// FORT COUNT DISPLAY
    	fortText = this.Perseus.game.add.text(0, 0,
    	 'Forts: ' + this.playerForts, style);
	    fortText.fixedToCamera = true;
	    fortText.cameraOffset.setTo(400, 0);

	    // BARRACKS COUNT DISPLAY
    	barracksText = this.Perseus.game.add.text(0, 0,
    	 'Barracks: ' + this.playerForts, style);
	    barracksText.fixedToCamera = true;
	    barracksText.cameraOffset.setTo(500, 0);

	    this.AddStartingSprites();
	}
}

export {Player};