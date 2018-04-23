var Perseus = Perseus || {};

//title screen
Perseus.Game = function(){};

Perseus.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('tiles', 'gameTiles');

        //create layer
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function() {
        this.panCamera();
    },
    panCamera: function(){
        // Camera Panning
        this.player.body.velocity.x = 0;

        if(this.cursors.up.isDown) {
            if(this.player.body.velocity.y == 0)
                this.player.body.velocity.y -= 50;
        }
        else if(this.cursors.down.isDown) {
            if(this.player.body.velocity.y == 0)
                this.player.body.velocity.y += 50;
        }
        else {
            this.player.body.velocity.y = 0;
        }
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
        }
    }
};
