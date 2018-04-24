// var Phaser = require('phaser-ce');
var Perseus = Perseus || {};

// create the game, and pass it the configuration
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	this.load.tilemap('demo', 'assets/tilemaps/demo.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('gameTiles', 'assets/images/tiles.png');
}

function create() {
	this.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.map.addTilesetImage('tiles', 'gameTiles');

	//create layer
	this.backgroundlayer = this.map.createLayer('backgroundLayer');

	//resizes the game world to match the layer dimensions
	this.backgroundlayer.resizeWorld();

	//Create cursors
	this.cursors = this.game.input.keyboard.createCursorKeys();

}

function update(){
	if(this.cursors.up.isDown) {
		game.camera.y -= 10;
	}
	if(this.cursors.down.isDown) {
		game.camera.y += 10;
	}
	if(this.cursors.left.isDown) {
		game.camera.x -= 10;
	}
	if(this.cursors.right.isDown) {
		game.camera.x += 10;
	}
}

