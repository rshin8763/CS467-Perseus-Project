import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
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
var MyWorkers = [];
	// 	Worker = {
	//		idNumber: "object.tag",
	// 		occupation: "mine" or "chop",
	// 		safe: true/false
	//	};

var BuildingPatrol = [];
	// 	Soldier = {
	//		idNumber: "object.tag",
	// 		BuildingID: buildingArrayID,
	//		Corner: corner of building (1-4)
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
	// 		Goal: either: 'worker', 'building', or 'army',
	//		busy: true/false,
	// 		safe: true/false,
	//		atWar: true/false
	//	};

var objects, resources, enemyHealthText;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};
var i = 0;
var number = 0;
var buildSpotX = 1000, buildSpotY = 800, buildChanger = 150;
var tagTracker = [];
var newTags = [];


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

		// BUILDINGS
		this.AIForts = 0;
		this.AIBarracks = 0;
		this.AITowers = 0;
		this.AIAllBuildings = 0;
	}

	/*-----------------------------------------------------------------------*/
	// 	RETREIVES PLAYER STATISTICS
	GetAIStats()
	{
		console.log("Current Amounts for AI");
		//console.log("Gold: " + this.AIGold);
		//console.log("Wood: " + this.AIWorkers);
		//console.log("Workers: " + this.AIWorkers);
		//console.log("Pikemen: " + this.AIPikemen);
		//console.log("Swordsman: " + this.AISwordInfantry);
		//console.log("Archers: " + this.AIArchers);
		console.log("Forts: " + this.AIForts);
		console.log("Barracks: " + this.AIBarracks);
		console.log("Wizard Towers: " + this.AITowers);
		console.log("All Buildings: " + this.AIAllBuildings);
	}

/*****************************************************************************/
							// RESOURCES // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
 	// UPDATES AI WOOD COUNT AND PRINTS TO CONSOLE
	UpdateAIResources(x, type)
	{
		if (type == 'wood' || type == 'Wood')
		{
			this.AIWood = this.AIWood + x;
			if(this.AIWood >= 40)
			{
// SPAWN NEW BUILDING WITH MARKERS
			}
		}
		else if (type == 'gold' || type == 'Gold')
		{
			this.AIGold = this.AIGold + x;
			if (this.AIGold >= 50)
			{
// SPAWN NEW BUILDING WITH MARKERS
			}
		}
		else
		{
			console.log("You tried to update the AI Resources and failed.");
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	// SENDS ALL WORKERS TO GATHER RESOURCES
	GatherResources()
	{
		if(this.AIWood < 30 || this.AIGold < 30)
		{
			// VARIABLE DECLARATIONS
			var workerCount = this.CountObjects(this.Perseus.objects, 'Worker');
			var woodCount = this.CountObjects(this.Perseus.resources, 'wood');
			var goldCount = this.CountObjects(this.Perseus.resources, 'gold');

			// ERROR HANDLING: NO WORKERS
			if(workerCount < 1)
			{
				return false;
			}

			// ERROR HANDLING: NO RESOURCES
			if (woodCount < 1)
			{
				if (goldCount < 1)
				{
					console.log("There are no resources left to gather");
					return false;
				}
			}

			// SEND WORKERS TO WORK TOGETHER TO GATHER SINGLE RESOURCE
			i = 0;
			for (i in this.objects)
			{
				if(this.objects[i].type == 'Worker')
				{
					if(this.objects[i].faction == 'orc')
					{
						for(var b in this.resources)
						{
							// GATHER RESOURCES BASED ON LOCATION
							if(this.resources[b].x >= 600 && this.resources[b].exhausted == false)
							{
								this.objects[i].gather(this.resources[b]);
							}
						}
					}
				}
			}
		}
		// IF RESOURCE IS SUFFICIENT TO BUILD SOMETHING, GO FOR IT
		if (this.wood >= 30)
		{
			this.BuildBuildings('Fort');
		}
		if (this.gold >= 30)
		{
			this.BuildBuildings('Barracks');
		}
	}

/*****************************************************************************/
							// BUILDINGS // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	// DETERMINES TO ADD OR DELETE BUILDING; UPDATES RESOURCES ON ADD
	UpdateAIBuildings(x, type)
	{
		// DETERMINE IF ADDING OR SUBTRACTING BUILDING
		var addBuilding;
		if(x == -1)
		{
			addBuilding = false;
		}
		else if (x == 1)
		{
			addBuilding = true;
			var tag = this.Perseus.idCounter;
		}
		else
		{
			console.log("You entered an invalid number (accepts -1 or 1): "+x);
			return false;
		}

		// GET ID NUMBER & UPDATE VALUES ACCORDINGLY
		// FORT - COST: 30 WOOD
		if (type == 'Fort' || type == 'fort')
		{
			if(addBuilding == true)
			{
				this.UpdateAIResources(-30, 'wood');
				this.AddBuilding('Fort', tag);
			}
			else
			{
				this.AIForts--;
				this.AIAllBuildings--;
			}
		}

		// BARRACKS - COST: 50 WOOD, 20 GOLD
		else if (type == 'Barracks' || type == 'barracks')
		{
			if (addBuilding == true)
			{
				this.UpdateAIResources(-50, 'wood');
				this.UpdateAIResources(-20, 'gold');
				this.AddBuilding('barracks', tag);
			}
			else
			{
				this.AIBarracks--;
				this.AIAllBuildings--;
			}
		}

		// WIZARD TOWER - COST: 50 GOLD
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			if (addBuilding == true)
			{
				this.UpdateAIResources(-50, 'gold');
				this.AddBuilding('wizard tower', tag);
			}
			else
			{
				this.AITowers--;
				this.AIAllBuildings--;
			}
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to Update an AI Building and Failed.");
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	// SPAWNS 1 BUILDING AND CORRESPONDING SPRITES
	AddBuilding(type, idNumb)
	{
		var tag;
		// FORT - SPROUTS BUILDING + 2 WORKERS
		if (type == 'Fort' || type == 'fort')
		{
			// UPDATE BUILDINGS
			this.Perseus.objects.push(
				new Fort('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AIForts++;
			this.AddBuildingtoArray(type, idNumb);

			// ADD TWO WORKERS AND UPDATE UNITS
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Worker('orc', 
				buildSpotX + 30, buildSpotY, this.Perseus));
			this.AIWorkers++;
			this.AddUnitToArray('worker', tag, 'mine');

			// ADD SECOND WORKER
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Worker('orc', 
				buildSpotX, buildSpotY + 30, this.Perseus));
			this.AIWorkers++;
			this.AddUnitToArray('worker', tag, 'chop');
			buildSpotX -= buildChanger;
		}

		// BARRACKS
		else if (type == 'Barracks' || type == 'barracks')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			this.Perseus.objects.push(
				new Barracks('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AIBarracks++;
			this.AddBuildingtoArray(type, idNumb);

			// ADD TWO ARCHERS, 1 PIKEMAN, & 1 SWORDINFANTRY + UPDATE UNITS
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Archer('orc', buildSpotX -30, buildSpotY, this.Perseus));
			this.AIArchers++;
			this.AddUnitToArray('Archer', tag, 'guard');

			// ADD SECOND ARCHER
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Archer('orc', buildSpotX -70, buildSpotY - 70, this.Perseus));
			this.AIArchers++;
			this.AddUnitToArray('Archer', tag, 'guard');

			// ADD PIKEMAN
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Pikeman('orc', buildSpotX, buildSpotY - 30, this.Perseus));
			this.AIPikemen++;
			this.AddUnitToArray('Pikeman', tag, 'guard');

			// ADD SWORDINFANTRY
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new SwordInfantry('orc', buildSpotX-30, buildSpotY-50, this.Perseus));
			this.AISwordInfantry++;
			this.AddUnitToArray('SwordInfantry', tag, 'guard');
			buildSpotY -= buildChanger;
		}

		// WIZARD TOWER
		else if (type == 'Wizard Tower' || type == 'wizard tower')
		{
			// ADD BARRACKS AND UPDATE BUILDINGS
			this.Perseus.objects.push(
				new WizardTower('orc', buildSpotX, buildSpotY, this.Perseus));
			this.AITowers++;
			this.AddBuildingtoArray(type, idNumb);

			// ADD TWO WIZARDS & UPDATE INFORMATION
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Wizard('orc', buildSpotX -30, buildSpotY - 30, this.Perseus));
			this.AIWizards++;
			this.AddUnitToArray('Wizard', tag, 'guard');

			// SECOND WIZARD
			tag = this.Perseus.idCounter;
			this.Perseus.objects.push(
				new Wizard('orc', buildSpotX+40, buildSpotY -10, this.Perseus));
			this.AIWizards++;
			this.AddUnitToArray('Wizard', tag, 'guard');
			buildSpotX -= buildChanger;
			buildSpotY -= buildChanger;
		}

		// ERROR HANDLING
		else
		{
			console.log("You tried to add a building and failed.");
			return false;
		}
		this.AIAllBuildings++;
	}

	/*-----------------------------------------------------------------------*/
	// ADDS NEW BUILDING TO MYBUILDINGS ARRAY
	AddBuildingtoArray(type, idNumb)
	{
		var thisBuilding = {
			kind: type,
			corner: [false, false, false, false],
			idNumber: idNumb
		};
		MyBuildings.push(thisBuilding);
		/*var key;
		for (key in MyBuildings)
		{
			console.log("This Building kind is: " + MyBuildings[key].kind);
		}*/
	}

	/*-----------------------------------------------------------------------*/
	// DELETES BUILDING ENTRY FROM MYBUILDINGS ARRAY
	DeleteBuilding(tag)
	{
		var x = 0, y;
		// SORT THROUGH ARRAY & FIND MATCHING ID
		for(x = 0; x < MyBuildings.length; x++)
		{
			if(MyBuildings[x].idNumber == tag)
			{
				console.log("A Building is being deleted!");
				this.UpdateAIBuildings(-1, MyBuildings[x].kind);
				while(x < MyBuildings.length)
				{
					// MOVE ALL ENTRIES OVER ONE TO REPLACE LOST
					if (x == (MyBuildings.length - 1)) // IS LAST ONE
					{
						MyBuildings.pop();
					}
					else // ISN'T LAST ENTRY, MOVE ALL DATA FROM RIGHT
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
		if (MyBuildings.length <= 0)
		{
			//console.log("Game over!");
		}
	}

/*****************************************************************************/
							// UNITS // 
/*****************************************************************************/
/*-----------------------------------------------------------------------*/
	CheckBuildingCorner(x, y)
	{
		if (MyBuildings[x].corner[y] == true)
		{
			return true;
		}
		return false;
	}

	/*-----------------------------------------------------------------------*/
	AddUnitToArray(type, idNumb, job)
	{
		var Soldier;

		// WORKER - HARVEST EITHER GOLD OR WOOD
		if (type == 'worker' || type == 'Worker')
		{
			var thisWorker = {
				idNumber: idNumb,
				occupation: job,
				safe: true
			};
			MyWorkers.push(thisWorker);				
		}

		// ARCHER - GUARDS BUILDINGS
		else if (type == 'archer' || type == 'Archer')
		{
			Soldier = {
				idNumber: idNumb,
				BuildingID: -1,
				Corner: -1,
				busy: false,
				safe: true
			};
			BuildingPatrol.push(Soldier);
		}

		// SWORDINFANTRY - ATTACKS THE INNOCENT
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			Soldier = {
				idNumber: idNumb,
				Goal: "worker", 
				busy: false,
				safe: true,
				atWar: false
			};
			Army.push(Soldier);
		}

		// PIKEMAN - ATTACKS THE ARMED
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			Soldier = {
				idNumber: idNumb,
				Goal: "army", 
				busy: false,
				safe: true,
				atWar: false
			};
			Army.push(Soldier);
		}

		// WIZARD - ATTACKS BUILDINGS
		else if (type == 'wizard' || type == 'Wizard')
		{
			Soldier = {
				idNumber: idNumb,
				Goal: "building", 
				busy: false,
				safe: true,
				atWar: false
			};
			Army.push(Soldier);
		}
		else
		{
			console.log("You tried to Add a Unit to an Array and failed.");
			return false;
		}
	}
	/*-----------------------------------------------------------------------*/
	// UPDATES WORKER COUNT DISPLAY - TAKES NUMBER AND TYPE
	UpdateAIUnits(x, type)
	{
		if (type == 'worker' || type == 'Worker')
		{
			this.AIWorkers = this.AIWorkers + x;
			console.log("AI has " + this.AIWorkers + " workers");
		}
		else if (type == 'swordInfantry' || type == 'SwordInfantry')
		{
			this.AISwordInfantry = this.AISwordInfantry + x;
			console.log("AI has " + this.AISwordInfantry + " swordsmen");
		}
		else if (type == 'archer' || type == 'Archer')
		{
			this.AIArchers = this.AIArchers + x;
			if(x == -1)
			{
				DeleteUnit(x, type);
			}
			console.log("AI has " + this.AIArchers + " archers");
		}
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			this.AIPikemen = this.AIPikemen + x;
			console.log("AI has " + this.AIPikemen + " pikemen");
		}
		else if (type == 'wizard' || type == 'Wizard')
		{
			this.AIWizards = this.AIWizards + x;
			console.log("AI has " + this.AIWizards + " wizards");
		}
		else
		{
			console.log("You tried to Update an AI Unit and failed.");
			return false;
		}
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
	// COUNTS NUMBER OF OBJECTS
	CountObjects(obj, type)
	{
		var count = 0;
		for (var prop in obj)
		{
			if(obj[prop].type == type)
			{
				if(obj[prop].faction == 'orc')
				{
					count++;
				}
				if(obj[prop].exhausted == false)
				{
					count++;
				}
			}
		}
		console.log("The number of " + type + " is " + count);
		return count;
	}
	/*-----------------------------------------------------------------------*/
	OccupyCorner(x, y, idNumb)
	{

	}




	/*-----------------------------------------------------------------------*/
	update()
	{
		
		
	}

	printArray()
	{
		for(var m = 0; m < MyBuildings.length; m++)
		{
			console.log("Building Array Location: " + m);
			console.log("id: " + MyBuildings[m].idNumber);
			console.log("kind: " + MyBuildings[m].kind);
		}
	}

	/*-----------------------------------------------------------------------*/
	Main()
	{
		enemyHealthText = this.Perseus.game.add.text(0, 0, 
			'Enemy Buildings: ' + this.AIAllBuildings, style);
		enemyHealthText.fixedToCamera = true;
		enemyHealthText.cameraOffset.setTo(570, 3);

		//this.GatherResources();
		this.UpdateAIBuildings(1, 'Barracks');
		this.UpdateAIBuildings(1, 'Fort');
		this.UpdateAIBuildings(1, 'Wizard Tower');
		this.FillTagTracker();
		//this.printArray();
		console.log("Current Index: " + this.Perseus.idCounter);
	}
}

export {AI};