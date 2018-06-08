import {SaveGame} from './saveGame.js';
import {Player} from './player.js';
import {AI} from './ai.js'

var style = { font: "20px Times New Roman", fill: "#ffffff", align: "center"};
var titlescreen, easyGameButton, loadGameButton, music, newGameButton, hardGameButton, gameName, mute_button;

class MainMenu 
{
	constructor(Perseus)
	{
		this.Perseus = Perseus;
		this.titlescreen;
		this.easyGameButton;
		this.loadGameButton;
		this.newGameButton;
		this.hardGameButton;
		this.gameName;
	}

	StartingScreen()
	{
		this.Perseus.game.paused = true;
		this.titlescreen = this.Perseus.game.add.sprite(400, 300, 'titlescreen');
		this.titlescreen.scale.setTo(.57, .57);
		this.titlescreen.anchor.setTo(0.5, 0.5);

		// TITLE
		gameName = this.Perseus.game.add.text(275, 75, "Perseus", 
		{
	      font: 'bold 60pt Times New Roman',
	      fill: '#ffffff'});

		//EASY MODE BUTTON
		this.easyGameButton = this.Perseus.game.add.sprite(400, 450, 'easyButton');
		this.easyGameButton.scale.setTo(.57, .57);
		this.easyGameButton.anchor.setTo(0.5, 0.5);
		this.easyGameButton.inputEnabled = true;
		this.easyGameButton.events.onInputUp.add(
			function ()
			{
				if(this.Perseus.game.paused)
        		{
            		this.Perseus.game.paused = false;
            	}
				this.loadGameButton.destroy();
				this.hardGameButton.destroy();
				this.easyGameButton.destroy();
				this.titlescreen.destroy();
				this.gameName.destroy();
				this.Perseus.Player.EasyMode();
				this.Perseus.AI.EasyMode();
			});

    	// HARD MODE BUTTON
		this.hardGameButton = this.Perseus.game.add.sprite(400, 350, 'hardButton');
		this.hardGameButton.scale.setTo(.57, .57);
		this.hardGameButton.anchor.setTo(0.5, 0.5);
		this.hardGameButton.inputEnabled = true;
		this.hardGameButton.events.onInputUp.add(
			function ()
			{
				if(this.Perseus.game.paused)
        		{
            		this.Perseus.game.paused = false;
            	}
				this.loadGameButton.kill();
				this.hardGameButton.destroy();
				this.easyGameButton.destroy();
				this.titlescreen.destroy();
				this.gameName.destroy();
				this.Perseus.Player.HardMode();
				this.Perseus.AI.HardMode();
			});

    	// LOAD GAME BUTTON
		this.loadGameButton = this.Perseus.game.add.sprite(400, 250, 'loadButton');
		this.loadGameButton.scale.setTo(.57, .57);
		this.loadGameButton.anchor.setTo(0.5, 0.5);
		this.loadGameButton.inputEnabled = true;
		this.loadGameButton.events.onInputUp.add(
			function () 
			{
				if(this.Perseus.game.paused)
        		{
            		this.Perseus.game.paused = false;
            	}
				this.loadGameButton.destroy();
				this.hardGameButton.destroy();
				this.easyGameButton.destroy();
				this.titlescreen.destroy();
				this.gameName.destroy();
				this.Perseus.SaveGame.LoadGame();
			});

	}

}

export {MainMenu};