var Perseus = Perseus || {};

//loading the game assets
Perseus.Preload = function(){};

//Preload object
Perseus.Preload.prototype = {
  preload: function() {
    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
  },
  create: function() {
    this.state.start('Game');
  }
};
