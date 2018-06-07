import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {Fort} from './fort.js';
import {Worker} from './worker.js';
import {Pikeman} from './pikeman.js';
import {WizardTower} from './wizardtower.js';
import {Wizard} from './wizard.js';
import {Barracks} from './barracks.js';
import {ArcheryRange} from './archeryrange.js';

/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/
var MyResources = [];
	// Resource = {
	//		idNumber:
	//		type:
	//		depleated:
	//		xCoor:
	//		yCoor:
	//	};
// var this.MyBuildings = [];
	//	Building = {
	//		kind: "type",
	//		corners: 1: true/false, 2: true/false, 3: true/false, 4: true/false,
	//		idNumber: object.tag
	//	};

// var MyUnits = [];
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
var spawnSpotX = 1400, spawnSpotY = 1300, spawnChanger = 50;
var freebie = true;
var xBorder = 0, yBorder = 0;
var bordersSafe = true;
var timer = 100;

// BUILDING COSTS
var FortCosts = {
	wood: 100,
	gold: 0
};
var ArcheryRangeCosts = {
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
		this.AIArcheryRanges = 0;
		this.AIBarracks = 0;
		this.AITowers = 0;
		this.AIAllBuildings = 0;

		// ARRAYS
		this.MyBuildings = [];
		this.MyUnits = [];
		this.MyResources = [];
	}

/*****************************************************************************/
							// RESOURCES // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	// UPDATES CURRENT VALUES FOR AI GOLD & WOOD; CHECKS AGAINST GOALS
	UpdateStock(x, type)
	{
		var goal;
		var affordable;
		if (type == 'wood' || type == 'Wood')
		{
			this.AIWood += x;
			goal = this.CheckGoals();
			this.CheckFunds(goal);
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.AIGold +=x;
			goal = this.CheckGoals();
			this.CheckFunds(goal);
		}
		else
		{
			console.log("You tried to update the AI Resources and failed.");
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	GetNearestResource()
	{
		let closest = null;
        let min = Number.MAX_SAFE_INTEGER;
        for (var thisResource in this.resources)
        {
        	if (Math.hypot(1400-thisResource.x, 1400-thisResource.y) < min)
                {
                    min = Math.hypot(1400-thisResource.x, 1400-thisResource.y) < min;
                    closest = thisResource;
                }
        }
        console.log('found ' + closest);
        return closest;
	}	
/*****************************************************************************/
							// BUILDINGS // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	AddBuilding(type)
	{
		let thisBuilding = null;
		// FORT - SPROUTS BUILDING + 2 WORKERS - COSTS 50 WOOD
		if (type == 'Fort' || type == 'fort')
		{
			// UPDATE BUILDINGS
			thisBuilding = new Fort('orc', 1400, 1400, this.Perseus)
			this.AIForts++;

			// UPDATE RESOURCES & ADD WORKERS
			this.AddUnit('worker');
			this.AddUnit('worker');
			this.UpdateStock(-FortCosts.wood, 'wood');
			this.UpdateStock(-FortCosts.gold, 'gold');
		}

		// ARCHERY RANGE
		else if (type == 'Archery Range' || type == 'archery range')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new ArcheryRange('orc', 1400, 1500, this.Perseus);
			this.AIArcheryRanges++;

			// UPDATE RESOURCES + ADD TWO WIZARDS
			this.AddUnit('Archer');
			this.AddUnit('Archer');
			this.UpdateStock(-WizardTowerCosts.wood, 'wood');
			this.UpdateStock(-WizardTowerCosts.gold, 'gold');
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new Barracks('orc', 1500, 1400, this.Perseus);
			this.AIBarracks++;

			// UPDATE RESOURCES + ADD TWO ARCHERS, 1 PIKEMAN, & 1 SWORDINFANTRY
			this.AddUnit('pikeman');
			this.AddUnit('SwordInfantry');
			this.UpdateStock(-BarracksCosts.wood, 'wood');
			this.UpdateStock(-BarracksCosts.gold, 'gold');
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new WizardTower('orc', 1200, 1400, this.Perseus);
			this.AITowers++;

			// UPDATE RESOURCES + ADD TWO WIZARDS
			this.AddUnit('Wizard');
			this.AddUnit('Wizard');
			this.UpdateStock(-WizardTowerCosts.wood, 'wood');
			this.UpdateStock(-WizardTowerCosts.gold, 'gold');
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to add a building and failed.");
			return false;
		}
		this.AIAllBuildings++;
		this.Perseus.objects.push(thisBuilding);
		this.MyBuildings.push(thisBuilding);
		//this.Perseus.updateText('Enemy');
		return thisBuilding.tag;
	}

	/*-----------------------------------------------------------------------*/
	DeleteBuilding(obj)
	{
		var type = obj.type;
		for (let i = 0; i < this.MyUnits.length; i++)
		{
			if (this.MyUnits[i] == obj)
			{
				this.MyUnits.splice(i, 1);
			}
		}
		if (type == 'Fort' || type == 'fort')
		{
			this.AIForts--;
		}
		else if (type == 'Barracks' || type == 'barracks')
		{
			this.AIBarracks--;
		}
		else if (type == 'Archery Range' || type == 'archery range')
		{
			this.AIArcheryRanges--;
		}
		else
		{
			this.AITowers--;
		}
		this.AIAllBuildings--;
		// CHECK TO SEE IF ITS A GAME OVER
		if (this.AIAllBuildings <= 0)
		{
			//console.log("Game over!");
		}
	}

/*****************************************************************************/
							// UNITS // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	// CREATES UNIT AND ADDS TO OBJECTS AND MYUNITS ARRAY
	// UPDATES CORRESPONDING COSTS
	AddUnit(type)
	{
		var Soldier, thisWorker, thisUnit;
		var thisUnit = null;
		
		// WORKER 
		if (type == 'worker' || type == 'Worker')
		{
			thisUnit = new Worker('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIWorkers++;
			this.UpdateStock(-WorkerCost.wood, 'wood');
			this.UpdateStock(-WorkerCost.gold, 'gold');
		}

		// ARCHER 
		else if (type == 'archer' || type == 'Archer')
		{
			thisUnit = new Archer('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIArchers++;
			this.UpdateStock(-ArcherCost.wood, 'wood');
			this.UpdateStock(-ArcherCost.gold, 'gold');
		}

		// SWORDINFANTRY 
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			thisUnit = new SwordInfantry('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AISwordInfantry++;
			this.UpdateStock(-SwordInfantryCost.wood, 'wood');
			this.UpdateStock(-SwordInfantryCost.gold, 'gold');
		}

		// PIKEMAN - ATTACKS THE ARMED
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			thisUnit = new Pikeman('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIPikemen++;
			this.UpdateStock(-PikemanCost.wood, 'wood');
			this.UpdateStock(-PikemanCost.gold, 'gold');
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			thisUnit = new Wizard('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIWizards++;
			this.UpdateStock(-WizardCost.wood, 'wood');
			this.UpdateStock(-WizardCost.gold, 'gold');
		}
		else
		{
			console.log("You tried to Add a Unit to an Array and failed.");
			return false;
		}

		// ADDS TO BOTH GLOBAL AND AI ARRAYS, THEN UPDATES ROLES
		this.MyUnits.push(thisUnit);
		this.Perseus.objects.push(thisUnit);
		this.UpdateRoles();
	}

	/*-----------------------------------------------------------------------*/
	DeleteUnit(obj)
	{
		var type = obj.type;
		for (let i = 0; i < this.MyUnits.length; i++)
		{
			if (this.MyUnits[i] == obj)
			{
				this.MyUnits.splice(i, 1);
			}
		}
			
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
		this.UpdateRoles();
	}

/*****************************************************************************/
							// STRATEGY // 
/*****************************************************************************/
	
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
							// WORKERS //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CONTINUALLY GATHER RESOURCES, EVERY TIME CHECKING CURRENT GOAL AND FUNDS
	/*-----------------------------------------------------------------------*/
	CheckFunds(type)
	{
		if (type == 'Fort' || type == 'fort')
		{
			if (this.AIWood >= FortCosts.wood)
			{
				if(this.AIGold >= FortCosts.gold)
				{
					this.AddBuilding(type);
				}
			}
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			if (this.AIWood >= BarracksCosts.wood)
			{
				if(this.AIGold >= BarracksCosts.gold)
				{
					this.AddBuilding(type);
				}
			}
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			if (this.AIWood >= WizardTowerCosts.wood)
			{
				if(this.AIGold >= WizardTowerCosts.gold)
				{
					this.AddBuilding(type);
				}
			}
		}

		// ARCHERY RANGE
		else if (type == 'Archery Range' || type == 'archery range')
		{
			if (this.AIWood >= ArcheryRangeCosts.wood)
			{
				if(this.AIGold >= ArcheryRangeCosts.gold)
				{
					this.AddBuilding(type);
				}
			}
		}

		// WORKER
		else if (type == 'worker' || type == 'Worker')
		{
			if (this.AIWood >= WorkerCost.wood)
			{
				if(this.AIGold >= WorkerCost.gold)
				{
					this.AddUnit(type);
				}
			}
		}

		// ARCHER
		else if (type == 'archer' || type == 'Archer')
		{
			if (this.AIWood >= ArcherCost.wood)
			{
				if(this.AIGold >= ArcherCost.gold)
				{
					this.AddUnit(type);
				}
			}
		}

		// SWORDINFANTRY
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			if (this.AIWood >= SwordInfantryCost.wood)
			{
				if(this.AIGold >= SwordInfantryCost.gold)
				{
					this.AddUnit(type);
				}
			}
		}

		// PIKEMAN
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			if (this.AIWood >= PikemanCost.wood)
			{
				if(this.AIGold >= PikemanCost.gold)
				{
					this.AddUnit(type);
				}
			}
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			if (this.AIWood >= WizardCost.wood)
			{
				if(this.AIGold >= WizardCost.gold)
				{
					this.AddUnit(type);
				}
			}
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to measure your funds and failed.");
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	CheckGoals()
	{
		if (this.AIForts < 1)
		{
			return 'Fort';
		}
		else if (this.AIWorkers < 2)
		{
			return 'worker';
		}
		else if (this.AIArcheryRanges < 1)
		{
			return 'Archery Range';
		}
		else if(this.AIArchers < 4)
		{
			return 'archer';
		}
		else if(this.AIBarracks < 1)
		{
			return 'barracks';
		}
		else if(this.AIPikemen < 3)
		{
			return 'pikeman';
		}
		else if(this.AISwordInfantry < 3)
		{
			return 'SwordInfantry';
		}
		else if(this.AITowers < 1)
		{
			return 'Wizard Tower';
		}
		else
		{
			return 'wizard';
		}
	}

	/*-----------------------------------------------------------------------*/
	UpdateRoles()
	{
		/*var i, type, tag;
		for (var b in this.resources)
		{

		}
		// MY WORKERS
		for (i = 0; i < this.MyUnits.length; i++)
		{
			tag = this.MyUnits[i].tag;
			console.log("the tag is" + tag);
			if (type == 'worker' || type == 'Worker')
			{
				this.objects[tag].gather(this.GetNearestResource());
				console.log("1");
			}
		}*/
		/*for (i in this.MyUnits)
		{
			if(this.MyUnits[i].type == 'Worker')
			{
				this.MyUnits[i].gather(this.GetNearestResource());
			}

		}*/
		/*for (i in this.objects)
		{
			if(this.objects[i].type == 'worker')
			{
				if (this.objects[i].faction == 'orc')
				{
					for (var b in resources)
					{
						this.objects[i].gather(resources[b]);
					}
				}
			}
		}*/

		// MY GUARDS
		for (let i = 0; i < this.MyUnits.length; i++)
		{
			if (this.MyUnits[i].type == 'Archer')
			{
				if(timer == 100)
				{
					this.MyUnits[i].move(800, 200);
				}
				else if (timer == 2)
				{
					this.MyUnits[i].move(400, 400);
				}
				else
				{
					// do nothing
				}
			}
		}
		console.log("I'm updating");

		// MY PATROL

		// MY ARMY

	}

	/*-----------------------------------------------------------------------*/
	UpdateTimer()
	{
		timer -= 1;
		if (timer == 1)
		{
			timer += 100;
		}
		console.log(timer);
	}

	/*-----------------------------------------------------------------------*/
	update()
	{
		this.UpdateTimer();
		this.UpdateRoles();
	}

	/*-----------------------------------------------------------------------*/

/*****************************************************************************/
							// DEBUGGING // 
/*****************************************************************************/
	
	/*-----------------------------------------------------------------------*/
	printArrays()
	{
		console.log("Buildings --------------");
		console.log(this.MyBuildings);

		console.log("Units --------------");
		console.log(this.MyUnits);
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
		console.log("Archery Ranges: " + this.AIArcheryRanges);
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
		this.AddBuilding('Archery Range');

		//this.GetAIStats();
		this.printArrays();
		
	}
}

export {AI};