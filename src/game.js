// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
 
// our game's configuration
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 640, // game width
  height: 360, // game height
  scene: gameScene // our newly created scene
};
 
// create the game, and pass it the configuration
let game = new Phaser.Game(config);

//init

//preload
gameScene.preload = function(){
    // load tilemap and tiles
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles.png');
}

//create
gameScene.create = function(){
    this.map = this.game.add.tilemap('level1');
    this.backgroundlayer = this.map.createLayer('backgroundLayer');

}

//update
gameScene.update = function(){
}
