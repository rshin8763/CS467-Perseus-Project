class Navigator {
    constructor(game, xTiles, yTiles, tileSize){
        this.game = game;

        this.xTiles = xTiles;
        this.yTiles = yTiles;
        this.tileSize = tileSize;

        this.navmap = [];
        for(let x = 0; x < this.xTiles; x++){
            this.navmap[x] = new Uint8Array(this.yTiles);
            }
    }

    getSquare(x,y){
        let box = {};
        box.x = Math.floor(x/this.tileSize);
        box.y = Math.floor(y/this.tileSize);

        return (box);
    }

    getCoords(x, y)
    {
        let coords = {};
        coords.x = (x*32);
        coords.y = (y*32);

        return coords;
    }

    findNextNode(unit, target)
    {
        const start = this.getSquare(unit.sprite.x + this.tileSize, unit.sprite.y + this.tileSize);
        let current = {
            x : start.x,
            y : start.y,
            h : this.getDistance(start.x, start.y, target),
            g : 0,
            parent: null
        };

        let open = [];
        let closed = [];

        do{
            let neighbors = this.getNeightbors(current, target);
            for(let i = 0; i < neighbors.length; i++ )
            {
                open.push(neighbors[i]);
            }
            let min = null;
            for(let i = 0; i < open.length; i++)
            {
                if(min == null || open[i].f < min.f)
                {
                    min = open[i];
                }

            }

            //remove node from Open
            for(let i = 0; i < open.length; i++)
            {
                if(min === open[i] )
                {
                    open.splice(i, 1);
                }
            }

            //Add node to closed
            closed.push(min);
            current = min;
            let coords = this.getCoords(min.x, min.y);
            this.game.add.sprite(coords.x, coords.y, 'navSquare');
        }while(current.x != target.x || current.y != target.y)

            return closed[0];
    }

    getNeightbors(node, target){
        let neighbors = [];
        //WEST
        if(node.x > 0 && this.navmap[node.x-1][node.y] == 0)
        {
            neighbors.push(this.createNode(node.x-1, node.y, node, target));
            //Northwest
            if(node.y > 0 && this.navmap[node.x-1][node.y-1] == 0)
            {
                neighbors.push(this.createNode(node.x-1, node.y-1, node, target));
            }

            //Southwest
            if(node.y < this.yTiles - 1 && this.navmap[node.x-1][node.y+1] == 0)
            {
                neighbors.push(this.createNode(node.x-1, node.y+1, node, target));
            }
        }
        //EAST
        if(node.x < this.xTiles -1 && this.navmap[node.x + 1][node.y] == 0)
        {
            neighbors.push(this.createNode(node.x+1, node.y, node, target));
            //Northeast
            if(node.y > 0 && this.navmap[node.x+1][node.y-1] == 0)
            {
                neighbors.push(this.createNode(node.x+1, node.y-1, node, target));
            }

            //Southeast
            if(node.y < this.yTiles - 1 && this.navmap[node.x+1][node.y+1] == 0)
            {
                neighbors.push(this.createNode(node.x+1, node.y+1, node, target));
            }
        }
        //NORTH
        if(node.y > 0 && this.navmap[node.x][node.y-1] == 0)
        {
            neighbors.push(this.createNode(node.x, node.y-1, node, target));
        }
        //SOUTH
        if(node.y < this.yTiles - 1  && this.navmap[node.x][node.y+1] == 0)
        {
            neighbors.push(this.createNode(node.x, node.y+1, node, target));
        }

        return neighbors;
    }
    getDistance(x, y, target){
        let hDiffernce = Math.abs(target.x - x);
        let yDifference = Math.abs(target.y - y);

        return hDiffernce + yDifference;
    }

    createNode(x,y, current, target)
    {

        let node = {
            x : x,
            y : y,
            h : this.getDistance(x, y, target),
            g : current.g + 1,
            f : this.getDistance(x,y, target) + current.g + 1,
            parent : current
        }

        return node;
    }

}

export {Navigator};