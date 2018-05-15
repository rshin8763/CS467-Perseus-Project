var Boot = function(Perseus)
{
	this.Perseus = Perseus;
}

Boot.prototype =
{
	preload: function(Perseus)
	{
		// LOAD TITLE SCREEN, MUSIC, AND BUTTONS
		this.load.image('titlescreen', 'assets/images/titlescreen.png');
		this.load.audio('backgroundMusic', 'assets/audio/GardenParty.mp3');
		this.load.image('loadButton', 'assets/images/loadButton.png');
		this.load.image('newGameButton', 'assets/images/newGameButton.png');
	},

	create: function(Perseus)
	{
		this.state.start('MainMenu');
	}
}