var MainMenu = function(Perseus)
{
	this.Perseus = Perseus;
}

// GLOBAL VARIABLE DECLARATIONS
var titlescreen, music, new_game_button, load_button, mute_button, gameName;
var style = { font: "20px Times New Roman", fill: "#ffffff", align: "center"};

MainMenu.prototype = 
{
	create:function()
	{
		// TITLE SCREEN AND GAME NAME TEXT
		titlescreen = this.add.sprite(this.world.centerX, this.world.centerY, 'titlescreen');
		titlescreen.scale.setTo(.70, .65);
		titlescreen.anchor.setTo(0.5, 0.5);
		gameName = this.add.text(275, 75, "Perseus", 
		{
	      font: 'bold 60pt Times New Roman',
	      fill: '#ffffff'});
		
		// BACKGROUND MUSIC
		music = this.add.audio('backgroundMusic');
		music.loop = true;
		music.play();

		// LOAD, NEW GAME, & MUTE BUTTONS
		load_button = this.add.button(300, 300, 'loadButton', loadGame, this, 2, 1, 0);
		new_game_button = this.add.button(300, 200, 'newGameButton', newGame, this, 2, 1, 0);
		mute_button = this.add.text(15, 15, 'Mute', style);
    	mute_button.inputEnabled = true;
    	mute_button.events.onInputUp.add(muteMusic);

	},

	update:function()
	{
		
	}
};

function loadGame()
{
	this.start('Main');
};

function newGame()
{
	var test = this.add.text(300, 300, 'You clicked the NEW GAME button', style);
};

function muteMusic()
{
	if(music.mute == true)
	{
		music.mute = false;
	}
	else
	{
		music.mute = true;
	}
	
};