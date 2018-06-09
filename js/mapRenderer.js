import {Tree} from './tree.js';
import {Fort} from './fort.js';
import {Navigator} from './navigator.js';

class mapRenderer{
    constructor(Perseus){
        this.Perseus = Perseus;
        // this.initialize();
    }

    initialize(){
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.Perseus.map.addTilesetImage('forestTiles', 'gameTiles');
        //create layer
        this.Perseus.backgroundLayer = this.Perseus.map.createLayer('backgroundLayer');
        this.Perseus.dirtLayer = this.Perseus.map.createLayer('dirtLayer');
        this.Perseus.collisionLayer = this.Perseus.map.createLayer('collisionLayer');
        this.Perseus.rockLayer = this.Perseus.map.createLayer('rockLayer');
        //resizes the game world to match the layer dimensions
        this.Perseus.backgroundLayer.resizeWorld();

        this.createResources();
    }

    //These functions were adapted from https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
    getObjects(map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            //console.log(element);
            if(element.type != '') {
                result.push(element);
            }      
        });
        return result;
    }

    //create a sprite from an object
    createFromTiledObject(element, Perseus) {
        if (element.type == 'tree'){
            new Tree(Math.floor(element.x), Math.floor(element.y), this.Perseus);
        }


    }

    createResources(){

        // Set navmap for collision
        for (let i = 0; i < this.Perseus.map.height; i++){
            for (let j = 0; j < this.Perseus.map.width; j++){
                let tile = this.Perseus.collisionLayer.layer.data[i][j];
                if (tile.index != -1){
                    this.Perseus.navigator.markOccupied(j,i);
                }
            }
        }
        for (let i = 0; i < this.Perseus.map.height; i++){
            for (let j = 0; j < this.Perseus.map.width; j++){
                let tile = this.Perseus.rockLayer.layer.data[i][j];
                if (tile.index != -1){
                    this.Perseus.navigator.setIsRock(j,i);
                }
            }
        }

        // TODO Change name to objectLayer
        let result = this.getObjects(this.Perseus.map, 'resourceLayer');
        result.forEach((obj)=>{
            this.createFromTiledObject(obj, this.Perseus)
        }, this);
    }
}

export {mapRenderer};

