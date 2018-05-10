var Perseus = Perseus || {};
Perseus.graphics = {}

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//TODO set anchor point of all units to the center, not the corner
//TODO I mostly changed the classes to pass around references of Perseus instead of game.
//Perseus now contains objects, controller, map, graphics
//Within Controller is the selected objects array. I still haven't changed anything to do with game.selected. 
//We will need to add different logic for group selecting units, while buildings and resource nodes should only be 
//able to be clicked directly. 

import {SwordInfantry} from './swordInfantry.js';
import {mapRenderer} from './mapRenderer.js';
import {Controller} from './controller.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';

// var Phaser = require('phaser-ce');

function preload() {
	this.load.tilemap('demo', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);

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
	Perseus.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	Perseus.map.addTilesetImage('forestTiles', 'gameTiles');

	//create layer
	Perseus.backgroundLayer= Perseus.map.createLayer('backgroundLayer');
	Perseus.collisionLayer = Perseus.map.createLayer('collisionLayer');

	// Sets collision  TODO make it work with unit's move method.
	Perseus.map.setCollisionByExclusion([], true, Perseus.collisionLayer, true);

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
	Perseus.ui = {}
	Perseus.ui.bar = this.add.sprite(0,0,'ui');
	Perseus.ui.bar.height = 600;
	// 6 32px tiles
	Perseus.ui.bar.width =  192;

	//Create Controller 
    Perseus.controller = new Controller(Perseus);
}

function update(){

    Perseus.controller.takeInput();

	//Call the update function on each game object
	Perseus.objects.forEach(function(obj){
		obj.update();
	});
}

