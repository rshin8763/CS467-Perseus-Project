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
}


function create() {
	//
	///
	this.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.map.addTilesetImage('tiles', 'gameTiles');

	//create layer
	this.backgroundlayer = this.map.createLayer('backgroundLayer');

	//resizes the game world to match the layer dimensions
	this.backgroundlayer.resizeWorld();

	//Create cursors
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pointer = this.game.input.mousePointer;

}

function update(){
	//camera pan
	if(this.graphics){
		this.graphics.destroy();
	}
	this.graphics = this.add.graphics();
	this.graphics.lineStyle(2, 0xFFFFFF, 1);

	//TODO replace hardcoded canvas values with game variables
	// See if there is a way to make second cursor, or mouse stay inside game boundaries.
	if(this.cursors.up.isDown || (600 - this.pointer.position.y) >= 550 ){
		game.camera.y -= 10;
	}
	if(this.cursors.down.isDown || (600 - this.pointer.position.y) <= 50 ){
		game.camera.y += 10;
	}
	if(this.cursors.left.isDown || (800 - this.pointer.position.x) >= 750 ){
		game.camera.x -= 10;
	}
	if(this.cursors.right.isDown || (800 - this.pointer.position.x) <= 50 ){
		game.camera.x += 10;
	}
	//
	// mouse selection box
	// TODO try to unpair this from the normal update function for faster polling
	// Is there a better way to create a consistent graphics object attached to game. then renaming variable every update()?
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
		}
		else if (this.pointer.isDown == true){
			//draw rectangle
			endPos = this.pointer.position;
			this.graphics.drawRect(Math.min(startPos.x, endPos.x) + game.camera.x, Math.min(startPos.y, endPos.y) + game.camera.y, Math.abs(endPos.x-startPos.x), Math.abs(endPos.y-startPos.y));
		}
	}

	wasDown = this.pointer.isDown;
}

