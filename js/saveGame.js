import {Player} from './player.js';
import {AI} from './ai.js';
import {Resource} from './resource.js';

/*****************************************************************************/
							// GLOBALS // 
/*****************************************************************************/

// ******** GAME'S RESOURCES ********
var savedMapResources = [];
//	tag
//	depleated or not

// ******** PLAYER'S DATA ********
var savedPlayerBuildings = [];
//	Building = {
//		name:
//		hp:
//	};

var savedPlayerUnits = [];
//	Units = {
//		name:
//		hp:
//	};


var savedPlayerStocks = [];	// ** LOAD LAST **
//	Stock = {
//		gold:
//		wood:
//	};

// ******** AI DATA ********
var savedAIBuildings = [];
//	Building = {
//		name:
//		hp:
//	};

var savedAIUnits = [];
//	Units = {
//		name:
//		hp:
//	};

var savedAIStocks = [];
//	Stock = {
//		gold:
//		wood:
//	};

class SaveGame
{
	constructor(Perseus)
	{
		this.Perseus = Perseus;
		this.objects = this.Perseus.objects;
	}
/*****************************************************************************/
							// SAVE // 
/*****************************************************************************/
	
	/*-----------------------------------------------------------------------*/
	// MAP RESOURCES
	SaveMapResources()
	{

	}

	/*-----------------------------------------------------------------------*/
	// PLAYER
	SavePlayerBuildings()
	{

	}

	SavePlayerUnits()
	{

	}

	/*-----------------------------------------------------------------------*/
	// AI
	SaveAIBuildings()
	{
		var name, hp;
		var Building;
		for (var key in this.Perseus.AI.MyBuildings)
		{
			console.log("The name is: " + this.Perseus.AI.MyBuildings[key].kind);
			console.log("The hp is: " + this.HPLookup(this.Perseus.AI.MyBuildings[key].idNumber));
		}
	}

	SaveAIUnits()
	{

	}

/*****************************************************************************/
							// HELPERS // 
/*****************************************************************************/
	HPLookup(tag)
	{
		var thisHp = this.objects[tag].hp;
		return thisHp;
	}

/*****************************************************************************/
							// LOAD // 
/*****************************************************************************/

	LoadMapResources()
	{

	}

/*****************************************************************************/
							// DEBUGGING // 
/*****************************************************************************/

/*****************************************************************************/
							// MAIN // 
/*****************************************************************************/
	Main()
	{

	}
}

export {SaveGame}