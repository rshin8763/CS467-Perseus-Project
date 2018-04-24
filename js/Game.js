var Perseus = Perseus || {};

//title screen
Perseus.Game = function(){};

Perseus.Game.prototype = {
    create: function() {

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
