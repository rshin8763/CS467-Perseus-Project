import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {Fort} from './fort.js';
import {Worker} from './worker.js';
import {Pikeman} from './pikeman.js';
import {WizardTower} from './wizardtower.js';
import {Wizard} from './wizard.js';
import {Barracks} from './barracks.js';
import {ArcheryRange} from './archeryrange.js';
import {Navigator} from './navigator.js';
import {Tree} from './tree.js';
import {Mine} from './mine.js';

/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/
var MyGoldMines = [];
var MyWorkers = [];
var MyArchers = [];
var MySwordInfantry = [];
var MyPikemen = [];
var MyWizards = [];

var TopLayerCoordinates = [];
var InnerSquareCoordinates = [];
var InnerLCoordinates = [];
var StationaryCoordinates = [];

var spawnSpotX = 1200, spawnSpotY = 1200, spawnChanger = -100;


var timerTick = 200;
var timer = timerTick;
var safe = true;

// BUILDING COSTS
var GoldMineCosts = {
	wood: 10,
	gold: 1
};
var FortCosts = {
	wood: 10,
	gold: 1
};
var ArcheryRangeCosts = {
	wood: 10,
	gold: 1
};
var BarracksCosts = {
	wood: 10,
	gold: 1
};
var WizardTowerCosts = {
	wood: 10,
	gold: 1
};

// UNIT COSTS
var WorkerCost = {
	wood: 10,
	gold: 1
};
var ArcherCost = {
	wood: 10,
	gold: 1
};
var PikemanCost = {
	gold: 10,
	wood: 1
};
var SwordInfantryCost = {
	wood: 10,
	gold: 1
};
var WizardCost = {
	wood: 10,
	gold: 1
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
		this.AIGoldMines = 0;

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
	GetNearestTree()
	{
        let closest = null;
        let min = Number.MAX_SAFE_INTEGER;
        this.Perseus.objects.forEach((obj)=>{
            if (obj instanceof Tree)
            {
                if (Math.hypot(43-obj.x, 43-obj.y) < min){
                    min = Math.hypot(43-obj.x, 43-obj.y);
                    closest = obj;
                }
            }
        });
        console.log('found tree ', closest);
        return closest;
	}

	/*-----------------------------------------------------------------------*/
	CreateMine()
	{	
		let thisMine = new Mine('human', 1600 + spawnChanger, 1150, this.Perseus);
		this.objects.push(thisMine);
		MyGoldMines.push(thisMine);
		this.AIGoldMines++;
		spawnChanger -= 100;
		console.log(thisMine);
		this.UpdateStaticRoles();
	}

	/*-----------------------------------------------------------------------*/
	DeleteMine(thisMine)
	{
		for (let i = 0; i < MyGoldMines.length; i++)
		{
			if (MyGoldMines[i] == thisMine)
			{
				MyGoldMines.splice(i, 1);
				this.AIGoldMines--;
				UpdateStaticRoles();
			}
		}
	}

	/*-----------------------------------------------------------------------*/
	GetNearestMine()
	{
		console.log(MyGoldMines);
		let thisResource = null;
		for (let i = 0; i < MyGoldMines.length; i++)
		{
			if(MyGoldMines[i].exhausted == false)
			{
				return MyGoldMines[i];
			}
		}
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
			thisBuilding = new ArcheryRange('orc', 1200, 1400, this.Perseus);
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
			thisBuilding = new Barracks('orc', 1400, 1250, this.Perseus);
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
			thisBuilding = new WizardTower('orc', 1550, 1400, this.Perseus);
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
		this.UpdateStaticRoles();
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
		this.UpdateStaticRoles();
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
			MyWorkers.push(thisUnit);
			this.AIWorkers++;
			this.UpdateStock(-WorkerCost.wood, 'wood');
			this.UpdateStock(-WorkerCost.gold, 'gold');
		}

		// ARCHER 
		else if (type == 'archer' || type == 'Archer')
		{
			thisUnit = new Archer('orc', spawnSpotX, spawnSpotY, this.Perseus);
			MyArchers.push(thisUnit);
			this.AIArchers++;
			this.UpdateStock(-ArcherCost.wood, 'wood');
			this.UpdateStock(-ArcherCost.gold, 'gold');
		}

		// SWORDINFANTRY 
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			thisUnit = new SwordInfantry('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AISwordInfantry++;
			MySwordInfantry.push(thisUnit);
			this.UpdateStock(-SwordInfantryCost.wood, 'wood');
			this.UpdateStock(-SwordInfantryCost.gold, 'gold');
		}

		// PIKEMAN - ATTACKS THE ARMED
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			thisUnit = new Pikeman('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIPikemen++;
			MyPikemen.push(thisUnit);
			this.UpdateStock(-PikemanCost.wood, 'wood');
			this.UpdateStock(-PikemanCost.gold, 'gold');
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			thisUnit = new Wizard('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIWizards++;
			MyWizards.push(thisUnit);
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
		this.UpdateStaticRoles();
		//this.UpdateRoles();
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
			for (let i = 0; i < this.MyWorkers.length; i++)
			{
				if (this.MyWorkers[i] == obj)
				{
					this.MyWorkers.splice(i, 1);
				}
			}
			this.AIWorkers--;
		}

		// ARCHER
		else if (type == 'archer' || type == 'Archer')
		{
			for (let i = 0; i < this.MyArchers.length; i++)
			{
				if (this.MyArchers[i] == obj)
				{
					this.MyArchers.splice(i, 1);
				}
			}
			this.AIArchers--;
		}

		// SWORDINFANTRY
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			for (let i = 0; i < this.MySwordInfantry.length; i++)
			{
				if (this.MySwordInfantry[i] == obj)
				{
					this.MySwordInfantry.splice(i, 1);
				}
			}
			this.AISwordInfantry--;
		}

		// PIKEMAN
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			for (let i = 0; i < this.MyPikemen.length; i++)
			{
				if (this.MyPikemen[i] == obj)
				{
					this.MyPikemen.splice(i, 1);
				}
			}
			this.AIPikemen--;
		}

		// WIZARDS
		else if (type == 'wizard' || type == 'Wizard')
		{
			for (let i = 0; i < this.MyWizards.length; i++)
			{
				if (this.MyWizards[i] == obj)
				{
					this.MyWizards.splice(i, 1);
				}
			}
			this.AIWizards--;
		}

		// ERROR HANDLING
		else
		{
			console.log("Error in trying to delete unit. Type unidentifiable.");
			return false;
		}
		this.UpdateStaticRoles();
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

		if (type == 'Gold Mine' || type == 'gold mine')
		{
			if (this.AIWood >= GoldMineCosts.wood)
			{
				if(this.AIGold >= GoldMineCosts.gold)
				{
					this.CreateMine();
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
			// WAGE WAR
			// CHECK FUNDS TO BUY ANYTHING ELSE
			// return 'Fort';
		}
		else if (this.AIWorkers < 4)
		{
			return 'worker';
		}
		else if (this.AIGoldMines < 1)
		{
			return 'Gold Mine';
		}
		else if (this.AIArcheryRanges < 1)
		{
			return 'Archery Range';
		}
		else if(this.AIArchers < 3)
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
	UpdateStaticRoles()
	{
		// WORKERS STATIC ROLES IS TO GATHER
		let thisUnit = null;
		for(let i = 0; i < MyWorkers.length; i++)
		{
			thisUnit = MyWorkers[i];
			if (this.AIGoldMines < 1)
			{
				thisUnit.gather(this.GetNearestTree());
			}
			else
			{
				var flag = true;
				while (i < MyWorkers.length)
				{
					if (flag == true)
					{
						thisUnit.gather(this.GetNearestTree());
						flag = false;
					}
					thisUnit.gather(this.GetNearestMine());					
					i++;
				}
			}
		}

		let unit = null;
		for(let i = 0; i < MyArchers.length; i++)
		{
			unit = MyArchers[i];
			if (unit.x == unit.dest.x && unit.y == unit.dest.y)
			{
				unit.move(1400, 1200);
			}
			else
			{
				console.log("1");
				unit.move(1400, 1100);
			}
		}

	}

	/*-----------------------------------------------------------------------*/
	UpdateTimer()
	{
		// TIMER STARTS AT 800
		timer -= 1;
		if (timer == 1)
		{
			timer += timerTick;
			//this.UpdateRoles();
		}
		//console.log(timer);
	}

	/*-----------------------------------------------------------------------*/
	update()
	{
		this.UpdateTimer();
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

		console.log("Workers --------------");
		console.log(MyWorkers);

		console.log("Archers --------------");
		console.log(MyArchers);

		console.log("SwordInfantry --------------");
		console.log(MySwordInfantry);

		console.log("Pikemen --------------");
		console.log(MyPikemen);

		console.log("Wizards --------------");
		console.log(MyWizards);
	}

	/*-----------------------------------------------------------------------*/
	GetAIStats()
	{
		console.log("Current Amounts for AI");
		console.log("Gold: " + this.AIGold);
		console.log("Wood: " + this.AIWood);
		console.log("Gold Mines: " + this.AIGoldMines);
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
		//this.AddBuilding('Wizard Tower');
		//this.AddBuilding('Barracks');
		this.GetAIStats();
		this.AddBuilding('Fort');
		this.CreateMine();
		//this.AddBuilding('Archery Range');
		//this.GetNearestTree();
		this.GetAIStats();
		this.printArrays();
		//this.UpdateStaticRoles();
		
	}
}

export {AI};
