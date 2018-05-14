import {SwordInfantry} from './swordInfantry.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';

//I mostly changed the classes to pass around references of Perseus instead of game.
//Perseus now contains objects, controller, map, graphics
//Within Controller is the selected objects array. I still haven't changed anything to do with game.selected. 
//We will need to add different logic for group selecting units, while buildings and resource nodes should only be 
//able to be clicked directly. 
var Perseus = Perseus || {};
Perseus.graphics = {}

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//TODO set anchor point of all units to the center, not the corner

function preload() {
	this.load.tilemap('demo', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('topbar', 'assets/topbar.png');
	// TODO insert tiles url and creators
	this.load.image('gameTiles', 'assets/tilemaps/forestTiles.png');
	this.load.image('tree', 'assets/images/tree.png');
	this.load.image('barracks', 'assets/barracks.png');
	this.load.image('fort', 'assets/fort.png');
	this.load.image('ui', 'assets/ui/stoneMenu.png');
	this.load.spritesheet('swordsman', 'assets/swordsman.png', 64, 64);
	this.load.spritesheet('swordswoman', 'assets/swordswoman.png', 64, 64);
	this.load.spritesheet('worker_male', 'assets/worker_male.png', 64, 64);
	this.load.spritesheet('worker_female', 'assets/worker_female.png', 64, 64);
}

function create() {
    
    Perseus.ui = {};

	Perseus.map = this.game.add.tilemap('demo');

    Perseus.controller = new Controller(Perseus);

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	Perseus.map.addTilesetImage('forestTiles', 'gameTiles');

	//create layer
	Perseus.backgroundLayer= Perseus.map.createLayer('backgroundLayer');
	Perseus.collisionLayer = Perseus.map.createLayer('collisionLayer');

	// Sets collision  TODO make it work with unit's move method.
    // This uses phaser arcade physics. Since we are using a navmap,
    // TODO find a way to prarse collision layer tiles into navmap
	Perseus.map.setCollisionByExclusion([], true, Perseus.collisionLayer, true);


    //I added a 800x20 sprite that's just a blue bar
	let topbar = this.add.sprite(0, 0, 'topbar');
	//And set it fixed to Camera
	topbar.fixedToCamera = true;

	let style = { font: "12px Arial", fill: "#ffffff", align: "center" };

	this.barText = this.add.text(100, 0, "This number can change each update:", style);
	this.testText = "This number can change each update:";
	this.barText.fixedToCamera = true;

	this.count = 0;

	//resizes the game world to match the layer dimensions
	Perseus.backgroundLayer.resizeWorld();

	//Create an objects array on the game object and add a soldier to it.
	Perseus.objects = [];

	Perseus.objects.push(new SwordInfantry(250, 250, Perseus));
	Perseus.objects.push(new SwordInfantry(200, 400, Perseus));
	Perseus.objects.push(new SwordInfantry(300, 300, Perseus));

    //Create resources
    Perseus.mapRenderer = new mapRenderer(Perseus);
    Perseus.mapRenderer.createResources();

	// Create GUI bar
	let bar = this.add.sprite(0,0,'ui');
    bar.fixedToCamera = true;
	bar.height = 600;
	// 6 32px tiles
	bar.width =  192;
    Perseus.ui.bar = bar;

}

function update(){


    Perseus.controller.takeInput();
	this.count++;
	this.barText.text = this.testText +  " " + this.count;
	//Call the update function on each game object
	Perseus.objects.forEach(function(obj){
		obj.update();
	});
}

