import {Tree} from './tree.js'
class mapRenderer{
    constructor(game){
        this.game = game;
    }

    //These functions were adapted from https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
    findObjectsByType(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            console.log(element);
            if(element.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact pixel position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }      
        });
        return result;
    }

    //create a sprite from an object
    createFromTiledObject(element, resources, game) {
        resources.push(new Tree(element.x, element.y, game));
    }

    createResources(){
        this.game.resources = [];

        let result = this.findObjectsByType('tree', this.game.map, 'resourceLayer');
        result.forEach((obj)=>{
            this.createFromTiledObject(obj, this.game.resources, this.game)
        }, this);
    }
}

export {mapRenderer};

