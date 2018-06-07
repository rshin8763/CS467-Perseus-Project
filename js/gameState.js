import {Player} from './player.js';
import {AI} from './ai.js';

var x;

class GameState
{
	constructor(Perseus)
	{
		this.Perseus = Perseus;
	}

	LoadGame()
	{
		console.log(x);
	}

	SaveCurrentState()
	{
		document.cookie = this.Perseus.AI.AIAllBuildings;
		if(document.cookie)
		{
			x = document.cookie;
			console.log(x);
		}
	}

	Quit()
	{
		// declare who the winner is
		// ask player if wants to play again
		// restart on click
	}

	Restart()
	{


	}
	
}

export {GameState}
