import {BinaryHeap} from './BinaryHeap.js';

/****************************
 * Navigator Object
 * 
 ******************************/
class Navigator {
    constructor(game, xTiles, yTiles, tileSize){
        this.game = game;

        this.xTiles = xTiles;
        this.yTiles = yTiles;
        this.tileSize = tileSize;
        this.recalc = false;
        this.units = [];
        this.navmap = [];
        for(let x = 0; x < this.xTiles; x++){
            this.navmap[x] = new Uint8Array(this.yTiles);
            }
    }

    //Get the navmap square based on x,y coordinates
    getSquare(x,y){
        let box = {};
        box.x = Math.floor(x/this.tileSize);
        box.y = Math.floor(y/this.tileSize);

        return (box);
    }

    //Get x,y coordinates based on the navmap square
    getCoords(x, y)
    {
        let coords = {};
        coords.x = (x*this.tileSize) + this.tileSize / 2;
        coords.y = (y* this.tileSize) + this.tileSize / 2;

        return coords;
    }

    //Mark square (x,y) as occupied (1)
    markOccupied(x,y)
    {
        //Make sure that x,y is valid
        if(x > this.xTiles || 
           x < 0 ||
           y > this.yTiles || 
           y < 0)
        {
            return;
        }

        this.navmap[x][y] = 1;

    }

    //Mark square (x,y) as not occupied (0)
    markNotOccupied(x,y)
    {
        //Make sure that x,y is valid
        if(x >= this.xTiles || 
            x < 0 ||
            y >= this.yTiles || 
            y < 0)
         {
             return;
         }

        this.navmap[x][y] = 0;
    }

    //Implements an A* routing algorithm. Then returns the next node in the path
    //Written by Michael Downing referencing pseudocode at: https://briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated/
    //   and utilizing Marijn Haverbeke's Binary Heap implementation available at http://eloquentjavascript.net/1st_edition/appendix2.html 
    findPath(unit, target)
    {
        let start = {
            x : unit.x,
            y : unit.y,
            h : this.getDistance(unit.x, unit.y, target),
            g : 0,
            visited : true,
            closed : false,
            parent: null
        };

        let open = new BinaryHeap(function(x){return x.h;});
        let visited = [this.yTiles];
        for(let i = 0; i < this.yTiles; i++)
        {
            for(let j = 0; j < this.xTiles; j++)
            {
                visited[i] = [];
                visited[i].push(0);
            }
        }

        open.push(start);
        while(open.content.length > 0)
        {
            let currentNode = open.pop();
            if(currentNode.x == target.x && currentNode.y == target.y)
            {
                let path = [];
                while(currentNode.x != start.x || currentNode.y != start.y)
                {
                    path.unshift(currentNode);
                    currentNode = currentNode.parent;
                }           
                return path;
            } else{
                currentNode.closed = true;
                let neighbors = this.getNeightbors(currentNode, target);
                for(let i = 0; i < neighbors.length; i++)
                {
                    if(visited[neighbors[i].y][neighbors[i].x] != 1)
                    {
                        visited[neighbors[i].y][neighbors[i].x] = 1;
                        open.push(neighbors[i]);
                    }
                }
            }
        }

    }
   
    //Just give me the first step in the path
    findNextNode(unit, target)
    {
        return this.findPath(unit, target)[0];

    }


    //Create nodes representing the squares around a given node
    getNeightbors(node, target){
        let neighbors = [];
        
        if(node.x > 0 )
        {
            //West
            if(this.navmap[node.x-1][node.y] == 0)
            {
                neighbors.push(this.createNode(node.x-1, node.y, node, target));
            }
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
        
        if(node.x < this.xTiles -1)
        {
            //East
            if(this.navmap[node.x + 1][node.y] == 0)
            {
                neighbors.push(this.createNode(node.x+1, node.y, node, target));
            }
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

    //Get the distance to from x,y to the target square
    getDistance(x, y, target){
        let hDiffernce = Math.abs(target.x - x);
        let yDifference = Math.abs(target.y - y);

        let min = Math.min(hDiffernce, yDifference);

        //Using Diagnal Distance and Biasing the h value of each square so that the nav alg. checks many fewer squares
        //http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html was SUPER helpful
        return ((hDiffernce + yDifference) + (-1 * min)) * (1.0 + (1/500));
    }


    //Create a node for the A* algorithm
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

    //Check for collisions with this unit
    checkCollision(unit){
    
        //Check each other unit of which the navigator is aware 
        this.units.forEach((u) =>{
            if(!(Object.is(unit, u)))
            {
                let ax, ay, bx, by;

                //If the unit is moving we will check it's nextSquare (ie, where it's going). 
                //If it isn't moving, we'll check the square it's currently occupying
                if(unit.nextSquare != null && unit.moving == true)
                {
                    
                    ax = unit.nextSquare.x;
                    ay = unit.nextSquare.y;
                } else {
                    ax = unit.x;
                    ay = unit.y;
                }

                //Same for each unit it's checking against
                if(u.moving == true )
                {

                    bx = u.nextSquare.x;
                    by = u.nextSquare.y;
                } else {
                    bx = u.x;
                    by = u.y;
                }

                //If there is a collision, resolve it.
                if(ax == bx && ay == by)
                {
                    this.resolveCollision(unit, u);
                }
            }
        });
    }

    //Set a square (x,y) as rock (2)
    setIsRock(x,y)
    {
        if(x < 0 || y < 0 || x >= this.xTiles || y >= this.yTiles)
        {
            return;
        }

        this.navmap[x][y] = 2;
    }

    //Check if a nav square is considered rock
    checkIsRock(x,y)
    {
        if(x < 0 || y < 0 || x >= this.xTiles || y >= this.yTiles)
        {
            return false;
        }else{
            return this.navmap[x][y] == 2;
        }
    }

    //Check if there is any unit standing in a given nav square
    isOccupied(x, y, faction)
    {
        for(let i = 0; i < this.units.length; i++)
        {
            
            if(x == this.units[i].x && y == this.units[i].y)
            {
                if(faction == null || faction == this.units[i].faction)
                {
                    return true;
                }
            }

            if(x == this.units[i].dest.x && y == this.units[i].dest.y)
            {
                if(faction == null || faction == this.units[i].faction)
                {
                    return true;
                }            
            }
        }
        
        return false;
    }


    //Find open border squares around an object
    findObjectBorder(obj, origin)
    {
        let squares = [];
        let width = Math.floor(obj.sprite.width/32);
        let height = Math.floor(obj.sprite.height/32);

        let x = obj.x;
        let y = obj.y;
        //North
        for(let i = 0; i < width; i++)
        {
            if(this.navmap[x+i][y-1] != 1)
            {
                if(!this.isOccupied(x+i, y-1))
                {
                    let d = this.getDistance(x+i, y-1, origin);
                    squares.push({x :x+i, y: y-1, d:d});
                }
            }
        }

        //South
        for(let i = 0; i < width; i++)
        {
            if(this.navmap[x+i][y+ height] != 1)
            {
                if(!this.isOccupied(x+i, y + height))
                {
                    let d = this.getDistance(x+1, y + height, origin);
                    squares.push({x :x+i, y: y + height, d:d});
                }
            }
        }

        //WEST
        for(let i = 0; i < height; i++)
        {
            if(this.navmap[x-1][y+i] != 1)
            {
                if(!this.isOccupied(x-1, y+i))
                {
                    let d = this.getDistance(x-1, y+i, origin);
                    squares.push({x :x-1, y: y+i, d:d});
                }
            }
        }

        //EAST
        for(let i = 0; i < height; i++)
        {
            if(this.navmap[x + width][y+i] != 1)
            {
                if(!this.isOccupied(x + width, y+i))
                {
                    let d = this.getDistance(x + width, y+i, origin);
                    squares.push({x :x + width, y: y+i, d:d});
                }
            }
        }

        //NorthWest
        if(this.navmap[x-1][y-1] != 1)
        {
            if(!this.isOccupied(x-1, y-1))
            {
                let d = this.getDistance(x-1, y-1, origin);
                squares.push({x : x-1, y : y-1, d:d});
            }
        }

        //NorthEast
        if(this.navmap[x + width][y-1] != 1)
        {
            if(!this.isOccupied(x + width, y-1))
            {
                let d = this.getDistance(x + width, y-1, origin);
                squares.push({x : x + width, y : y-1, d:d});
            }
        }

        //SouthWest
        if(this.navmap[x-1][y + height] != 1)
        {
            if(!this.isOccupied(x-1, y + height))
            {
                let d = this.getDistance(x-1, y + height, origin);
                squares.push({x : x-1, y : y + height, d:d});
            }
        }

        //SouthEast
        if(this.navmap[x + width][y + height] != 1)
        {
            if(!this.isOccupied(x + width, y + height))
            {
                let d = this.getDistance(x + width, y + height, origin);
                squares.push({x : x + width, y : y + height, d:d});
            }
        }

        squares.sort(function(a,b){return a.d-b.d});
        return squares; 

    
    }


    //Find all the empty squares around a square
    findAllEmpty(x,y, origin)
    {
        let empties = [];
        //North
        if(this.navmap[x][y-1] != 1)
        {
            if(!this.isOccupied(x, y-1))
            {
                let d = this.getDistance(x, y-1, origin);

                empties.push({x: x, y: y-1, d: d});
        
            }
        }
        //East
        if(this.navmap[x+1][y] != 1)
        {
            
            if(!this.isOccupied(x+1, y))
            {
                let d = this.getDistance(x+1, y, origin);
                empties.push({x: x+1, y: y, d: d});
            }
        }

        //South
        if(this.navmap[x][y+1] != 1)
        {
            if(!this.isOccupied(x, y+1))
            {
                let d = this.getDistance(x, y+1, origin);
                empties.push({x: x, y: y+1, d: d});
            }
        }

        //West
        if(this.navmap[x-1][y] != 1)
        {
            if(!this.isOccupied(x-1, y))
            {                
                let d = this.getDistance(x-1, y, origin);          
                empties.push({x: x-1, y: y, d: d});
            }
        }

        //Northwest
        if(this.navmap[x-1][y-1] != 1)
        {
            if(!this.isOccupied(x-1, y-1))
            {
                let d = this.getDistance(x-1, y-1, origin);
                empties.push({x: x-1, y: y-1, d: d});
            }
        }

        //Northeast
        if(this.navmap[x+1][y-1] != 1)
        {
            if(!this.isOccupied(x+1, y-1))
            {
                let d = this.getDistance(x+1, y-1, origin);
                empties.push({x: x+1, y: y-1, d: d});
            }
        }

        //Southwest
        if(this.navmap[x-1][y+1] != 1)
        {
            if(!this.isOccupied(x-1, y+1))
            {
                let d = this.getDistance(x-1, y+1, origin);
                empties.push({x: x-1, y: y+1, d: d});
            }
        }

        //Southeast
        if(this.navmap[x+1][y+1] != 1)
        {
            if(!this.isOccupied(x+1, y+1))
            {
                let d = this.getDistance(x+1, y+1, origin);
                empties.push({x: x+1, y: y+1, d:d});
            }
        }
        empties.sort(function(a,b){return a.d - b.d});
        return empties;
    }

    //Find the distance between two squares. (x,y) and origin (which is just a packaged x,y)
    getDistance(x,y, origin)
    {
        let dx = x - origin.x;
        let dy = y-1 - origin.y;

        let d = Math.sqrt((dx*dx) + (dy*dy));
        return d;
    }
    
    //Return one random empty square
    findEmpty(x, y)
    {
        let origX = x;
        let origY = y;
        do{
            x = origX;
            y = origY;
        let dir = Math.floor(Math.random() * 8);
        switch(dir){
            case 0:
                x++;
                break;
            case 1:
                x--;
                break;
            case 2:
                y++;
                break;
            case 3:
                y--;
                break;
            case 4:
                x++;
                y++;
                break;
            case 5:
                x++;
                y--;
                break;
            case 6:
                x--;
                y++;
                break;
            case 7:
                x--;
                y--;
                break;       
        }
        if(x < 0 || y < 0 || x >= this.xTiles || y >= this.yTiles)
        {
            x=0;
            y=0;
            continue;
        }
        }while(this.navmap[x][y] == 1)

        return {x : x, y: y};
    }

    //Figure out how to move two units who are in conflict
    resolveCollision(unit1, unit2)
    {
        //console.log("Collision between " + unit1.type + " and " + unit2.type);

        //Both units are stopped on top of eachother so move one of them
        if(unit1.moving == false && unit2.moving == false)
        {
            let newSquare = this.findEmpty(unit1.x, unit1.y);
            let newCoords = this.getCoords(newSquare.x, newSquare.y);
            unit1.move(newCoords.x, newCoords.y);
            return;
        }

        //Unit1 is moving and unit 2 isn't, so if unit1 is finishing in unit2's square, stop it, otherwise, let it keep going.
        if(unit1.moving == true && unit2.moving == false)
        {
            if(unit1.nextSquare.x == unit1.dest.x && unit1.nextSquare.y == unit1.dest.y)
            {
                unit1.stop();
                return
            }
            return;
        }

        //Unit2 is moving and unit1 isn't, so if unit2 is finishing in unit1's square, stop it, otherwise, let it keep going.
        if(unit2.moving == true && unit1.moving == false)
        {
            if(unit2.nextSquare.x == unit2.dest.x && unit2.nextSquare.y == unit2.dest.y)
            {
                unit2.stop();
                return;
            }
            return;
        }


        //Both units are moving. If they are headed for the same square reroute one of them to an adjacent square
        if(unit2.moving == true && unit1.moving == true)
        {
            if(unit1.dest.x == unit2.dest.x && unit1.dest.y == unit2.dest.y)
            {
                let newDest = this.findEmpty(unit1.dest.x, unit1.dest.y);
                let newCoords = this.getCoords(newDest.x, newDest.y);
                unit1.move(newCoords.x, newCoords.y);
            }
        }

    }

}

export {Navigator};
