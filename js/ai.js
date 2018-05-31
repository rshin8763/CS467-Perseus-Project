import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Worker} from './worker.js';

var objects, resources, enemyHealthText;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};
var i = 0;

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
		this.AIAllBuildings = 0;
	}

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
			console.log("You entered an invalid type: " + type);
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
		else if (type == 'swordsman' || type == 'Swordsman')
		{
			this.AISwordInfantry = this.AISwordInfantry + x;
			console.log("AI has " + this.AISwordInfantry + " swordsmen");
		}
		else if (type == 'archer' || type == 'Archer')
		{
			this.AIArchers = this.AIArchers + x;
			console.log("AI has " + this.AIArchers + " archers");
		}
		else if (type == 'pikeman' || type == 'Pikeman')
		{
			this.AIPikemen = this.AIPikemen + x;
			console.log("AI has " + this.AIPikemen + " pikemen");
		}
		else
		{
			console.log("You entered an invalid type: " + type);
			return false;
		}
	}

	/*-----------------------------------------------------------------------*/
	// UPDATES AI BUILDINGS COUNT AND RESOURCES; INVALID INPUT RETURNS FALSE
	UpdateAIBuildings(x, type)
	{
		// CHECKS TO SEE IF ADDING A BUILDING OR SUBTRACTING
		var addBuilding;
		if(x == -1)
		{
			addBuilding = false;
		}
		else if (addBuilding == 1)
		{
			addBuilding = true;
		}
		else
		{
			console.log("You entered an invalid number (accepts -1 or 1): "+x);
			return false;
		}

		// UPDATES RESOURCES, BUILDING COUNT, AND ALLBUILDING COUNT
		if (type == 'Fort' || type == 'fort')
		{
			if(addBuilding == true)
			{
				this.UpdateAIResources(-30, 'wood');
// AUTOMATICALLY SPAWN UNITS??????????
			}
			this.AIForts = this.AIForts + x;
		}
		else if (type == 'Barracks' || type == 'barracks')
		{
			if (addBuilding == true)
			{
				this.UpdateAIResources(-50, 'gold');
// AUTOMATICALLY SPAWN UNITS?????

			}
			this.AIBarracks = this.AIBarracks + x;
		}
		else // ERROR HANDLING
		{
			console.log("You entered an invalid type: " + type);
			return false;
		}
		this.AIAllBuildings = this.AIAllBuildings + x;
	}

 	/*-----------------------------------------------------------------------*/
 	// ADDS BEGINNING PIECES FOR AI - ONE WORKER AND ONE BUILDING
 	AddStartingSprites()
	{
		this.Perseus.objects.push(new Fort('orc', 600, 300, this.Perseus));
		this.Perseus.objects.push(new Worker('orc', 350, 350, this.Perseus));
		this.forts = 1;
		this.workers = 1;
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

	/*-----------------------------------------------------------------------*/
	// Defense STATE: DEFEND THE BORDERS
	DefenseState()
	{
		// FRACTION OF ARMY DESIGNATED AS STANDING ARMY 

		// IMMEDIATELY MOVE TOWARDS ANYONE WHO CROSSES BORDERS & ATTACK

		// IF THEY LEAVE BORDERS, RESUME WORK

		// DON'T PASS BORDERS

		// ONLY USE ARMY DESIGNATED TO BE LEFT BEHIND

		// PUT HIGHER PRECEDENCE ON THOSE IN PROXIMITY TO BUILDINGS

	}

	/*-----------------------------------------------------------------------*/
	// ATTACK STATE: ATTACK THE ENEMY
	AttackState()
	{
		// FRACTION OF ARMY DESIGNATED AS ATTACKING ARMY

		// ATTACK BUILDINGS OF OTHER TEAM, NOT OWN

		// FIGHT BACK WHEN ATTACKED
	}

	/*-----------------------------------------------------------------------*/
	// EVENT SEQUENCES THAT TRIGGER THE THREE (IDLE, OFFENSE, ATTACK) STATES
	EventSequencesLoop()
	{
		// SET TIMER FOR IDLE STATE TO BUILD CERTAIN NUMBER OF RESOURCES
		this.GatherResources();
		// ONCE TIMER ENDS, BUILD BUILDINGS


		// SET TIMER FOR CERTAIN NUMBER OF ARMY MEMBERS
		// IMMEDIATELY DESIGNATE STANDING AND ATTACKING ARMY
		// SEND STANDING ARMY TO GUARD BORDERS
		// AFTER CERTAIN NUMBER OF STANDING ARMY MEMBERS IS REACHED, ATTACK
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
	Main()
	{
		enemyHealthText = this.Perseus.game.add.text(0, 0, 
			'Enemy Buildings: ' + this.AIAllBuildings, style);
		enemyHealthText.fixedToCamera = true;
		enemyHealthText.cameraOffset.setTo(600, 0);

		this.AddStartingSprites();
		this.EventSequencesLoop();
	}
}

export {AI};