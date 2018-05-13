import {Tree} from './tree.js'
import {Fort} from './fort.js'
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
            console.log('creating tree');
            Perseus.resources.push(new Tree(element.x+32, element.y+32, this.Perseus));

        }
        if (element.type == 'fort'){
            Perseus.objects.push(new Fort('human', element.x+64, element.y+64, this.Perseus));
        }
    }

    createResources(){
        this.Perseus.resources = [];

        // TODO Change name to objectLayer
        let result = this.getObjects(this.Perseus.map, 'resourceLayer');
        result.forEach((obj)=>{
            this.createFromTiledObject(obj, this.Perseus)
        }, this);
    }
}

export {mapRenderer};

