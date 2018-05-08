import {Tree} from './tree.js'
import {Fort} from './fort.js'
class mapRenderer{
    constructor(game){
        this.game = game;
    }

    //These functions were adapted from https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
    getObjects(map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            console.log(element);
            if(element.type != '') {
                //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                //TODO create logic to subtract the actual sprite height for trees, forts etc
                element.y -= map.tileHeight;
                result.push(element);
            }      
        });
        return result;
    }

    //create a sprite from an object
    createFromTiledObject(element, game) {
        if (element.type == 'tree'){
            game.resources.push(new Tree(element.x, element.y, game));
        }
        if (element.type == 'fort'){
            game.objects.push(new Fort(element.x, element.y, game));
        }
    }

    createResources(){
        this.game.resources = [];

        // TODO Change name to objectLayer
        let result = this.getObjects(this.game.map, 'resourceLayer');
        result.forEach((obj)=>{
            this.createFromTiledObject(obj, this.game)
        }, this);
    }
}

export {mapRenderer};

