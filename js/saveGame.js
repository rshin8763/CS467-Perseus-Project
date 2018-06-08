import {Player} from './player.js';
import {AI} from './ai.js';
import {Resource} from './resource.js';

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
		

	}

	/*-----------------------------------------------------------------------*/
	// PLAYER
	SavePlayerBuildings()
	{
		// GO THROUGH PLAYER BUILDINGS
			// LOCATION
			// HP
	}

	SavePlayerUnits()
	{
		// LOCATION
		// HP
		// MOVING?
		// 	DESTINATION

	}

	SavePlayerStocks()
	{
		// GOLD
		// SILVER
	}

	/*-----------------------------------------------------------------------*/
	// AI
	SaveAIBuildings()
	{
		// HP
		
	}

	SaveAIUnits()
	{
		// HP

	}

/*****************************************************************************/
							// LOAD // 
/*****************************************************************************/

	/*-----------------------------------------------------------------------*/
	// MAP RESOURCES
	LoadMapResources()
	{
		// TAG STILL SAME? OR NEED LOCATION?
		//	IF DEPRECATED
		// 		IF NOT, HP 
		

	}

	/*-----------------------------------------------------------------------*/
	// PLAYER
	LoadPlayerBuildings()
	{
			// SPAWN AT LOCATION, ADD TO PLAYER BUILDINGS
			// SET HP
	}

	LoadPlayerUnits()
	{
		// SPAWN AT LOCATION
		//  SET HP
		//  IF MOVING?
		// 		SET DESTINATION

	}

	/*-----------------------------------------------------------------------*/
	// AI
	LoadAIBuildings()
	{
		// SPAWN BUILDING
		// SET HP 
		
	}

	LoadAIUnits()
	{
		// SPAWN UNIT
		// SET HP
	}

	LoadAIStocks()
	{
		// GOLD
		// SILVER
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
	Main()
	{
		this.printArrays();

	}
}

export {SaveGame}