// import {SwordInfantry} from './swordInfantry.js';
// import {Archer} from './archer.js';
// import {mapRenderer} from './mapRenderer.js';
// import {Controller} from './controller.js';
// import {Fort} from './fort.js';
// import {Tree} from './tree.js';
// import {Navigator} from './navigator.js';
// import {Worker} from './worker.js';
// import {Barracks} from './barracks.js';


/**** GLOBALS *****/
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};
var goldText, woodText, healthText, menuBar, fortText, barracksText, towerText;
/******************/

class Player
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR
	constructor(Perseus)
	{
		// GENERAL
		this.Perseus = Perseus;
		
		// RESOURCES
        // TODO change these later, for testing
		this.playerGold = 10000;
		this.playerWood = 1000;

		// UNITS
		this.playerWorkers = 0;
		this.playerPikemen = 0;
		this.playerSwordInfantry = 0;
		this.playerArchers = 0;

		// BUILDINGS
		this.playerForts = 0;
		this.playerBarracks = 0;
		this.playerTowers = 0;
		this.playerAllBuildings = 0;
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
		console.log("Forts: " + this.playerForts);
		console.log("Barracks: " + this.playerBarracks);
		console.log("All Buildings: " + this.playerAllBuildings);
	}


	/*-----------------------------------------------------------------------*/
	// 	UPDATES RESOURCES AND COUNT DISPLAY - TAKES NUMBER AND TYPE
	UpdatePlayerResources(x, type)
	{
		if (type == 'wood' || type == 'Wood')
		{
			this.playerWood = this.playerWood + x;
			type = 'wood';
			this.Perseus.updateText(type);
			if (this.playerWood >= 40)
			{
				// ASK USER IF WANTS TO BUILD FORT
			}
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.playerGold = this.playerGold + x;
			//goldText.text = 'Gold: ' + this.playerGold;
			if (this.playerGold >= 50)
			{
				// ASK USER IF WANTS TO BUILD BARRACKS
			}
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
			this.playerSwordInfantry = this.playerSwordInfantry + x;
			console.log("Player has " + this.playerSwordInfantry + " swordsmen");
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
		// ERROR HANDLING IF PLAYER DOESNT HAVE ENOUGH RESOURCES

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
			if (x == 1) // ERROR HANDLING: NOT ENOUGH RESOURCES FOR BUILD
			{
				if (this.playerWood < 30)
				{
					console.log("Player does not have enough resources.");
					return false;
				}
				else
				{
					this.UpdatePlayerResources(-30, 'wood');
				}
			}
			this.playerForts = this.playerForts + x;
		}
		else if (type == 'barracks' || type == 'Barracks')
		{
			if (x == 1)
			{
				if (this.playerGold < 50) 
				{
					console.log("Player does not have enough resources.");
					return false;
				}
				else
				{
					this.UpdatePlayerResources(-50, 'gold');
				}
			}
			this.playerBarracks = this.playerBarracks + x;
			barracksText.text = 'Barracks: ' + this.playerBarracks;
// IF BARRACKS ADDED, DO ARCHERS, SWORDSMEN, ETC AUTOMATICALLY SPAWN?????????
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
			this.Perseus.gameState.GameOver();
		}
	}

	/*-----------------------------------------------------------------------*/
	// ADDS STARTING WORKER AND FORT - TAKES AND RETURNS NOTHING
	AddStartingSprites()
	{
		this.playerWood = 10030;
		this.UpdatePlayerBuildings(1, 'Fort');
	}

	/*-----------------------------------------------------------------------*/
	// MAIN FUNCTION FOR CALLING FUNCTIONS OUT OF TYPED ORDER :)
	Main()
	{

	    this.AddStartingSprites();
	    //this.GetPlayerStats();
	}
}

export {Player};
