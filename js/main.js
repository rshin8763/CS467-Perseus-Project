import {SwordInfantry} from './swordInfantry.js'
// var Phaser = require('phaser-ce');
var Perseus = Perseus || {};

// create the game, and pass it the configuration
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var wasDown = false;
var startPos;
var endPos;


function preload() {
	this.load.tilemap('demo', 'assets/tilemaps/demo.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('gameTiles', 'assets/images/tiles.png');
	this.load.image('barracks32x32', 'assets/barracks.png');
	this.load.image('fort32x32', 'assets/fort-debug.png');
    
    // this.load.image('ui', 'assets/images/stoneMenu.png');

	this.load.spritesheet('swordsman', 'assets/swordsman32x32.png', 32, 32);
	this.load.spritesheet('swordswoman', 'assets/swordswoman32x32.png',32, 32);
	this.load.spritesheet('worker_male', 'assets/worker_male32x32.png', 32, 32);
	this.load.spritesheet('worker_female', 'assets/worker_female32x32.png', 32, 32);
    this.stage.backgroundColor = 0x000000
}


function create() {
	//
	this.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.map.addTilesetImage('tiles', 'gameTiles');

	//create layer
	this.backgroundlayer = this.map.createLayer('backgroundLayer');

	//resizes the game world to match the layer dimensions
	this.backgroundlayer.resizeWorld();

	//Create input objects
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pointer = this.game.input.mousePointer;

	//Create an objects array on the game object and add a soldier to it.
	this.objects = [];
	this.objects.push(new SwordInfantry(50, 50, this));

	//Create two soldiers
	this.objects.push(new SwordInfantry(100, 400, this));
	this.objects.push(new SwordInfantry(100, 100, this));
}

function update(){

    //Draw selection box
	if(this.graphics){
		this.graphics.destroy();
	}
	this.graphics = this.add.graphics();
	this.graphics.lineStyle(2, 0xFFFFFF, 1);

	//camera pan
	if(this.cursors.up.isDown || (this.camera.length - this.pointer.position.y) >= 550 ){
		game.camera.y -= 10;
	}
	if(this.cursors.down.isDown || (this.camera.length - this.pointer.position.y) <= 50 ){
		game.camera.y += 10;
	}
	if(this.cursors.left.isDown || (this.camera.width - this.pointer.position.x) >= 750 ){
		game.camera.x -= 10;
	}
	if(this.cursors.right.isDown || (this.camera.width - this.pointer.position.x) <= 50 ){
		game.camera.x += 10;
	}
	// mouse selection box
    //
	if (wasDown == false) {
		if (this.pointer.isDown == true){
			console.log('starting selection box');
			startPos = this.pointer.positionDown; 
			console.log(this.pointer.positionDown);
		}
	} if (wasDown == true) {
		if (this.pointer.isDown == false){
			console.log('finishing selection box');
			endPos = this.pointer.positionUp;
			console.log(endPos);
			this.graphics.drawRect(Math.min(startPos.x, endPos.x) + game.camera.x, Math.min(startPos.y, endPos.y)+ game.camera.y, Math.abs(endPos.x-startPos.x), Math.abs(endPos.y-startPos.y));
            //Add interesecting objects to selected Objects
            console.log(this.objects);
            game.selectedObjects = [];
            // Select objects
            this.objects.forEach(function(obj){
                console.log(obj.sprite.x, obj.sprite.y);
                if(startPos.x <= obj.sprite.x  && obj.sprite.x <= endPos.x){
                    if (startPos.y <= obj.sprite.y && obj.sprite.y <= endPos.y){
                        console.log("this is inside foreach");
                        game.selectedObjects.push(obj);
                        console.log(game.selectedObjects);
                    }
                }
            })
		}
		else if (this.pointer.isDown == true){
			//draw rectangle
			endPos = this.pointer.position;
			this.graphics.drawRect(Math.min(startPos.x, endPos.x) + game.camera.x, Math.min(startPos.y, endPos.y) + game.camera.y, Math.abs(endPos.x-startPos.x), Math.abs(endPos.y-startPos.y));
		}
	}

	wasDown = this.pointer.isDown;

	//Call the update function on each game object
	this.objects.forEach(function(obj){
		obj.update();
	})
}

