//my functions TODO put in objects


//TODO set anchor point of all units to the center, not the corner

import {SwordInfantry} from './swordInfantry.js';
import {mapRenderer} from './mapRenderer.js';
import {Fort} from './fort.js';
import {Tree} from './tree.js';

// var Phaser = require('phaser-ce');
var Perseus = Perseus || {};

// create the game, and pass it the configuration
Perseus.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var wasDown = false;
var startPos;
var endPos;

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
	this.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.map.addTilesetImage('forestTiles', 'gameTiles');

	//create layer
	this.backgroundLayer= this.map.createLayer('backgroundLayer');
	this.collisionLayer = this.map.createLayer('collisionLayer');

	// Sets collision  TODO make it work with unit's move method.
	this.map.setCollisionByExclusion([], true, this.collisionLayer, true);

	//resizes the game world to match the layer dimensions
	this.backgroundLayer.resizeWorld();

	//Create input objects
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pointer = this.game.input.mousePointer;
	this.keys = {};
	this.keys.A = this.game.input.keyboard.addKey(Phaser.KeyCode.A);
	this.keys.M = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
	this.keys.X = this.game.input.keyboard.addKey(Phaser.KeyCode.X);
	this.controlState = 'default';

	//Create an objects array on the game object and add a soldier to it.
	this.objects = [];
	this.objects.push(new SwordInfantry(250, 250, this));

	//Create two soldiers
	this.objects.push(new SwordInfantry(200, 400, this));
	this.objects.push(new SwordInfantry(300, 300, this));

    //Create resources
    this.mapRenderer = new mapRenderer(this);
    this.mapRenderer.createResources();

	// Create GUI bar
	game.ui = {}
	game.ui.bar = this.add.sprite(0,0,'ui');
	game.ui.bar.height = 600;
	// 6 32px tiles
	game.ui.bar.width =  192;
}

function update(){
	// Destroy old selection box
	if(this.graphics){
		this.graphics.destroy();
	}
	this.graphics = this.add.graphics();
	this.graphics.lineStyle(2, 0xFFFFFF, 1);

	//camera pan
	//TODO encapsulate this in interface object methods
    //TODO Selection box only selects units from left to right ATM.

	if(this.cursors.up.isDown || (this.camera.height - this.pointer.position.y) >= 32 ){
		let temp = game.camera.y 
			game.camera.y -= 10;
		game.ui.bar.y += game.camera.y - temp;
	}
	if(this.cursors.down.isDown || (this.camera.height - this.pointer.position.y) <= this.camera.height-32 ){
		let temp = game.camera.y 
			game.camera.y += 10;
		game.ui.bar.y += game.camera.y - temp;
	}
	if(this.cursors.left.isDown || (this.camera.width - this.pointer.position.x) >= this.camera.width-32 ){
		let temp = game.camera.x 
			game.camera.x -= 10;
		game.ui.bar.x += game.camera.x - temp;
	}
	if(this.cursors.right.isDown || (this.camera.width - this.pointer.position.x) <= 32 ){
		let temp = game.camera.x 
			game.camera.x += 10;
		game.ui.bar.x += game.camera.x - temp;
	}
	if(this.keys.A.isDown){
		if (this.pointer.isDown == false){
			this.controlState = 'attack';
			console.log(this.controlState);
			console.log('input attack command');
		}
	}
	if(this.keys.M.isDown){
		if (this.pointer.isDown == false){
			this.controlState = 'move';
			console.log('input move command');
		}
	}
    // Cancel command ( no right click yet)
    if (this.keys.X.isDown){
        this.controlState = 'default';
        console.log('controller state is default');
    }

	// TODO force BOX selection to end at UI bar
	if (wasDown == false) {
		if (this.pointer.isDown == true){
			if (this.controlState == 'default'){
				console.log('starting selection box');
				startPos = this.pointer.positionDown; 
				console.log(this.pointer.positionDown);
			} else if (this.controlState == 'attack'){
				game.selectedObjects.forEach((obj) => {
					obj.move(this.pointer.positionDown.x, this.pointer.positionDown.y);
					this.controlState = 'default';
				});
			} else if (this.controlState == 'move'){
				game.selectedObjects.forEach((obj) => {
					console.log('moving');
					obj.move(this.pointer.positionDown.x, this.pointer.positionDown.y);
					this.controlState = 'default';
				});
			}
		}
	} if (wasDown == true) {
		if (this.pointer.isDown == false){
			if (this.controlState == 'default'){
				console.log('finishing selection box');
				endPos = this.pointer.positionUp;
				console.log(endPos);
				this.graphics.drawRect(Math.min(startPos.x, endPos.x) + game.camera.x, Math.min(startPos.y, endPos.y)+ game.camera.y, Math.abs(endPos.x-startPos.x), Math.abs(endPos.y-startPos.y));
				//Add interesecting objects to selected Objects
				game.selectedObjects = [];
				// Select objects
				this.objects.forEach(function(obj){
					console.log(obj.sprite.x, obj.sprite.y);
					if(startPos.x <= obj.sprite.x  && obj.sprite.x <= endPos.x){
						if (startPos.y <= obj.sprite.y && obj.sprite.y <= endPos.y){
							console.log("this is inside foreach");
							game.selectedObjects.push(obj);
							console.log(game.selectedObjects);
							game.selectedObjects.forEach((obj)=>{
								//TODO implement function to draw white circle around units.
								obj.drawSelectionCircle();
							});
						}
					}
				})
			}
		}
		else if (this.pointer.isDown == true){
			if (this.controlState == 'default'){
				//draw rectangle
				endPos = this.pointer.position;
				this.graphics.drawRect(Math.min(startPos.x, endPos.x) + game.camera.x, Math.min(startPos.y, endPos.y) + game.camera.y, Math.abs(endPos.x-startPos.x), Math.abs(endPos.y-startPos.y));
			}
		}
	}
    
	wasDown = this.pointer.isDown;

	//Call the update function on each game object
	this.objects.forEach(function(obj){
		obj.update();
	});
}

