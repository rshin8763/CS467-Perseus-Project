import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {Fort} from './fort.js';
import {Worker} from './worker.js';
import {Pikeman} from './pikeman.js';
import {WizardTower} from './wizardtower.js';
import {Wizard} from './wizard.js';
import {Barracks} from './barracks.js';


/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/

var MyBuildings = [];
	//	Building = {
	//		idNumber:
	//		kind:
	//	};

var MyUnits = [];
	// 	Unit = {
	//		idNumber:
	//		kind:
	//	};
var buildSpotX = 450, buildSpotY = 50, buildChanger = 150;
var spawnSpotX = 300, spawnSpotY = 200, spawnChanger = 50;
var objects, resources;
var freebie = true;

// BUILDING COSTS
var FortCosts = {
	wood: 100,
	gold: 0
};
var BarracksCosts = {
	wood: 100,
	gold: 100
};
var WizardTowerCosts = {
	wood: 200,
	gold: 200
};

// UNIT COSTS
var WorkerCost = {
	wood: 50,
	gold: 0
};
var ArcherCost = {
	wood: 50,
	gold: 10
};
var PikemanCost = {
	gold: 10,
	wood: 0
};
var SwordInfantryCost = {
	wood: 30,
	gold: 30
};
var WizardCost = {
	wood: 0,
	gold: 70
};

class Player
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR
	constructor(Perseus)
	{
		// GENERAL
		this.Perseus = Perseus;
		this.objects = this.Perseus.objects;
		this.resources = this.Perseus.resources;
		
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

/*****************************************************************************/
							// RESOURCES // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	UpdateResources(x, type)
	{
		if (type == 'wood' || type == 'Wood')
		{
			this.playerWood = this.playerWood + x;
			//this.Perseus.updateText(type);
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.playerGold = this.playerGold + x;
			//this.Perseus.updateText(type);
		}
		else
		{
			console.log("You tried to update the Player Resources and failed.");
			return false;
		}
		
	}

	/*-----------------------------------------------------------------------*/
	CheckFunds(type)
	{
		// FORT
		if (type == 'Fort' || type == 'fort')
		{
			if (this.playerWood >= FortCosts.wood)
			{
				if(this.playerGold >= FortCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			if (this.playerWood >= BarracksCosts.wood)
			{
				if(this.playerGold >= BarracksCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			if (this.playerWood >= WizardTowerCosts.wood)
			{
				if(this.playerGold >= WizardTowerCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WORKER
		else if (type == 'worker' || type == 'Worker')
		{
			if (this.playerWood >= WorkerCost.wood)
			{
				if(this.playerGold >= WorkerCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// ARCHER
		else if (type == 'archer' || type == 'Archer')
		{
			if (this.playerWood >= ArcherCost.wood)
			{
				if(this.playerGold >= ArcherCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// SWORDINFANTRY
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			if (this.playerWood >= SwordInfantryCost.wood)
			{
				if(this.playerGold >= SwordInfantryCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// PIKEMAN
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			if (this.playerWood >= PikemanCost.wood)
			{
				if(this.playerGold >= PikemanCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			if (this.playerWood >= WizardCost.wood)
			{
				if(this.playerGold >= WizardCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to measure your funds and failed.");
			return false;
		}
	}

/*****************************************************************************/
							// BUILDINGS // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	AddBuilding(type)
	{
		var idNumb = this.Perseus.idCounter;
		// FORT - SPROUTS BUILDING + 2 WORKERS - COSTS 50 WOOD
		if (type == 'Fort' || type == 'fort')
		{
			// UPDATE BUILDINGS
			this.Perseus.objects.push(
				new Fort('human', buildSpotX, buildSpotY, this.Perseus));
			this.playerForts++;
			this.AddBuildingtoArray(type, idNumb);

			// UPDATE RESOURCES & ADD WORKERS
			this.AddUnit('worker');
			this.UpdateResources(-FortCosts.wood, 'wood');
			this.UpdateResources(-FortCosts.gold, 'gold');
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			this.Perseus.objects.push(
				new Barracks('human', buildSpotX, buildSpotY, this.Perseus));
			this.playerBarracks++;
			this.AddBuildingtoArray(type, idNumb);

			// UPDATE RESOURCES + ADD TWO ARCHERS, 1 PIKEMAN, & 1 SWORDINFANTRY
			this.AddUnit('Archer');
			this.AddUnit('Archer');
			this.AddUnit('pikeman');
			this.AddUnit('SwordInfantry');
			this.UpdateResources(-BarracksCosts.wood, 'wood');
			this.UpdateResources(-BarracksCosts.gold, 'gold');
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			this.Perseus.objects.push(
				new WizardTower('human', buildSpotX, buildSpotY, this.Perseus));
			this.playerTowers++;
			this.AddBuildingtoArray(type, idNumb);

			// UPDATE RESOURCES + ADD TWO WIZARDS
			this.AddUnit('Wizard');
			this.AddUnit('Wizard');
			this.UpdateResources(-WizardTowerCosts.wood, 'wood');
			this.UpdateResources(-WizardTowerCosts.gold, 'gold');
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to add a building and failed.");
			return false;
		}
		this.playerAllBuildings++;
		buildSpotY += 100;
		buildSpotX += 100;
		return idNumb;
	}

	/*-----------------------------------------------------------------------*/
	DeleteBuilding(tag)
	{
		var x = 0, y;
		// SORT THROUGH ARRAY & FIND MATCHING ID - UPDATE VALUES
		for(x = 0; x < MyBuildings.length; x++)
		{
			if(MyBuildings[x].idNumber == tag)
			{
				var type = MyBuildings[x].kind;
				if (type == 'Fort' || type == 'fort')
				{
					this.playerForts--;
				}

				else if (type == 'Barracks' || type == 'barracks')
				{
					this.playerBarracks--;
				}
				else
				{
					this.playerTowers--;
				}
				this.playerAllBuildings--;

				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < MyBuildings.length)
				{
					if (x == (MyBuildings.length - 1)) // IS LAST ONE
					{
						MyBuildings.pop();
					}
					else
					{
						MyBuildings[x].kind = MyBuildings[x+1].kind;
						for (y = 0; y < 5; y++)
						{
							MyBuildings[x].corner[y] = MyBuildings[x+1].corner[y];
						}
						MyBuildings[x].idNumber = MyBuildings[x+1].idNumber;
					}
					x++;
				}
			}
		}
		// CHECK TO SEE IF ITS A GAME OVER
		if (MyBuildings.length <= 0)
		{
			//console.log("Game over!");
		}
	}

	AddBuildingtoArray(type, idNumb)
	{
		var thisBuilding = {
			idNumber: idNumb,
			kind: type			
		};
		MyBuildings.push(thisBuilding);
	}

/*****************************************************************************/
							// UNITS // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	AddUnit(type)
	{
		var Soldier, thisWorker, thisUnit;
		var tag = this.Perseus.idCounter;

		// WORKER - TWO WORKERS : ONE MINES GOLD, OTHER CHOPS WOOD
		if (type == 'worker' || type == 'Worker')
		{
			// WOOD CHOPPER - ADD TO MYWORKERS
			this.Perseus.objects.push(
				new Worker('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerWorkers++;
			
			// ADD TO MYUNITS
			thisUnit = {
				idNumber: tag,
				kind: 'worker'
			};
			MyUnits.push(thisUnit);
			spawnSpotY += 70;

			// GOLD MINER - ADD TO MYWORKERS
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Worker('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerWorkers++;

			// ADD TO MYUNITS
			thisUnit = {
				idNumber: tag,
				kind: 'worker'
			};
			MyUnits.push(thisUnit);

			this.UpdateResources(-WorkerCost.wood, 'wood');
			this.UpdateResources(-WorkerCost.gold, 'gold');
		}

		// ARCHER - GUARDS BUILDINGS
		else if (type == 'archer' || type == 'Archer')
		{
			this.Perseus.objects.push(
				new Archer('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerArchers++;

			// ADD TO MY UNITS
			thisUnit = {
				idNumber: tag,
				kind: 'archer'
			};
			MyUnits.push(thisUnit);

			// UPDATE RESOURCES
			this.UpdateResources(-ArcherCost.wood, 'wood');
			this.UpdateResources(-ArcherCost.gold, 'gold');
		}

		// SWORDINFANTRY - ATTACKS THE INNOCENT
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			this.Perseus.objects.push(
				new SwordInfantry('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerSwordInfantry++;

			// ADD TO MY UNITS
			thisUnit = {
				idNumber: tag,
				kind: 'swordInfantry'
			};
			MyUnits.push(thisUnit);
			
			// UPDATE RESOURCES
			this.UpdateResources(-SwordInfantryCost.wood, 'wood');
			this.UpdateResources(-SwordInfantryCost.gold, 'gold');
		}

		// PIKEMAN - ATTACKS THE ARMED
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			this.Perseus.objects.push(
				new Pikeman('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerPikemen++;

			thisUnit = {
				idNumber: tag,
				kind: 'pikeman'
			};
			MyUnits.push(thisUnit);

			// UPDATE RESOURCES
			this.UpdateResources(-PikemanCost.wood, 'wood');
			this.UpdateResources(-PikemanCost.gold, 'gold');
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			this.Perseus.objects.push(
				new Wizard('human', spawnSpotX, spawnSpotY, this.Perseus));
			this.playerWizards++;

			// ADD TO MY UNITS
			thisUnit = {
				idNumber: tag,
				kind: 'wizard'
			};
			MyUnits.push(thisUnit);

			// UPDATE RESOURCES
			this.UpdateResources(-WizardCost.wood, 'wood');
			this.UpdateResources(-WizardCost.gold, 'gold');
		}
		else
		{
			console.log("You tried to Add a Unit to an Array and failed.");
			return false;
		}
		spawnSpotY += 70;
		return tag;
	}

	/*-----------------------------------------------------------------------*/
	DeleteUnit(tag)
	{
		// SORT THROUGH ARRAY & FIND MATCHING ID - UPDATE VALUES
		for(var x = 0; x < MyUnits.length; x++)
		{
			if(MyUnits[x].idNumber == tag)
			{
				var type = MyUnits[x].kind;

				// WORKER
				if (type == 'worker' || type == 'Worker')
				{
					this.playerWorkers--;
				}

				// ARCHER
				else if (type == 'archer' || type == 'Archer')
				{
					this.playerArchers--;
				}

				// SWORDINFANTRY
				else if (type == 'swordInfantry' || type == 'SwordInfantry')
				{
					this.playerSwordInfantry--;
				}

				// PIKEMAN
				else if (type == 'pikeman' || type == 'Pikeman')
				{
					this.playerPikemen--;
				}

				// WIZARDS
				else if (type == 'wizard' || type == 'Wizard')
				{
					this.playerWizards--;
				}

				// ERROR HANDLING
				else
				{
					console.log("Error in trying to delete unit.");
					return false;
				}

				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < MyUnits.length)
				{
					if (x == (MyUnits.length - 1)) // IS LAST ONE
					{
						MyUnits.pop();
					}
					else
					{
						MyUnits[x].kind = MyUnits[x+1].kind;
						MyUnits[x].idNumber = MyUnits[x+1].idNumber;
					}
					x++;
				}
			}
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

	/*-----------------------------------------------------------------------*/
	Main()
	{
	    //this.AddBuilding('Fort');
		//this.AddBuilding('Barracks');
		//this.AddBuilding('Wizard Tower');

		//this.AddUnit('Worker');
		//this.AddUnit('Archer');
		//this.AddUnit('Pikeman');
		//this.AddUnit('SwordInfantry');
		//this.AddUnit('Wizard');
	}
}

export {Player};
