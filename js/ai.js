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
	//		kind: "type",
	//		corners: 1: true/false, 2: true/false, 3: true/false, 4: true/false,
	//		idNumber: object.tag
	//	};

var MyUnits = [];
	// 	Unit = {
	//		idNumber:
	//		kind:
	//		job:
	//	};
var MyWorkers = [];
	// 	Worker = {
	//		idNumber: "object.tag",
	// 		occupation: "mine" or "chop",
	// 		safe: true/false
	//	};

var Guards = [];
	// 	Soldier = {
	//		idNumber: "object.tag",
	// 		BuildingID: buildingArrayID,
	//		Corner: corner of building (1-4) = id of guard
	//		busy: true/false
	// 		safe: true/false
	//	};

var BorderPatrol = [];
	// 	Soldier = {
	//		idNumber: "object.tag",
	// 		busy: true/false,
	// 		safe: true/false
	//	};

var Army = [];
	// 	Soldier = {
	//		idNumber: "object.tag",
	//		kind: wizard or pikeman
	// 		Goal: either: 'worker', 'building', or 'army',
	//		busy: true/false,
	// 		safe: true/false,
	//		atWar: true/false
	//	};

var objects, resources, enemyHealthText;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};
var i = 0;
var number = 0;
var buildSpotX = 1000, buildSpotY = 1000, buildChanger = 150;
var spawnSpotX = 1070, spawnSpotY = 970, spawnChanger = 50;
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

class AI
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR 
	constructor(Perseus)
	{
		// GENERAL
		this.Perseus = Perseus;
		this.objects = this.Perseus.objects;
		this.resources = this.Perseus.resources;
		
		// RESOURCES
		this.AIGold = 0;
		this.AIWood = 0;

		// UNITS
		this.AIWorkers = 0;
		this.AIPikemen = 0;
		this.AISwordInfantry = 0;
		this.AIArchers = 0;
		this.AIWizards = 0;

		// BUILDINGS
		this.AIForts = 0;
		this.AIBarracks = 0;
		this.AITowers = 0;
		this.AIAllBuildings = 0;
	}

/*****************************************************************************/
							// RESOURCES // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	UpdateResources(x, type)
	{
		if (type == 'wood' || type == 'Wood')
		{
			this.AIWood += x;

		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.AIGold +=x;
		}
		else
		{
			console.log("You tried to update the AI Resources and failed.");
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	CheckFunds(type)
	{
		// FORT
		if (type == 'Fort' || type == 'fort')
		{
			if (this.AIWood >= FortCosts.wood)
			{
				if(this.AIGold >= FortCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			if (this.AIWood >= BarracksCosts.wood)
			{
				if(this.AIGold >= BarracksCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			if (this.AIWood >= WizardTowerCosts.wood)
			{
				if(this.AIGold >= WizardTowerCosts.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WORKER
		else if (type == 'worker' || type == 'Worker')
		{
			if (this.AIWood >= WorkerCost.wood)
			{
				if(this.AIGold >= WorkerCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// ARCHER
		else if (type == 'archer' || type == 'Archer')
		{
			if (this.AIWood >= ArcherCost.wood)
			{
				if(this.AIGold >= ArcherCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// SWORDINFANTRY
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			if (this.AIWood >= SwordInfantryCost.wood)
			{
				if(this.AIGold >= SwordInfantryCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// PIKEMAN
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			if (this.AIWood >= PikemanCost.wood)
			{
				if(this.AIGold >= PikemanCost.gold)
				{
					return true;
				}
			}
			return false;
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			if (this.AIWood >= WizardCost.wood)
			{
				if(this.AIGold >= WizardCost.gold)
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
				new Fort('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AIForts++;
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
				new Barracks('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AIBarracks++;
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
				new WizardTower('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AITowers++;
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
		this.AIAllBuildings++;
		this.Perseus.updateText('enemy');
		buildSpotY -= 100;
		buildSpotX -= 100;
		return idNumb;
	}

	/*-----------------------------------------------------------------------*/
	AddBuildingtoArray(type, idNumb)
	{
		var thisBuilding = {
			kind: type,
			corner: [-1, -1, -1, -1],
			idNumber: idNumb
		};
		MyBuildings.push(thisBuilding);
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
					this.AIForts--;
				}

				else if (type == 'Barracks' || type == 'barracks')
				{
					this.AIBarracks--;
				}
				else
				{
					this.AITowers--;
				}
				this.AIAllBuildings--;

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
		Perseus.updateText('enemy');
		// CHECK TO SEE IF ITS A GAME OVER
		if (MyBuildings.length <= 0)
		{
			//console.log("Game over!");
		}
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
				new Worker('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AIWorkers++;
			thisWorker = {
				idNumber: tag,
				occupation: 'chop',
				safe: true
			};
			MyWorkers.push(thisWorker);
			
			// ADD TO MYUNITS
			thisUnit = {
				idNumber: tag,
				kind: 'worker',
				job: 'harvest'
			};
			MyUnits.push(thisUnit);
			spawnSpotY -= 70;

			// GOLD MINER - ADD TO MYWORKERS
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Worker('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AIWorkers++;
			thisWorker = {
				idNumber: tag,
				occupation: 'mine',
				safe: true
			};
			MyWorkers.push(thisWorker);

			// ADD TO MYUNITS
			thisUnit = {
				idNumber: tag,
				kind: 'worker',
				job: 'Harvest'
			};
			MyUnits.push(thisUnit);

			this.UpdateResources(-WorkerCost.wood, 'wood');
			this.UpdateResources(-WorkerCost.gold, 'gold');
		}

		// ARCHER - GUARDS BUILDINGS
		else if (type == 'archer' || type == 'Archer')
		{
			this.Perseus.objects.push(
				new Archer('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AIArchers++;

			// ADD TO MY BUILDING PATROL
			Soldier = {
				idNumber: tag,
				BuildingID: -1,
				Corner: -1,
				busy: false,
				safe: true
			};
			Guards.push(Soldier);

			// ADD TO MY UNITS
			thisUnit = {
				idNumber: tag,
				kind: 'archer',
				job: 'Guard'
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
				new SwordInfantry('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AISwordInfantry++;
			Soldier = {
				idNumber: tag,
				safe: true,
				busy:false
			};

			BorderPatrol.push(Soldier);
			thisUnit = {
				idNumber: tag,
				kind: 'swordInfantry',
				job: 'Patrol'
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
				new Pikeman('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AIPikemen++;
			Soldier = {
				idNumber: tag,
				Goal: "army",
				kind: 'pikeman',
				busy: false,
				safe: true,
				atWar: false
			};
			Army.push(Soldier);

			thisUnit = {
				idNumber: tag,
				kind: 'pikeman',
				job: 'Warfare'
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
				new Wizard('orc', spawnSpotX, spawnSpotY, this.Perseus));
			this.AIWizards++;
			Soldier = {
				idNumber: tag,
				Goal: "building", 
				busy: false,
				kind: 'wizard',
				safe: true,
				atWar: false
			};
			Army.push(Soldier);
			thisUnit = {
				idNumber: tag,
				kind: 'wizard',
				job: 'Warfare'
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
		spawnSpotY -= 70;
		this.UpdateRoles();
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
					this.AIWorkers--;
				}

				// ARCHER
				else if (type == 'archer' || type == 'Archer')
				{
					this.AIArchers--;
				}

				// SWORDINFANTRY
				else if (type == 'swordInfantry' || type == 'SwordInfantry')
				{
					this.AISwordInfantry--;
				}

				// PIKEMAN
				else if (type == 'pikeman' || type == 'Pikeman')
				{
					this.AIPikemen--;
				}

				// WIZARDS
				else if (type == 'wizard' || type == 'Wizard')
				{
					this.AIWizards--;
				}

				// ERROR HANDLING
				else
				{
					console.log("Error in trying to delete unit. Type unidentifiable.");
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
						MyUnits[x].job = MyUnits[x+1].job;
						MyUnits[x].idNumber = MyUnits[x+1].idNumber;
					}
					x++;
				}
			}
		}

		// MYWORKERS 
		for(var x = 0; x < MyWorkers.length; x++)
		{
			if(MyWorkers[x].idNumber == tag)
			{
				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < MyWorkers.length)
				{
					if (x == (MyWorkers.length - 1)) // IS LAST ONE
					{
						MyWorkers.pop();
					}
					else
					{
						MyWorkers[x].safe = MyWorkers[x+1].safe;
						MyWorkers[x].occupation = MyWorkers[x+1].occupation;
						MyWorkers[x].idNumber = MyWorkers[x+1].idNumber;
					}
					x++;
				}
			}
		}

		// BORDER PATROL
		for(var x = 0; x < BorderPatrol.length; x++)
		{
			if(BorderPatrol[x].idNumber == tag)
			{
				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < BorderPatrol.length)
				{
					if (x == (BorderPatrol.length - 1)) // IS LAST ONE
					{
						BorderPatrol.pop();
					}
					else
					{
						BorderPatrol[x].safe = BorderPatrol[x+1].safe;
						BorderPatrol[x].idNumber = BorderPatrol[x+1].idNumber;
					}
					x++;
				}
			}
		}

		// BUILDING PATROL
		for(var x = 0; x < Guards.length; x++)
		{
			if(Guards[x].idNumber == tag)
			{
				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < Guards.length)
				{
					if (x == (Guards.length - 1)) // IS LAST ONE
					{
						Guards.pop();
					}
					else
					{
						Guards[x].Corner = Guards[x+1].Corner;
						Guards[x].BuildingID = Guards[x+1].BuildingID;
						Guards[x].idNumber = Guards[x+1].idNumber;
						Guards[x].busy = Guards[x+1].busy;
						Guards[x].safe = Guards[x+1].safe;
					}
					x++;
				}
			}
		}

		// ARMY
		for(var x = 0; x < Army.length; x++)
		{
			if(Army[x].idNumber == tag)
			{
				var type = Army[x].kind;
				// MOVE ALL DATA OVER ONE TO REPLACE BUILDING LOST
				while(x < Army.length)
				{
					if (x == (Army.length - 1)) // IS LAST ONE
					{
						Army.pop();
					}
					else
					{
						Army[x].atWar = Army[x+1].atWar;
						Army[x].safe = Army[x+1].safef;
						Army[x].idNumber = Army[x+1].idNumber;
						Army[x].Goal = Army[x+1].Goal;
					}
					x++;
				}
			}
		}
		this.UpdateRoles();
	}

/*****************************************************************************/
							// STRATEGY // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	UpdateRoles()
	{

	}

	/*-----------------------------------------------------------------------*/
	// 
	StationStandingArmy()
	{
		var thisObject = 0;
		for (thisObject in this.objects)
		{
			if(this.objects[thisObject].type == 'Archer')
			{
				if(this.objects[thisObject].faction == 'orc')
				{
					var	isOccupied = true;
					var allOccupied = false;
					var x = -1, y = 0, counter = 0;
					while(isOccupied == true && allOccupied == false)
					{
						counter + 1;
						x + 1;
						if (x == this.AIAllBuildings)
						{
							y + 1;
							x = 0;
							if (counter > (4 * this.AIAllBuildings))
							{
								allOccupied = true;
							}
						}
						isOccupied = this.CheckBuildingCorner(x, y);
					}
				}
				if (allOccupied == true)
				{
					// GuardBorder();
				}
				else
				{
					//GuardBuilding(x, y, );
				}
			}
		}
	}
	/*-----------------------------------------------------------------------*/
	OccupyCorner(x, y, idNumb)
	{

	}

	/*-----------------------------------------------------------------------*/
	update()
	{
		//this.CheckMissingID();
		
	}

	/*-----------------------------------------------------------------------*/

/*****************************************************************************/
							// DEBUGGING // 
/*****************************************************************************/
	
	/*-----------------------------------------------------------------------*/
	printArrays()
	{
		for(var m = 0; m < MyBuildings.length; m++)
		{
			console.log("Buildings --------------");
			console.log(" Array Location: " + m);
			console.log("id: " + MyBuildings[m].idNumber);
			console.log("kind: " + MyBuildings[m].kind);
			for (var s = 0; s < 4; s++)
			{
				console.log("corners: " + MyBuildings[m].corner[s]);
			}
		}

		for(m = 0; m < MyUnits.length; m++)
		{
			console.log("Units --------------");
			console.log("Array Location: " + m);
			console.log("id: " + MyUnits[m].idNumber);
			console.log("kind: " + MyUnits[m].kind);
			console.log("job: " + MyUnits[m].job);
		}

		for(m = 0; m < MyWorkers.length; m++)
		{
			console.log("Workers --------------");
			console.log("Array Location: " + m);
			console.log("id: " + MyWorkers[m].idNumber);
			console.log("occupation: " + MyWorkers[m].occupation);
			console.log("safe: " + MyWorkers[m].safe);
		}

		for(m = 0; m < Guards.length; m++)
		{
			console.log("Guards --------------");
			console.log("Array Location: " + m);
			console.log("id: " + Guards[m].idNumber);
			console.log("busy: " + Guards[m].busy);
			console.log("safe: " + Guards[m].safe);
		}

		for(m = 0; m < BorderPatrol.length; m++)
		{
			console.log("Patrol --------------");
			console.log("Array Location: " + m);
			console.log("id: " + BorderPatrol[m].idNumber);
			console.log("busy: " + BorderPatrol[m].busy);
			console.log("safe: " + BorderPatrol[m].safe);
		}

		for(m = 0; m < Army.length; m++)
		{
			console.log("Army --------------");
			console.log("Array Location: " + m);
			console.log("id: " + Army[m].idNumber);
			console.log("kind: " + Army[m].kind);
			console.log("Goal: " + Army[m].Goal);
			console.log("busy: " + Army[m].busy);
			console.log("safe: " + Army[m].safe);
			console.log("At War: " + Army[m].atWar);
		}

	}

	/*-----------------------------------------------------------------------*/
	GetAIStats()
	{
		console.log("Current Amounts for AI");
		console.log("Gold: " + this.AIGold);
		console.log("Wood: " + this.AIWood);
		console.log("Workers: " + this.AIWorkers);
		console.log("Pikemen: " + this.AIPikemen);
		console.log("Swordsman: " + this.AISwordInfantry);
		console.log("Wizards: " + this.AIWizards);
		console.log("Archers: " + this.AIArchers);
		console.log("Forts: " + this.AIForts);
		console.log("Barracks: " + this.AIBarracks);
		console.log("Wizard Towers: " + this.AITowers);
		console.log("All Buildings: " + this.AIAllBuildings);
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

export {AI};