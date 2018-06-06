import {Tree} from './tree.js'
import {Fort} from './fort.js'
import {Navigator} from './navigator.js'

class mapRenderer{
    constructor(Perseus){
        this.Perseus = Perseus;
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
            Perseus.resources.push(new Tree(Math.floor(element.x), Math.floor(element.y), this.Perseus));
        }
        if (element.type == 'fort'){
            Perseus.objects.push(new Fort('human', Math.floor(element.x), Math.floor(element.y), this.Perseus));

        }
        if (element.type == 'enemyFort'){
            Perseus.objects.push(new Fort('orc', Math.floor(element.x), Math.floor(element.y), this.Perseus));

        }
    }

    createResources(){
        this.Perseus.resources = [];

        // Set navmap for collision
        for (let i = 0; i < this.Perseus.map.height; i++){
            for (let j = 0; j < this.Perseus.map.width; j++){
                let tile = this.Perseus.collisionLayer.layer.data[i][j];
                if (tile.index != -1){
                    this.Perseus.navigator.markOccupied(j,i);
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

