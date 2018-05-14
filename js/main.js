import {SwordInfantry} from './swordInfantry.js';
import {Archer} from './archer.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';

import {Navigator} from './navigator.js';


//I mostly changed the classes to pass around references of Perseus instead of game.
//Perseus now contains objects, controller, map, graphics
//Within Controller is the selected objects array. I still haven't changed anything to do with game.selected. 
//We will need to add different logic for group selecting units, while buildings and resource nodes should only be 
//able to be clicked directly. 
var Perseus = Perseus || {};
Perseus.graphics = {}
var Main = function() {};

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

//TODO set anchor point of all units to the center, not the corner

// RESOURCES OBJECTS
var gold = 0;
var stone = 0;
var wood = 0;
var thisHealth = 100;
var enemyHealth = 100;

// RESOURCES TEXT OBJECTS
var goldText, stoneText, woodText, thisHealthText, enemyHealthText;
var buttonClick = false;

// GENERAL DECLARATIONS 
var w = 800, h = 600;
var menuBar, pause_button, saveButton, quitButton, newGameButton, resumeButton, mute_button;
var style = { font: "17px Times New Roman", fill: "#ffffff", align: "left"};

Main.prototype = {
	preload:function() {
	this.load.tilemap('demo', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('topbar', 'assets/topbar.png');
	// TODO insert tiles url and creators
	this.load.image('gameTiles', 'assets/tilemaps/forestTiles.png');
	this.load.image('tree', 'assets/images/tree.png');
	this.load.image('barracks', 'assets/barracks.png');
	this.load.image('fort', 'assets/fort.png');
	this.load.image('ui', 'assets/ui/stoneMenu.png');


	Perseus.game.load.spritesheet('swordsman_human', 'assets/images/units/swordsman_human.png', 64, 64);
	Perseus.game.load.spritesheet('swordswoman_human', 'assets/images/units/swordswoman_human.png', 64, 64);
	Perseus.game.load.spritesheet('archer_male_human', 'assets/images/units/archer_male_human.png', 64, 64);
	Perseus.game.load.spritesheet('archer_female_human', 'assets/images/units/archer_female_human.png', 64, 64);
	Perseus.game.load.spritesheet('worker_male_human', 'assets/images/units/worker_male_human.png', 64, 64);
	Perseus.game.load.spritesheet('worker_female_human', 'assets/images/units/worker_female_human.png', 64, 64);
	Perseus.game.load.spritesheet('wizard_male_human', 'assets/images/units/wizard_male_human.png', 64, 64);
	Perseus.game.load.spritesheet('wizard_female_human', 'assets/images/units/wizard_female_human.png', 64, 64);
	Perseus.game.load.spritesheet('pikeman_male_human', 'assets/images/units/pikeman_male_human.png', 64, 64);
	Perseus.game.load.spritesheet('pikeman_female_human', 'assets/images/units/pikeman_female_human.png', 64, 64);

	Perseus.game.load.spritesheet('swordsman_orc', 'assets/images/units/swordsman_orc.png', 64, 64);
	Perseus.game.load.spritesheet('swordswoman_orc', 'assets/images/units/swordswoman_orc.png', 64, 64);
	Perseus.game.load.spritesheet('archer_male_orc', 'assets/images/units/archer_male_orc.png', 64, 64);
	Perseus.game.load.spritesheet('archer_female_orc', 'assets/images/units/archer_female_orc.png', 64, 64);
	Perseus.game.load.spritesheet('worker_male_orc', 'assets/images/units/worker_male_orc.png', 64, 64);
	Perseus.game.load.spritesheet('worker_female_orc', 'assets/images/units/worker_female_orc.png', 64, 64);
	Perseus.game.load.spritesheet('wizard_male_orc', 'assets/images/units/wizard_male_orc.png', 64, 64);
	Perseus.game.load.spritesheet('wizard_female_orc', 'assets/images/units/wizard_female_orc.png', 64, 64);
	Perseus.game.load.spritesheet('pikeman_male_orc', 'assets/images/units/pikeman_male_orc.png', 64, 64);
	Perseus.game.load.spritesheet('pikeman_female_orc', 'assets/images/units/pikeman_female_orc.png', 64, 64);
	Perseus.game.load.image('arrow_right', 'assets/arrow_right.png');
	Perseus.game.load.image('arrow_left', 'assets/arrow_left.png');

	// MENU BAR AND BUTTONS
	Perseus.game.load.image('menuBar', 'assets/images/menuBar.png');
	Perseus.game.load.image('saveButton', 'assets/images/saveButton.png');
	Perseus.game.load.image('quitButton', 'assets/images/quitButton.png');
	Perseus.game.load.image('resumeButton', 'assets/images/resumeButton.png');
	Perseus.game.load.image('newGameButton', 'assets/images/newGameButton.png');
	},

	create:function() {
	Perseus.map = this.game.add.tilemap('demo');

	Perseus.navigator = new Navigator(Perseus.game, 25, 19, 32);
	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	Perseus.map.addTilesetImage('forestTiles', 'gameTiles');

	//create layer
	Perseus.backgroundLayer= Perseus.map.createLayer('backgroundLayer');
	Perseus.collisionLayer = Perseus.map.createLayer('collisionLayer');

	// Sets collision  TODO make it work with unit's move method.
	Perseus.map.setCollisionByExclusion([], true, Perseus.collisionLayer, true);


    //I added a 800x20 sprite that's just a blue bar
	let topbar = this.add.sprite(0, 0, 'topbar');
	//And set it fixed to Camera
	topbar.fixedToCamera = true;

	this.barText = this.add.text(100, 0, "This number can change each update:", style);
	this.testText = "This number can change each update:";
	this.barText.fixedToCamera = true;

	this.count = 0;

	//resizes the game world to match the layer dimensions
	Perseus.backgroundLayer.resizeWorld();

	//Create an objects array on the game object and add a soldier to it.
	Perseus.objects = [];


	Perseus.objects.push(new SwordInfantry('human', 250, 250, Perseus));
	Perseus.objects.push(new SwordInfantry('human', 200, 400, Perseus));
	Perseus.objects.push(new Archer('human', 300, 300, Perseus));


    //Create resources
    Perseus.mapRenderer = new mapRenderer(Perseus);
    Perseus.mapRenderer.createResources();

	// Create GUI bar
	Perseus.ui = {}
	Perseus.ui.bar = this.add.sprite(0,0,'ui');
	Perseus.ui.bar.height = 600;
	// 6 32px tiles
	Perseus.ui.bar.width =  192;

	//Create Controller 
    Perseus.controller = new Controller(Perseus);
    // RESOURCE DATA BAR ------------------------------------------------------
	menuBar = Perseus.game.add.sprite(0, 0, 'menuBar'); // ADD MENU
    menuBar.fixedToCamera = true;
    menuBar.cameraOffset.setTo(0, 0);

	// GOLD
    goldText = Perseus.game.add.text(0, 0, 'Gold: 0', style);
    goldText.fixedToCamera = true;
    goldText.cameraOffset.setTo(100, 0);

    // STONE
    stoneText = Perseus.game.add.text(0, 0, 'Stone: 0',style);
    stoneText.fixedToCamera = true;
    stoneText.cameraOffset.setTo(200, 0);

    // WOOD
    woodText = Perseus.game.add.text(0, 0, 'Wood: 0', style);
    woodText.fixedToCamera = true;
    woodText.cameraOffset.setTo(300, 0);

    // USER HEALTH
    thisHealth = Perseus.game.add.text(0, 0, 'Health: 100', style);
    thisHealth.fixedToCamera = true;
    thisHealth.cameraOffset.setTo(400, 0);

    // USER HEALTH
    enemyHealth = Perseus.game.add.text(0, 0, 'Enemy Health: 100', style);
    enemyHealth.fixedToCamera = true;
    enemyHealth.cameraOffset.setTo(530, 0);
    
    // PAUSE BUTTON, MUTE, MENU -----------------------------------------------
    var pause_button = Perseus.game.add.text(0, 0, 'Pause', style);
    pause_button.fixedToCamera = true;
    pause_button.cameraOffset.setTo(10, 0);
    pause_button.inputEnabled = true;
    pause_button.events.onInputUp.add(pause);
	
	mute_button = Perseus.game.add.text(0, 0, 'Mute', style);
	mute_button.fixedToCamera = true;
    mute_button.cameraOffset.setTo(700, 0);
    	mute_button.inputEnabled = true;
    	mute_button.events.onInputUp.add(muteMusic);
    },
	update:function(){


    Perseus.controller.takeInput();
	this.count++;
	this.barText.text = this.testText +  " " + this.count;
	//Call the update function on each game object
	Perseus.objects.forEach(function(obj){
		obj.update();
	});
}
};

/*****
** DESCRIPTION: PAUSES THE GAME STATE
** ADDS RESUME, SAVE, QUIT, AND NEW GAME BUTTONS TO THE GAME STATE
*****/
function pause()
{
	// ADD MENU BUTTONS
	resumeButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 50, 
		'resumeButton', unpause, this, 2, 1, 0);

	saveButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 160, 
		'saveButton', saveGame, this, 2, 1, 0);

	quitButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 268, 
		'quitButton', quitGame, this, 2, 1, 0);

	newGameButton = Perseus.game.add.button(Perseus.game.camera.x + 300, Perseus.game.camera.y + 376, 
		'newGameButton', newGame, this, 2, 1, 0);
	Perseus.game.paused = true;
}

/*****
** DESCRIPTION: UNPAUSES THE GAME STATE
** DESTROYS RESUME, SAVE, QUIT, AND NEW GAME BUTTONS FROM THE GAME STATE
*****/
function unpause()
{
	if(Perseus.game.paused)
	{
		Perseus.game.paused = false;
		saveButton.destroy();
		quitButton.destroy();
		game.newGameButton.destroy();
		resumeButton.destroy();
	}
}

/*****
** DESCRIPTION: ADDS GOLD AMOUNT SPECIFIED BY NUMBER TO CURRENT COUNT
** UPDATES AMOUNT ON SCREEN
*****/
function updateGold(x)
{
	gold = gold + x;
	goldText.text = 'Gold: ' + gold;
}

/*****
** DESCRIPTION: ADDS STONE AMOUNT SPECIFIED BY NUMBER TO CURRENT COUNT
** UPDATES AMOUNT ON SCREEN
*****/
function updateStone(x)
{
	stone = stone + x;
	stoneText = 'Stone: ' + stone;
}

/*****
** DESCRIPTION: ADDS WOOD AMOUNT SPECIFIED BY NUMBER TO CURRENT COUNT
** UPDATES AMOUNT ON SCREEN
*****/
function updateWood(x)
{
	wood = wood + x;
	woodText = 'Wood: ' + wood;
}

/*****
** DESCRIPTION: DETRACTS HEALTH AMOUNT FROM USER SPECIFIED BY NUMBER
** UPDATES AMOUNT ON SCREEN; IF HEALTH IS <= 0, GAME ENDS
*****/
function updateThisHealth(x)
{
	thisHealth = thisHealth - x;
	thisHealthText = 'Health: ' + thisHealth;
	
	// IMPLEMENTS GAME OVER FUNCTION
	/*
	if (thisHealth <= 0)
	{
		gameOver();
	}
	*/
}

/*****
** DESCRIPTION: DETRACTS HEALTH AMOUNT FROM ENEMY SPECIFIED BY NUMBER
** UPDATES AMOUNT ON SCREEN. IF HEALTH IS <= 0, GAME ENDS
*****/
function updateEnemyHealth(x)
{
	enemyHealth = enemyHealth - x;
	enemyHealthText = 'Enemy Health: ' + enemyHealth;

	// IMPLEMENTS GAME OVER FUNCTION
	/*
	if (enemyHealth <= 0)
	{
		gameOver();
	}
	*/
}

/*****
** DESCRIPTION: SAVES THE CURRENT GAME STATE
** RETURNS NOTHING
*****/
function saveGame()
{
	var test = Perseus.game.add.text(100, 200, 'You clicked the SAVE button', style);
}

/*****
** DESCRIPTION: QUITS THE CURRENT GAME STATE
** IMMEDIATELY LOADS MAIN MENU
*****/
function quitGame()
{
	var test = Perseus.game.add.text(100, 300, 'You clicked the QUIT button', style);
	//gameOver();
}

/*****
** DESCRIPTION: RESTARTS THE GAME FROM SCRATCH
** RETURNS NOTHING
*****/
function newGame()
{
	var test = Perseus.game.add.text(100, 400, 'You clicked the NEW GAME button', style);
}

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

Perseus.game.state.add('Main', Main);
Perseus.game.state.add('Boot', Boot);
Perseus.game.state.add('MainMenu', MainMenu);
Perseus.game.state.start('Boot');



