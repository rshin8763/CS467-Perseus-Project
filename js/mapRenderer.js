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
            console.log(element);
            if(element.type != '') {
                result.push(element);
            }      
        });
        return result;
    }

    //create a sprite from an object
    createFromTiledObject(element, Perseus) {
        if (element.type == 'tree'){
            Perseus.resources.push(new Tree(element.x+32, element.y+32, this.Perseus));

        }
        if (element.type == 'fort'){
            Perseus.objects.push(new Fort('human', element.x+64, element.y+64, this.Perseus));

        }
        if (element.type == 'enemyFort'){
            Perseus.objects.push(new Fort('orc', element.x+64, element.y+64, this.Perseus));

        }
    }

    createResources(layer){
        this.Perseus.resources = [];

        // TODO Change name to objectLayer
        let result = this.getObjects(this.Perseus.map, 'resourceLayer');
        result.forEach((obj)=>{
            this.createFromTiledObject(obj, this.Perseus)
        }, this);

        //set navmap Rivers and Rock
        let background;
        this.Perseus.map.layers.forEach(function (layer){
            if (layer.name == 'backgroundLayer') background = layer;
        });

        for (let i = 0; i < layer.height; i++){
            for (let j = 0; j < layer.height; j++){
                let tile = background.data[i*50+j];
                // river
                if (tile >= 200){
                    //set no collision
                    this.Perseus.navigator.markOccupied(i,j);
                }
                if (tile <= 14){
                    //set as rock (able to build mines on)
                }
            }

        }
    }
}

export {mapRenderer};

