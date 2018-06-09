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

// USING JQUERY COOKIES PLUGIN
// https://github.com/js-cookie/js-cookie

/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/

// ******** GAME'S RESOURCES ********
var savedMapResources = [];

// ******** PLAYER'S DATA ********
var savedPlayerBuildings = [];
var savedPlayerUnits = [];
var savedPlayerStocks = [];	// ** LOAD LAST **


// ******** AI DATA ********
var savedAIBuildings = [];
var savedAIUnits = [];
var savedAIStocks = [];

class SaveGame
{
	constructor(Perseus)
	{
		this.Perseus = Perseus;
	}
/*****************************************************************************/
							// RESOURCES // 
/*****************************************************************************/
	
	/*-----------------------------------------------------------------------*/
	// MAP RESOURCES
	SaveMapResources()
	{
		// TAG STILL SAME? OR NEED LOCATION?
		//	IF DEPRECATED
		// 		IF NOT, HP
		savedMapResources.length = 0;;
		let thisObject = null;
		var thisResource;
		for (let i = 0; i < this.Perseus.objects.length; i++)
		{
			thisObject = this.Perseus.objects[i];
			if (thisObject instanceof Tree)
			{
				thisResource = {
					tag: thisObject.tag,
					exhausted: thisObject.exhausted,
					resourceAmount: thisObject.resourceAmount
				}
				savedMapResources.push(thisResource)
			}
		}

	}
/*****************************************************************************/
							// PLAYER // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	// PLAYER
	SavePlayerBuildings()
	{
		// GO THROUGH PLAYER BUILDINGS
			// LOCATION
			// HP
		savedPlayerBuildings.length = 0;
		let thisObject = null;
		var thisBuilding;
		for(let i = 0; i < this.Perseus.Player.buildings.length; i++)
		{
			thisObject = this.Perseus.Player.buildings[i];
			let thisX = this.Perseus.navigator.getCoords(thisObject.x, thisObject.y);
			thisBuilding = {
				type: thisObject.type,
				xCoor: thisX.x,
				yCoor: thisX.yCoor,
				hp: thisObject.hp
			}
			savedPlayerBuildings.push(thisBuilding);
		}
	}

	/*-----------------------------------------------------------------------*/
	SavePlayerUnits()
	{
		// LOCATION
		// HP
		// TYPE
		savedPlayerUnits.length = 0;
		let thisObject = null;
		var thisUnit;
		for(let i = 0; i < this.Perseus.Player.units.length; i++)
		{
			thisObject = this.Perseus.Player.units[i];
			//console.log(thisObject);
			let thisX = this.Perseus.navigator.getCoords(thisObject.x, thisObject.y)
			thisUnit = {
				type: thisObject.type,
				x: thisX.x,
				y: thisX.y,
				hp: thisObject.hp
			}
			savedPlayerUnits.push(thisUnit);
		}
	}

	/*-----------------------------------------------------------------------*/
	SavePlayerStocks()
	{
		var thisObject;
		savedPlayerStocks.length = 0
		thisObject = {
			gold: this.Perseus.Player.playerGold,
			wood: this.Perseus.Player.playerWood
		}
		savedPlayerStocks.push(thisObject);
	}

/*****************************************************************************/
							// AI // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	// AI
	SaveAIBuildings()
	{
		// HP
		// NOTICE LATER IF ANY ARE MISSING
		savedAIBuildings.length = 0;
		let thisObject = null;
		var thisBuilding;
		for(let i = 0; i < this.Perseus.AI.MyBuildings.length; i++)
		{
			thisObject = this.Perseus.AI.MyBuildings[i];
			let thisX = this.Perseus.navigator.getCoords(thisObject.x, thisObject.y);
			thisBuilding = {
				hp: thisObject.hp,
				type: thisObject.type,
				xCoor: thisX.x,
				yCoor: thisX.y
			}
			savedAIBuildings.push(thisBuilding);
		}
	}
	/*-----------------------------------------------------------------------*/
	SaveAIUnits()
	{
		// HP
		// figure out how to delete things that automatically come up
		var thisUnit;
		savedAIUnits.length = 0;
		let thisObject = null;
		for(let i = 0; i < this.Perseus.AI.MyUnits.length; i++)
		{
			thisObject = this.Perseus.AI.MyUnits[i];
			let thisX = this.Perseus.navigator.getCoords(thisObject.x, thisObject.y);
			thisObject = this.Perseus.AI.MyUnits[i];
			thisUnit = {
				hp: thisObject.hp,
				type: thisObject.type,
				xCoor: thisX.x,
				yCoor: thisX.y
			}
			savedAIUnits.push(thisUnit);
		}
	}

	/*-----------------------------------------------------------------------*/
	SaveAIStocks()
	{
		// HP
		// figure out how to delete things that automatically come up
		savedAIStocks.length = 0;
		var thisUnit = {
			wood: this.Perseus.AI.AIWood,
			gold: this.Perseus.AI.AIGold
		};
		savedAIStocks.push(thisUnit);
	}
/*****************************************************************************/
							// COOKIES // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	SaveArraysToCookies()
	{
		// SAVE RESOURCES
		var resourcesString = savedMapResources;
		var resArr = JSON.stringify(resourcesString);
		Cookies.remove('bookableResources');
		Cookies.set('bookableResources', resArr);

		// SAVE PLAYER BUILDINGS
		var playbuildins = savedPlayerBuildings;
		var playBarr = JSON.stringify(playbuildins);
		Cookies.remove('bookablePlayerBuildings');
		Cookies.set('bookablePlayerBuildings', playBarr);

		// SAVE PLAYER UNITS
		var playunits = savedPlayerUnits;
		var playUni = JSON.stringify(playunits);
		Cookies.remove('bookablePlayerUnits');
		Cookies.set('bookablePlayerUnits', playUni);

		// SAVE PLAYER STOCKS
		var playStocks = savedPlayerStocks;
		var playstocki = JSON.stringify(playStocks);
		Cookies.remove('bookablePlayerStocks');
		Cookies.set('bookablePlayerStocks', playstocki);

		// SAVE AI BUILDINGS
		var aibuildings = savedAIBuildings;
		var aibuildi = JSON.stringify(aibuildings);
		Cookies.remove('bookableAIBuildings');
		Cookies.set('bookableAIBuildings', aibuildi);

		// SAVE AI UNITS
		var aiunits = savedAIUnits;
		var aiunini = JSON.stringify(aiunits);
		Cookies.remove('bookableAIUnits');
		Cookies.set('bookableAIUnits', aiunini);

		// SAVE AI STOCKS
		var aistockies = savedAIStocks;
		var dasstocks = JSON.stringify(aistockies);
		Cookies.remove('bookableAIStocks');
		Cookies.set('bookableAIStocks', dasstocks);

	}

/*****************************************************************************/
							// LOAD MAP // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	LoadMapResources()
	{
		var loadMap = JSON.parse(Cookies.get('bookableResources'));
		console.log(loadMap);
		var objectsArr = this.Perseus.objects
		for (var thisResource in objectsArr)
		{
			if(objectsArr[thisResource].tag)
			{
				if(objectsArr[thisResource].tag == loadMap[thisResource].tag);
				{
					//console.log(loadMap.tag);
					objectsArr[thisResource].exhausted = loadMap[thisResource].exhausted;
					objectsArr[thisResource].exhausted = loadMap[thisResource].resourceAmount;
				}
			}
		}
	}
/*****************************************************************************/
							// LOAD PLAYER // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	LoadPlayerBuildings()
	{
		// SPAWN AT LOCATION, ADD TO PLAYER BUILDINGS
		// SET HP
		var loadPlayBuildings = JSON.parse(Cookies.get('bookablePlayerBuildings'));
		for(let i = 0; i < loadPlayBuildings.length; i++)
		{
			var type = loadPlayBuildings[i].type
			let thisBuilding = null;

			// FORT
			if (type == 'Fort' || type == 'fort')
			{
				thisBuilding = new Fort('human', loadPlayBuildings[i].xCoor, loadPlayBuildings[i].yCoor, this.Perseus)
			}

			// ARCHERY RANGE
			else if (type == 'Archery Range' || type == 'archery range')
			{
				thisBuilding = new ArcheryRange('human', loadPlayBuildings[i].xCoor, loadPlayBuildings[i].yCoor, this.Perseus);
			}
			// BARRACKS
			else if (type == 'Barracks' || type == 'barracks')
			{
				thisBuilding = new Barracks('human', loadPlayBuildings[i].xCoor, loadPlayBuildings[i].yCoor, this.Perseus);
			}

			// WIZARD TOWER
			else if (type == 'Wizard Tower' || type == 'wizard tower')
			{
				thisBuilding = new WizardTower('human', loadPlayBuildings[i].xCoor, loadPlayBuildings[i].yCoor, this.Perseus);
			}

			// ERROR HANDLING
			else
			{
				console.log("You tried to add a building and failed.");
				return false;
			}
			thisBuilding.hp = loadPlayBuildings[i].hp;
			this.Perseus.objects.push(thisBuilding);
			this.Perseus.Player.addObject(thisBuilding);
		}
	}
	/*-----------------------------------------------------------------------*/
	LoadPlayerUnits()
	{
		var loadPlayUnits = JSON.parse(Cookies.get('bookablePlayerUnits'));
		console.log(loadPlayUnits);
		for (let i = 0; i < loadPlayUnits.length; i++)
		{
			let thisUnit = null;
			var	type = loadPlayUnits[i].type;
			var x = loadPlayUnits[i].x;
			var y = loadPlayUnits[i].y;

			// WORKER 
			if (type == 'worker' || type == 'Worker')
			{
				thisUnit = new Worker('human', x, y, this.Perseus);
			}

			// ARCHER 
			else if (type == 'archer' || type == 'Archer')
			{
				thisUnit = new Archer('human', x, y, this.Perseus);
			}

			// SWORDINFANTRY 
			else if (type == 'swordInfantry' || type == 'SwordInfantry')
			{
				thisUnit = new SwordInfantry('orc', x, y, this.Perseus);
			}

			// PIKEMAN - ATTACKS THE ARMED
			else if (type == 'pikeman' || type == 'Pikeman')
			{
				thisUnit = new Pikeman('human', x , y, this.Perseus);
			}

			// WIZARD - ATTACKS BUILDINGS
			else if (type == 'wizard' || type == 'Wizard')
			{
				thisUnit = new Wizard('human', x, y, this.Perseus);
			}
			else
			{
				console.log("You tried to Add a Unit to an Array and failed.");
				return false;
			}

			thisUnit.hp = loadPlayUnits[i].hp;
			this.Perseus.Player.addObject(thisUnit);
			this.Perseus.objects.push(thisUnit);
		}

	}

	/*-----------------------------------------------------------------------*/
	LoadPlayerStocks()
	{
		// SPAWN AT LOCATION
		//  SET HP
		//  IF MOVING?
		// 		SET DESTINATION
		var loadPlayStocks = JSON.parse(Cookies.get('bookablePlayerStocks'));
		console.log(loadPlayStocks);
		this.Perseus.Player.playerGold = loadPlayStocks[0].gold;
		this.Perseus.Player.playerWood = loadPlayStocks[0].wood;

	}
/*****************************************************************************/
							// LOAD AI // 
/*****************************************************************************/
	/*-----------------------------------------------------------------------*/
	// AI
	LoadAIBuildings()
	{
		// SPAWN BUILDING
		// SET HP
		var loadEnemyBuildings = JSON.parse(Cookies.get('bookableAIBuildings'));
		for(let i = 0; i < loadEnemyBuildings.length; i++)
		{
			var type = loadEnemyBuildings[i].type;
			let thisBuilding = this.Perseus.AI.AddBuilding(type);
			thisBuilding.hp = loadEnemyBuildings[i].hp;		
		}
		
	}

	/*-----------------------------------------------------------------------*/
	LoadAIUnits()
	{
		// SPAWN UNIT
		// SET HP
		var loadEnemyUnits = JSON.parse(Cookies.get('bookableAIUnits'));
		console.log(loadEnemyUnits);
		for(var i  = 0; i < loadEnemyUnits.length; i++)
		{
			var m = 3001000000;
			while(m > 1)
			{
				m--;
			}
			let thisUnit = this.Perseus.AI.AddUnit(loadEnemyUnits[i].type);
			console.log(loadEnemyUnits[i]);
			thisUnit.hp = loadEnemyUnits[i].hp;
			thisUnit.move(loadEnemyUnits[i].xCoor, loadEnemyUnits[i].yCoor);
		}
	}

	/*-----------------------------------------------------------------------*/
	LoadAIStocks()
	{
		// GOLD
		// SILVER
		var loadEnemyStocks = JSON.parse(Cookies.get('bookableAIStocks'));
		console.log(LoadEnemyStocks);
		this.Perseus.AI.AIWood = loadEnemyStocks[0].wood;
		this.Perseus.AI.AIGold = loadEnemyStocks[0].gold;

	}

/*****************************************************************************/
							// DEBUGGING // 
/*****************************************************************************/

	printArrays()
	{
		console.log("SAVED MAP RESOURCES -----------------------");
		console.log(savedMapResources);

		console.log("SAVED PLAYER BUILDINGS -----------------------");
		console.log(savedPlayerBuildings);

		console.log("SAVED PLAYER UNITS -----------------------");
		console.log(savedPlayerUnits);

		console.log("SAVED PLAYER STOCKS -----------------------");
		console.log(savedPlayerStocks);

		console.log("SAVED AI BUILDINGS -----------------------");
		console.log(savedAIBuildings);

		console.log("SAVED AI UNITS -----------------------");
		console.log(savedAIUnits);

		console.log("SAVED AI STOCKS -----------------------");
		console.log(savedAIStocks);
	}



/*****************************************************************************/
							// MAIN // 
/*****************************************************************************/
	SaveGame()
	{
		this.SaveMapResources();
		this.SavePlayerUnits();
		this.SavePlayerBuildings();
		this.SavePlayerStocks();
		this.SaveAIBuildings();
		this.SaveAIStocks();
		this.SaveAIUnits();
		this.SaveArraysToCookies();
	}

	LoadGame()
	{
		this.LoadMapResources();
		this.LoadPlayerBuildings();
		this.LoadPlayerUnits();
		this.LoadPlayerStocks();
		this.LoadAIBuildings();
		this.LoadAIUnits();
		this.LoadAIStocks();
	}


	Main()
	{
		this.SaveMapResources();
		this.SavePlayerBuildings();
		this.SavePlayerUnits();
		this.SavePlayerStocks();
		this.SaveAIBuildings();
		this.SaveAIUnits();
		this.SaveAIStocks();

		this.SaveArraysToCookies();
		this.LoadMapResources();

		this.printArrays();

	}
}

export {SaveGame}