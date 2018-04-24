var Perseus = Perseus || {};


let gameScene = new Phaser.Scene('Game');

// our game's configuration
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 320, // game width
  height: 320, // game height
  scene: gameScene // our newly created scene
};
 
// create the game, and pass it the configuration
let game = new Phaser.Game(config);

// load asset files for our game
gameScene.preload = function() {
  // load images
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
    this.load.image('gameTiles', 'assets/images/level1.png');
  },
 
  // executed once, after assets were loaded
	gameScene.create = function() {

		// this.map = this.add.tilemap('map');
        let bg = this.add.sprite(0,0, 'gameTiles');
        bg.setOrigin(0.0);
        bg.setScale(2.);

        //@TODO Find a way to set up Tiled JSON maps with Phaser 3 API
		// this.map.addTilesetImage('tiles', 'gameTiles');
		//create layer
		// this.backgroundlayer = this.map.createStaticLayer('Title Layer 1', this.map.tilesets[0], 0, 0);

		//resizes the game world to match the layer dimensions
        // this.backgroundlayer.resizeWorld();

		//move player with cursor keys
		this.cursors = game.input.keyboard.createCursorKeys();
	}

	gameScene.update = function() {
		Perseus.panCamera();
	}

	Perseus.panCamera = function(){
		// Camera Panning
		console.log("panning");

		if(this.cursors.up.isDown) {
            game.camera.y += 10;
		}
		if(this.cursors.down.isDown) {
            game.camera.y -= 10;
		}
		// else if(this.cursors.down.isDown) {
		// 	if(this.player.body.velocity.y == 0)
		// 		this.player.body.velocity.y += 50;
		// }
		// else {
		// 	this.player.body.velocity.y = 0;
		// }
		// if(this.cursors.left.isDown) {
		// 	this.player.body.velocity.x -= 50;
		// }
		// else if(this.cursors.right.isDown) {
		// 	this.player.body.velocity.x += 50;
		// }
	}
