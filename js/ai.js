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
		this.health = 100;
		
		// RESOURCES
		this.gold = 0;
		this.wood = 0;

		// UNITS
		this.workers = 0;
		this.soldiers = 0;

		// BUILDINGS
		this.buildingsBurned = false;
		this.forts = 0;
		this.barracks = 0;
		this.allBuildings = 0;
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
 	// UPDATES AI WOOD COUNT AND PRINTS TO CONSOLE
	UpdateAIWood(x)
	{
		this.wood = this.wood + x;
		console.log("AI now has " + this.wood + " amount of wood.");
	}

	/*-----------------------------------------------------------------------*/
 	// UPDATES AI GOLD COUNT AND PRINTS TO CONSOLE
	UpdateAIGold(x)
	{
		this.gold = this.gold + x;
		console.log("AI now has " + this.gold + " amount of gold.");
	}

	/*-----------------------------------------------------------------------*/
 	// UPDATES AI HEALTH COUNT AND PRINTS TO USER
	UpdateAIHealth(x)
	{
		this.health = this.health + x;
		healthText.text = 'Enemy Health: ' + this.health;
	}

	/*-----------------------------------------------------------------------*/
	// SENDS ALL WORKERS TO GATHER RESOURCES
	GatherResources()
	{
		if(this.wood < 30 || this.gold < 30)
		{
			// VARIABLE DECLARATIONS
			var workerCount = this.CountObjects(this.Perseus.objects, 'Worker');
			var woodCount = this.CountObjects(this.Perseus.resources, 'wood');
			var goldCount = this.CountObjects(this.Perseus.resources, 'gold');
			var stoneCount = this.CountObjects(this.Perseus.resources, 'stone');

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

	BuildBuildings(type)
	{
		if (type == 'Fort')
		{

		}
		else
		{

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
	EventSequences()
	{
		// SET TIMER FOR IDLE STATE TO BUILD CERTAIN NUMBER OF RESOURCES
		// ONCE TIMER ENDS, BUILD BUILDINGS


		// SET TIMER FOR CERTAIN NUMBER OF ARMY MEMBERS
		// IMMEDIATELY DESIGNATE STANDING AND ATTACKING ARMY
		// SEND STANDING ARMY TO GUARD BORDERS
		// AFTER CERTAIN NUMBER OF STANDING ARMY MEMBERS IS REACHED, ATTACK
	}

	/*-----------------------------------------------------------------------*/
	/*****
	** DESCRIPTION: HELPER FUNCTION THAT COUNTS THE NUMBER OF A TYPE OF OBJECT
	** TAKES REFERENCE TO PERSEUS OBJECTS AND THE TYPE, RETURNS ORC NUMBER
	*****/
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
	update()
	{
		super.update();
		if(wood >= 10)
		{
			objects[i].build('Fort');
		}
	}

	Main()
	{
		// ADD HEALTH DISPLAY COUNT FOR USER
		enemyHealthText = this.Perseus.game.add.text(0, 0, 'Enemy Health: ' + this.health, style);
		enemyHealthText.fixedToCamera = true;
		enemyHealthText.cameraOffset.setTo(600, 0);


		this.AddStartingSprites();
		this.GatherResources();

		// IF NO ONE FOREIGN IS WITHIN BORDERS
			// IDLE STATE

		// ELSE SOMEONE IS WITHIN BORDERS
			// OFFENSIVE STATE

		// IF ARMY HAS REACHED A CERTAIN NUMBER -> ATTACK STATE

	}
}

export {AI};