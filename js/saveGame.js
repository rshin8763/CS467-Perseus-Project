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
		this.objects = objects;
	}
/*****************************************************************************/
							// SAVE // 
/*****************************************************************************/
	SaveMapResources()
	{

	}

	SavePlayerBuildings()
	{

	}

	SavePlayerUnits()
	{

	}

	SaveAIBuildings()
	{

	}

	SaveAIUnits()
	{

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