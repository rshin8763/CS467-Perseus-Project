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
import {Player} from './player.js';

/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/
var MyGoldMines = [];
var MyWorkers = [];
var MyArchers = [];
var MySwordInfantry = [];
var MyPikemen = [];
var MyWizards = [];

var ArcherCircleCoord = [];
var PikemenLineCoord = [];
var SwordInfantryWatch = [];
var WizardPatrol = [];

var spawnSpotX = 1700, spawnSpotY = 950, spawnChanger = -20;
var intruder = false;

var timerTick = 150;
var timer = timerTick;
var safe = true;

////////////////// ORGANIZE BY GOALS ////////

// BUILDING COSTS
// UNIT COSTS

var WorkerCost = {
	wood: 100,
	gold: 100
};

var GoldMineCosts = {
	wood: 150,
	gold: 150
};

var ArcheryRangeCosts = {
	wood: 200,
	gold: 200
};

var ArcherCost = {
	wood: 250,
	gold: 250
};

var BarracksCosts = {
	wood: 300,
	gold: 300
};

var PikemanCost = {
	wood: 350,
	gold: 350
};

var SwordInfantryCost = {
	wood: 400,
	gold: 400
};

var WizardTowerCosts = {
	wood: 450,
	gold: 450
};

var WizardCost = {
	wood: 500,
	gold: 500
};

var FortCosts = {
	wood: 600,
	gold: 600
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
		if (type == 'wood' || type == 'Wood')
		{
			this.AIWood += x;
			goal = this.CheckGoals();
			if(goal != false)
			{
				this.CheckFunds(goal);
			}
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.AIGold +=x;
			goal = this.CheckGoals();
			if(goal != false)
			{
				this.CheckFunds(goal);
			}
			
		}
		else
		{
			console.log("You tried to update the AI Resources and failed.");
			return false;
		}
		console.log("AI current funds: " + this.AIWood + " " + this.AIGold);
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
        //console.log('found tree ', closest);
        return closest;
	}

	/*-----------------------------------------------------------------------*/
	CreateMine()
	{	
		let thisMine = new Mine('human', 1600 + spawnChanger, 1150, this.Perseus);
		this.objects.push(thisMine);
		MyGoldMines.push(thisMine);
		this.AIGoldMines++;
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
			this.UpdateStock(-FortCosts.wood, 'wood');
			this.UpdateStock(-FortCosts.gold, 'gold');
			// UPDATE BUILDINGS
			thisBuilding = new Fort('orc', 1400, 1400, this.Perseus)

			// UPDATE RESOURCES & ADD WORKERS
			this.AddUnit('worker');
			this.AddUnit('worker');
			this.AIForts++;
		}

		// ARCHERY RANGE
		else if (type == 'Archery Range' || type == 'archery range')
		{
			this.UpdateStock(-ArcheryRangeCosts.wood, 'wood');
			this.UpdateStock(-ArcheryRangeCosts.gold, 'gold');
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new ArcheryRange('orc', 1000, 1400, this.Perseus);

			// UPDATE RESOURCES + ADD TWO WIZARDS
			this.AddUnit('Archer');
			this.AddUnit('Archer');
			this.AIArcheryRanges++;
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			this.UpdateStock(-BarracksCosts.wood, 'wood');
			this.UpdateStock(-BarracksCosts.gold, 'gold');
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new Barracks('orc', 1000, 1250, this.Perseus);

			// UPDATE RESOURCES + 1 PIKEMAN, & 1 SWORDINFANTRY
			this.AddUnit('Pikeman');
			this.AddUnit('Pikeman');
			this.AddUnit('SwordInfantry');
			this.AddUnit('SwordInfantry');
			this.AIBarracks++;
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			this.UpdateStock(-WizardTowerCosts.wood, 'wood');
			this.UpdateStock(-WizardTowerCosts.gold, 'gold');
			// ADD BARRACKS AND UPDATE BUILDINGS
			thisBuilding = new WizardTower('orc', 1550, 1400, this.Perseus);

			// UPDATE RESOURCES + ADD TWO WIZARDS
			this.AddUnit('Wizard');
			this.AddUnit('Wizard');
			this.AITowers++;
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
		for (let i = 0; i < this.MyBuildings.length; i++)
		{
			if (this.MyBuildings[i] == obj)
			{
				this.MyBuildings.splice(i, 1);
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
			this.UpdateStock(-WorkerCost.wood, 'wood');
			this.UpdateStock(-WorkerCost.gold, 'gold');
			thisUnit = new Worker('orc', spawnSpotX, spawnSpotY, this.Perseus);
			MyWorkers.push(thisUnit);
			this.AIWorkers++;
		}

		// ARCHER 
		else if (type == 'archer' || type == 'Archer')
		{
			this.UpdateStock(-ArcherCost.wood, 'wood');
			this.UpdateStock(-ArcherCost.gold, 'gold');
			thisUnit = new Archer('orc', spawnSpotX, spawnSpotY, this.Perseus);
			MyArchers.push(thisUnit);
			this.AIArchers++;
		}

		// SWORDINFANTRY 
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			this.UpdateStock(-SwordInfantryCost.wood, 'wood');
			this.UpdateStock(-SwordInfantryCost.gold, 'gold');
			thisUnit = new SwordInfantry('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AISwordInfantry++;
			MySwordInfantry.push(thisUnit);
		}

		// PIKEMAN - ATTACKS THE ARMED
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			this.UpdateStock(-PikemanCost.wood, 'wood');
			this.UpdateStock(-PikemanCost.gold, 'gold');
			thisUnit = new Pikeman('orc', spawnSpotX , spawnSpotY, this.Perseus);
			this.AIPikemen++;
			MyPikemen.push(thisUnit);
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			this.UpdateStock(-WizardCost.wood, 'wood');
			this.UpdateStock(-WizardCost.gold, 'gold');
			thisUnit = new Wizard('orc', spawnSpotX, spawnSpotY, this.Perseus);
			this.AIWizards++;
			MyWizards.push(thisUnit);
		}
		else
		{
			console.log("You tried to Add a Unit to an Array and failed.");
			return false;
		}

		// ADDS TO BOTH GLOBAL AND AI ARRAYS, THEN UPDATES ROLES
		this.MyUnits.push(thisUnit);
		this.Perseus.objects.push(thisUnit);
		spawnSpotX += spawnChanger;
		this.printArrays();
		this.UpdateStaticRoles();
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
			for (let i = 0; i < MyWorkers.length; i++)
			{
				if (MyWorkers[i] == obj)
				{
					MyWorkers.splice(i, 1);
				}
			}
			this.AIWorkers--;
		}

		// ARCHER
		else if (type == 'archer' || type == 'Archer')
		{
			for (let i = 0; i < MyArchers.length; i++)
			{
				if (MyArchers[i] == obj)
				{
					MyArchers.splice(i, 1);
				}
			}
			this.AIArchers--;
		}

		// SWORDINFANTRY
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			for (let i = 0; i < MySwordInfantry.length; i++)
			{
				if (MySwordInfantry[i] == obj)
				{
					MySwordInfantry.splice(i, 1);
				}
			}
			this.AISwordInfantry--;
		}

		// PIKEMAN
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			for (let i = 0; i < MyPikemen.length; i++)
			{
				if (MyPikemen[i] == obj)
				{
					MyPikemen.splice(i, 1);
				}
			}
			this.AIPikemen--;
		}

		// WIZARDS
		else if (type == 'wizard' || type == 'Wizard')
		{
			for (let i = 0; i < MyWizards.length; i++)
			{
				if (MyWizards[i] == obj)
				{
					MyWizards.splice(i, 1);
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
	
	/*-----------------------------------------------------------------------*/
	CheckFunds(type)
	{
		if (type == 'Fort' || type == 'fort')
		{
			if (this.AIWood >= (FortCosts.wood + (2 * WorkerCost.wood)))
			{
				if(this.AIGold >= (FortCosts.gold + (2 * WorkerCost.gold)))
				{
					this.AddBuilding(type);
				}
			}
		}

		if (type == 'gold mine' || type == 'Gold Mine')
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
			var woodCost = BarracksCosts.wood + PikemanCost.wood + SwordInfantryCost.wood;
			var goldCost = BarracksCosts.gold + PikemanCost.gold + SwordInfantryCost.gold;
			if (this.AIWood >= woodCost)
			{
				if(this.AIGold >= goldCost)
				{
					this.AddBuilding(type);
				}
			}
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			if (this.AIWood >= (WizardTowerCosts.wood + (2 * WizardCost.wood)))
			{
				if(this.AIGold >= (WizardTowerCosts.gold + (2 * WizardCost.gold)))
				{
					this.AddBuilding(type);
				}
			}
		}

		// ARCHERY RANGE
		else if (type == 'Archery Range' || type == 'archery range')
		{
			if (this.AIWood >= (ArcheryRangeCosts.wood + ArcherCost.wood + ArcherCost.wood))
			{
				if(this.AIGold >= (ArcheryRangeCosts.gold + ArcherCost.gold + ArcherCost.gold))
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
					if(this.AIForts > 0)
					{
						this.AddUnit(type);
					}
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
					if(this.AIArcheryRanges > 0)
					{
						this.AddUnit(type);
					}
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
					if(this.AIBarracks > 0)
					{
						this.AddUnit(type);
					}
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
					if(this.AIBarracks > 0)
					{
						this.AddUnit(type);
					}
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
					if(this.AITowers > 0)
					{
						this.AddUnit(type);
					}
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
		if (this.AIWorkers < 2)
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

		else if(this.AIArchers < 2)
		{
			return 'archer';
		}
		
		else if(this.AIBarracks < 1)
		{
			return 'barracks';
		}
		else if(this.AIPikemen < 2)
		{
			return 'pikeman';
		}
		else if(this.AISwordInfantry < 2)
		{
			return 'SwordInfantry';
		}
		else if(this.AITowers < 1)
		{
			return 'Wizard Tower';
		}
		else if(this.AIWizards < 2)
		{
			return 'wizard';
		}
		else
		{
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	CreateMovementMap()
	{
		let thisCoord = null;

		// ARCHER CORNER 1
		thisCoord = {
			x: 500,
			y: 1000
		}
		ArcherCircleCoord.push(thisCoord);

		// CORNER 2
		thisCoord = {
			x: 650,
			y: 800
		}
		ArcherCircleCoord.push(thisCoord);

		// CORNER 3
		thisCoord = {
			x: 1200,
			y: 1000
		}
		ArcherCircleCoord.push(thisCoord);

		// CORNER 4
		thisCoord = {
			x: 1700,
			y: 1000
		}

		ArcherCircleCoord.push(thisCoord);

		// PIKEMEN LINE COORDINATES
		// SPOT 1
		thisCoord = {
			x: 850,
			y: 1200
		}
		PikemenLineCoord.push(thisCoord);

		// PIKEMEN LINE COORDINATES
		// SPOT 2
		thisCoord = {
			x: 1700,
			y: 1200
		}
		PikemenLineCoord.push(thisCoord);

		// SWORDINFANTRY GUARD COORDINATES
		// SPOT 1
		thisCoord = {
			x: 850,
			y: 1100
		}
		SwordInfantryWatch.push(thisCoord);

		// SWORDINFANTRY GUARD COORDINATES
		// SPOT 2
		thisCoord = {
			x: 1650,
			y: 1100
		}
		SwordInfantryWatch.push(thisCoord);

		// SWORDINFANTRY GUARD COORDINATES
		// SPOT 2
		thisCoord = {
			x: 900,
			y: 1500
		}
		SwordInfantryWatch.push(thisCoord);

		// WIZARD PATROL
		thisCoord = {
			x: 1700,
			y: 1300
		}
		WizardPatrol.push(thisCoord);

		thisCoord = {
			x: 1250, 
			y: 1300
		}
		WizardPatrol.push(thisCoord);
		console.log(WizardPatrol);
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
			else // SPLITS WORKERS INTO WOOD AND GOLD GATHERERS
			{
				var flag = true;
				while (i < MyWorkers.length)
				{
					if (flag == true)
					{
						thisUnit.gather(this.GetNearestTree());
						console.log("1");
						flag = false;
					}
					else
					{
						thisUnit.gather(this.GetNearestMine());
						console.log("2");
						flag = true;
					}				
					i++;
				}
			}
		}

		// ARCHERS STATIC ROLE IS TO PATROL
		let unit = null;
		for(let i = 0; i < MyArchers.length; i++)
		{
			unit = MyArchers[i];
			unit.move(ArcherCircleCoord[i].x, ArcherCircleCoord[i].y);
		}

		// PIKEMEN STATIC PATROL LINE
		unit = null;
		for(let i = 0; i < MyPikemen.length; i++)
		{
			unit = MyPikemen[i];
			unit.move(PikemenLineCoord[i].x, PikemenLineCoord[i].y);
		}

		// PIKEMEN STATIC SWORDS STATIC STANDING LOCATION
		unit = null;
		for(let i = 0; i < MySwordInfantry.length; i++)
		{
			unit = MySwordInfantry[i];
			unit.move(SwordInfantryWatch[i].x, SwordInfantryWatch[i].y);
		}

		// PIKEMEN STATIC SWORDS STATIC STANDING LOCATION
		unit = null;
		for(let i = 0; i < MyWizards.length; i++)
		{
			unit = MyWizards[i];
			unit.move(WizardPatrol[i].x, WizardPatrol[i].y);
		}
		intruder = false;
	}

	/*-----------------------------------------------------------------------*/
	SendAttackUnit(thisUnit)
	{
		var takenCareOf = false;
		var type = thisUnit.type;

		console.log(thisUnit);
		for(let i = 0; i < this.MyUnits; i++)
		{
			if(this.MyUnits[i].target == thisUnit)
			{
				return true;
			}
		}
		if (thisUnit.hp > 0)
		{
			if(thisUnit.attacking == false && thisUnit.attackMoving == false)
			{
				if(this.MyUnits.length > 0)
				{
					// WORKER
					if (type == 'worker' || type == 'Worker')
					{
						for (let i = 0; i < MyWorkers.length; i++)
						{
							if(MyWorkers.attacking == false)
							{
								MyWorkers[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
						type = 'archer';
					}

					// ARCHER
					if (type == 'archer' || type == 'Archer')
					{
						for (let i = 0; i < MyArchers.length; i++)
						{
							if (MyArchers[i].attacking == false)
							{
								MyArchers[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
						type = 'swordInfantry';
					}

					// SWORDINFANTRY
					if (type == 'swordInfantry' || type == 'SwordInfantry')
					{
						for (let i = 0; i < MySwordInfantry.length; i++)
						{
							if (MySwordInfantry[i].attacking == false)
							{
								MySwordInfantry[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
						type = 'pikeman';
					}

					// PIKEMAN
					if (type == 'pikeman' || type == 'Pikeman')
					{
						for (let i = 0; i < MyPikemen.length; i++)
						{
							if (MyPikemen[i].attacking == false)
							{
								MyPikemen[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
						type = 'wizard';
					}

					// WIZARDS
					if (type == 'wizard' || type == 'Wizard')
					{
						for (let i = 0; i < MyWizards.length; i++)
						{
							if (MyWizards[i].attacking == false)
							{
								MyWizards[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
					}

					//SendRandomAttackUnit(intruder);
					for(let m = 0; m < this.MyUnits.length; m++)
					{
						if(this.MyUnits[i].attacking == false && this.MyUnits.attackMoving == false)
						{
							if(this.MyUnits[i].type != 'worker' || this.MyUnits[i].type != 'Worker')
							{
								this.MyUnits[i].attack(thisUnit, {x: thisUnit.x, y: thisUnit.y});
								return true;
							}
						}
					}
				}
				// ERROR HANDLING
				else
				{
					console.log("Tried to send attack unit and failed!");
					return false;
				}
			}
		}
	}

	/*-----------------------------------------------------------------------*/
	MovementUpdateLoop()
	{
		// SAFETY CHECK
		let thisUnit = null;
		for (let i = 0; i < this.Perseus.Player.units.length; i++)
		{
			thisUnit = this.Perseus.Player.units[i];
			if (thisUnit.y > 25)
			{
				if (thisUnit.attacking == false || thisUnit.attackMoving == false)
				{
					for(let i = 0; i < this.MyUnits; i++)
					{
						if(this.MyUnits[i].target == thisUnit)
						{
							intruder = false;
						}
						else
						{
							this.SendAttackUnit(this.Perseus.Player.units[i]);
						}
					}

					intruder = false;
				}
			}
			if (thisUnit.attacking == true || thisUnit.attackMoving == true)
			{
				intruder = true;
			}
		}

		if(intruder == false)
		{
			// MOVES ARCHERS
			let unit = null;
			let thisX = null;
			let thisY = null;

			// ARCHERS CIRCLE
			for (let i = 0; i < MyArchers.length; i++)
			{
				unit = MyArchers[i];
				if(unit.x == unit.dest.x && unit.y == unit.dest.y)
				{
					//console.log("1");
					for (let m = 0; m < ArcherCircleCoord.length; m++)
					{
						thisX = this.Perseus.navigator.getSquare(
							ArcherCircleCoord[m].x, ArcherCircleCoord[m].y);
						if(unit.x == thisX.x && unit.y == thisX.y)
						{
							if(m == ArcherCircleCoord.length - 1)
							{
								//console.log("2");
								let s = 0;
								unit.move(ArcherCircleCoord[s].x, ArcherCircleCoord[s].y);
							}
							else
							{
								unit.move(ArcherCircleCoord[m+1].x, ArcherCircleCoord[m+1].y);
							}
						}
					}
				}
			}

			// PIKEMEN LINE
			for (let i = 0; i < MyPikemen.length; i++)
			{
				unit = MyPikemen[i];
				if(unit.x == unit.dest.x && unit.y == unit.dest.y)
				{
					//console.log("1");
					for (let m = 0; m < PikemenLineCoord.length; m++)
					{
						thisX = this.Perseus.navigator.getSquare(
							PikemenLineCoord[m].x, PikemenLineCoord[m].y);
						if(unit.x == thisX.x && unit.y == thisX.y)
						{
							if(m == PikemenLineCoord.length - 1)
							{
								//console.log("2");
								let s = 0;
								unit.move(PikemenLineCoord[s].x, PikemenLineCoord[s].y);
							}
							else
							{
								unit.move(PikemenLineCoord[m+1].x, PikemenLineCoord[m+1].y);
							}
						}
					}
				}
			}

			// WIZARD LINE
			for (let i = 0; i < MyWizards.length; i++)
			{
				unit = MyWizards[i];
				if(unit.x == unit.dest.x && unit.y == unit.dest.y)
				{
					for (let m = 0; m < WizardPatrol.length; m++)
					{
						thisX = this.Perseus.navigator.getSquare(
							WizardPatrol[m].x, WizardPatrol[m].y);
						if(unit.x == thisX.x && unit.y == thisX.y)
						{
							if(m == WizardPatrol.length - 1)
							{
								let s = 0;
								unit.move(WizardPatrol[s].x, WizardPatrol[s].y);
							}
							else
							{
								unit.move(WizardPatrol[m+1].x, WizardPatrol[m+1].y);
							}
						}
					}
				}
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
			this.MovementUpdateLoop();
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
		this.CreateMovementMap();
		this.AddBuilding('Fort');
		this.AddBuilding('Archery Range');
		this.AddBuilding('Barracks');
		this.AddBuilding('Wizard Tower');
	}
}

export {AI};
