//Namespace object
var Perseus = Perseus || {};

Perseus.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Perseus.Boot.prototype = {
  create: function() {
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
  }
};
