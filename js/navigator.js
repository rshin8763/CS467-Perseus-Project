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

    markOccupied(x,y)
    {

        this.navmap[x][y] = 1;

    }

    markNotOccupied(x,y)
    {
        this.navmap[x][y] = 0;
    }

    //Implements an A* routing algorithm. Then returns the next node in the path
    findPath(unit, target)
    {
      let start = {x : unit.x, y : unit.y};
        let current = {
            x : unit.x,
            y : unit.y,
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
                    break;
                }
            }

            //Add node to closed
            closed.push(min);
            current = min;
            let coords = this.getCoords(min.x, min.y);
            let d = 1+1;
            // let navSquare = this.game.add.sprite(coords.x, coords.y, 'navSquare');
            // navSquare.anchor.x = 0.5;
            // navSquare.anchor.y = 0.5;
        }while(current.x != target.x || current.y != target.y)
            let path = [];
            while(current.x != start.x || current.y != start.y)
            {
                path.unshift(current);
                current = current.parent;
            }
            closed.length = 0;
            open.length = 0;
            path.forEach((node) =>
        {
            // let coords = this.getCoords(node.x, node.y);
            // let navSquare = this.game.add.sprite(coords.x, coords.y, 'navSquare');
            // navSquare.anchor.x = 0.5;
            // navSquare.anchor.y = 0.5;
        })
            return path;
    }

    findNextNode(unit, target)
    {
        return this.findPath(unit, target)[0];

    }
    //Create nodes representing the squares around a given node
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

    //Get the distance to from x,y to the target square
    getDistance(x, y, target){
        let hDiffernce = Math.abs(target.x - x);
        let yDifference = Math.abs(target.y - y);

        let min = Math.min(hDiffernce, yDifference);

        //Using Diagnal Distance and Biasing the h value of each square so that the nav alg. checks many fewer squares
        //http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html was SUPER helpful
        return ((hDiffernce + yDifference) + (-1 * min)) * (1.0 + (1/1000));
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
            if(unit.moving == true)
            {
                ax = unit.nextSquare.x;
                ay = unit.nextSquare.y;
            } else {
                ax = unit.x;
                ay = unit.y;
            }

            //Same for each unit it's checking against
            if(u.moving == true)
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

    isOccupied(x, y)
    {
        for(let i = 0; i < this.units.length; i++)
        {
            if(x == this.units[i].x && y == this.units[i].y)
            {
                return true;
            }
        }
        
        return false;
    }

    //Find all the empty squares around a square
    findAllEmpty(x,y)
    {
        let empties = [];
        //North
        if(this.navmap[x][y-1] != 1)
        {
            if(!this.isOccupied(x, y-1))
                empties.push({x: x, y: y-1});
        }

        //East
        if(this.navmap[x+1][y] != 1)
        {
            if(!this.isOccupied(x+1, y))
                empties.push({x: x+1, y: y});
        }

        //South
        if(this.navmap[x][y+1] != 1)
        {
            if(!this.isOccupied(x, y+1))
                empties.push({x: x, y: y+1});
        }

        //West
        if(this.navmap[x-1][y] != 1)
        {
            if(!this.isOccupied(x, y-1))
                empties.push({x: x, y: y-1});
        }

        //Northwest
        if(this.navmap[x-1][y-1] != 1)
        {
            if(!this.isOccupied(x-1, y-1))
                empties.push({x: x-1, y: y-1});
        }

        //Northeast
        if(this.navmap[x+1][y-1] != 1)
        {
            if(!this.isOccupied(x+1, y-1))
                empties.push({x: x+1, y: y-1});
        }

        //Southwest
        if(this.navmap[x-1][y+1] != 1)
        {
            if(!this.isOccupied(x-1, y+1))
                empties.push({x: x-1, y: y+1});
        }

        //Southeast
        if(this.navmap[x+1][y+1] != 1)
        {
            if(!this.isOccupied(x+1, y+1))
                empties.push({x: x+1, y: y+1});
        }
        return empties;
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

        }while(this.navmap[x][y] == 1)

        return {x : x, y: y};
    }

    //Figure out how to move two units who are in conflict
    resolveCollision(unit1, unit2)
    {
        console.log("Collision between " + unit1.type + " and " + unit2.type);

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