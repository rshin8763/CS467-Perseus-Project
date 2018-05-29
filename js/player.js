import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';
import {Navigator} from './navigator.js';
import {Worker} from './worker.js';


/**** GLOBALS *****/
var workerCount, fortCount;
/*********/

class player
{
	/*-----------------------------------------------------------------------*/
	// GAME CONSTRUCTOR
	constructor(Perseus)
	{
		this.Perseus = Perseus;
		this.buildingsBurned = false;
	}

	/*-----------------------------------------------------------------------*/
	// ADD STARTING OBJECTS - ONE WORKER AND ONE FORT
	AddStartingSprites()
	{
		// ADD ONE FORT AND ONE WORKER
		this.Perseus.objects.push(new Fort('human', 600, 300, this.Perseus));
		this.Perseus.objects.push(new Worker('human', 350, 350, this.Perseus));
		fortCount = 1;
		workerCount = 1;
	}

	/*-----------------------------------------------------------------------*/
	// MAIN FUNCTION FOR CALLING FUNCTIONS OUT OF TYPED ORDER :)
	Main()
	{
		this.AddStartingSprites();
	}
}