import {Player} from './player.js';
import {AI} from './ai.js';
import {Resource} from './resource.js';
import {Tree} from './tree.js';

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
							// SAVE // 
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
			if(thisObject.type == 'Fort')
			{
				if(thisObject.x == 19 && thisObject.y == 3)
				{
					thisBuilding = {
						type: 'starting fort',
						xCoor: null, 
						yCoor: null,
						hp: thisObject.hp
					}
					savedPlayerBuildings.push(thisBuilding);
				}
				else
				{
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
		}
	}

	SavePlayerUnits()
	{
		// LOCATION
		// HP
		savedPlayerUnits.length = 0;
		let thisObject = null;
		var thisUnit;
		for(let i = 0; i < this.Perseus.Player.units.length; i++)
		{
			thisObject = this.Perseus.Player.units[i];
			console.log(thisObject);
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
			thisBuilding = {
				hp: thisObject.hp,
				type: thisObject.type
			}
			savedAIBuildings.push(thisBuilding);
		}
	}

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
			thisUnit = {
				hp: thisObject.hp,
				type: thisObject.type
			}
			savedAIUnits.push(thisUnit);
		}
	}

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
							// LOAD // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	// MAP RESOURCES
	LoadMapResources()
	{
		var loadMap = JSON.parse(Cookies.get('bookableResources'));
		console.log(loadMap);
		var objectsArr = this.Perseus.objects
		for (var thisResource in objectsArr)
		{
			if(objectsArr[thisResource].tag)
			{
				if((objectsArr[thisResource].tag) == loadMap[thisResource].tag);
				{
					console.log(loadMap.tag);
					objectsArr[thisResource].exhausted = loadMap[thisResource].exhausted;
					
				}
			}
		}
	}

	/*-----------------------------------------------------------------------*/
	// PLAYER
	LoadPlayerBuildings()
	{
			// SPAWN AT LOCATION, ADD TO PLAYER BUILDINGS
			// SET HP
			var loadPlayBuildings = JSON.parse(Cookies.get('bookablePlayerBuildings'));
			console.log(loadPlayBuildings);
	}

	LoadPlayerUnits()
	{
		// SPAWN AT LOCATION
		//  SET HP
		//  IF MOVING?
		// 		SET DESTINATION
		var LoadPlayUnits = JSON.parse(Cookies.get('bookablePlayerUnits'));
		console.log(LoadPlayUnits);

	}

	LoadPlayerStocks()
	{
		// SPAWN AT LOCATION
		//  SET HP
		//  IF MOVING?
		// 		SET DESTINATION
		var LoadPlayStocks = JSON.parse(Cookies.get('bookablePlayerStocks'));
		console.log(LoadPlayStocks);
	}

	/*-----------------------------------------------------------------------*/
	// AI
	LoadAIBuildings()
	{
		// SPAWN BUILDING
		// SET HP
		var LoadEnemyBuildings = JSON.parse(Cookies.get('bookableAIBuildings'));
		console.log(LoadEnemyBuildings);
		
	}

	LoadAIUnits()
	{
		// SPAWN UNIT
		// SET HP
		var LoadEnemyUnits = JSON.parse(Cookies.get('bookableAIUnits'));
		console.log(LoadEnemyUnits);
	}

	LoadAIStocks()
	{
		// GOLD
		// SILVER
		var LoadEnemyStocks = JSON.parse(Cookies.get('bookableAIStocks'));
		console.log(LoadEnemyStocks);

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