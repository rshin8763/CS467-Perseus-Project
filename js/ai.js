import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Worker} from './worker.js';

var workerCount, fortCount;
var wood = 0, stone = 0, gold = 0;
var objects, resources;
var i = 0;

class AI
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR
	constructor(Perseus)
	{
		this.Perseus = Perseus;
		this.buildingsBurned = false;
	}
 	
 	/*-----------------------------------------------------------------------*/
 	// ADDS BEGINNING PIECES FOR AI - ONE WORKER AND ONE BUILDING
 	AddStartingSprites()
	{
		// ADD ONE FORT AND ONE WORKER
		this.Perseus.objects.push(new Fort('orc', 600, 300, this.Perseus));
		this.Perseus.objects.push(new Worker('orc', 350, 350, this.Perseus));
		fortCount = 1;
		workerCount = 1;
	}

	UpdateAIWood(x)
	{
		wood = wood + x;
		console.log("AI now has " + wood + " amount of wood");
	}

	/*-----------------------------------------------------------------------*/
	// SENDS ALL WORKERS TO GATHER RESOURCES
	GatherResources()
	{
		if(wood < 30 || stone < 30 || gold < 30)
		{
			// VARIABLE DECLARATIONS
			var workerCount = this.CountObjects(this.Perseus.objects, 'Worker');
			var woodCount = this.CountObjects(this.Perseus.resources, 'wood');
			/* var goldCount = this.CountObjects(this.Perseus.resources, 'gold');
			var stoneCount = this.CountObjects(this.Perseus.resources, 'stone'); */
			objects = this.Perseus.objects;
			resources = this.Perseus.resources;

			// ERROR HANDLING: NO WORKERS
			if(workerCount < 1)
			{
				return false;
			}

			// ERROR HANDLING: NO RESOURCES
			if (woodCount < 1)
			{/*
				if (goldCount < 1)
				{
					if (stoneCount < 1)
					{*/
						return false;
						/*
					}
				}*/
			}

			// SEND WORKERS TO WORK TOGETHER TO GATHER SINGLE RESOURCE
			i = 0;
			for (i in objects)
			{
				if(objects[i].type == 'Worker')
				{
					if(objects[i].faction == 'orc')
					{
						for(var b in resources)
						{
							// GATHER RESOURCES BASED ON LOCATION
							if(resources[b].x >= 600 && resources[b].exhausted == false)
							{
								objects[i].gather(resources[b]);
							}
						}
					}
				}
			}
		}
		// IF RESOURCE IS SUFFICIENT TO BUILD SOMETHING, GO FOR IT
		if (wood >= 30)
		{
			BuildBuildings('Fort');
		}
		if (stone >= 30)
		{
			if (gold >= 30)
			{
				this.BuildBuildings('Barracks');
			}
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