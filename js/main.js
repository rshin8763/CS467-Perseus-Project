
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
	this.load.image('topbar', 'assets/topbar.png');


	this.load.spritesheet('swordsman', 'assets/swordsman32x32.png', 32, 32);
	this.load.spritesheet('swordswoman', 'assets/swordswoman32x32.png',32, 32);
	this.load.spritesheet('swordsman', 'assets/archer_male.png', 32, 32);
	this.load.spritesheet('swordswoman', 'assets/archer_female.png',32, 32);
	this.load.spritesheet('worker_male', 'assets/worker_male32x32.png', 32, 32);
	this.load.spritesheet('worker_female', 'assets/worker_female32x32.png', 32, 32);

}


function create() {
	//
	///
	this.map = this.game.add.tilemap('demo');

	//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.map.addTilesetImage('tiles', 'gameTiles');

	//create layer
	this.backgroundlayer = this.map.createLayer('backgroundLayer', 800, 600);
	//this.backgroundlayer2 = this.map.createLayer('backgroundLayer')
	//resizes the game world to match the layer dimensions
	//this.backgroundlayer.fixedToCamera = false;
	this.backgroundlayer.resizeWorld();
	//this.backgroundlayer.alignIn(this.world.bounds, Phaser.TOP_LEFT, 0, -20);

	console.log(this.backgroundlayer);

	


    //I added a 800x20 sprite that's just a blue bar
	let topbar = this.add.sprite(0, 0, 'topbar');
	//And set it fixed to Camera
	topbar.fixedToCamera = true;

	let style = { font: "12px Arial", fill: "#ffffff", align: "center" };

	this.barText = this.add.text(100, 0, "This number can change each update:", style);
	this.testText = "This number can change each update:";
	this.barText.fixedToCamera = true;

	this.count = 0;




	//Create input objects
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pointer = this.game.input.mousePointer;

	//Create an objects array on the game object and add a soldier to it.
	this.objects = [];
	this.objects.push(new SwordInfantry(50, 50, this));

	//Create two soldiers
	this.objects.push(new SwordInfantry(100, 400, this));
	this.objects.push(new SwordInfantry(100, 100, this));

	//Command the first soldier to move to 300,300
	this.objects[0].move(300, 300);

	//Command the second soldioer to attack the third;
	this.objects[1].attack(this.objects[2]);
}

function update(){

	this.count++;
	this.barText.text = this.testText +  " " + this.count;
	//camera pan
	if(this.graphics){
		this.graphics.destroy();
	}
	this.graphics = this.add.graphics();
	this.graphics.lineStyle(2, 0xFFFFFF, 1);

	//TODO replace hardcoded canvas values with game variables
	// See if there is a way to make second cursor, or mouse stay inside game boundaries.
	console.log(620 - this.pointer.position.y );
	if(this.cursors.up.isDown || (620 - this.pointer.position.y) >= 550 ){
		game.camera.y -= 10;
	}
	if(this.cursors.down.isDown || (620 - this.pointer.position.y) <= 50 ){
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

	//Call the update function on each game object
	this.objects.forEach(function(obj){
		obj.update();
	})
}

