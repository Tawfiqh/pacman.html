

//      _______..______   .______       __  .___________. _______     _______.
//     /       ||   _  \  |   _  \     |  | |           ||   ____|   /       |
//    |   (----`|  |_)  | |  |_)  |    |  | `---|  |----`|  |__     |   (----`
//     \   \    |   ___/  |      /     |  |     |  |     |   __|     \   \    
// .----)   |   |  |      |  |\  \----.|  |     |  |     |  |____.----)   |   
// |_______/    | _|      | _| `._____||__|     |__|     |_______|_______/    
class Creature {

    constructor(x, y, direction, mapSize, size = globalConstants.creatureSize, speed = globalConstants.initialSpeed) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed
        this.mapSize = mapSize; // A bit strange to have mapSize here - but needed to check if the creature is off the map -- TBC if can refactor
        this.size = size;
    }

    move() {
        switch (this.direction) {
            case DIRECTIONS.UP:
                this.y -= this.speed;
                break;
            case DIRECTIONS.DOWN:
                this.y += this.speed;
                break;
            case DIRECTIONS.LEFT:
                this.x -= this.speed;
                break;
            case DIRECTIONS.RIGHT:
                this.x += this.speed;
                break;
        }
        this.loopAroundIfNeeded();
    }

    loopAroundIfNeeded() {
        if (this.x < 0) { // too far left
            this.x = this.mapSize
        }
        if (this.y < 0) { // too far up
            this.y = this.mapSize
        }
        if (this.x > this.mapSize) { // too far right
            this.x = 0
        }
        if (this.y > this.mapSize) { // too far down
            this.y = 0
        }
    }

    checkCollisionWith(creature) {
        let dx = Math.abs(creature.x - this.x);
        let dy = Math.abs(creature.y - this.y);
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < creature.size + this.size) {
            return true
        }

        return false
    }

}


class Ghost extends Creature {
    currentMovesBeforeResetting = 0;
    MAX_MOVES = globalConstants.enemyMaxMovesInSameDirection;

    constructor(x, y, direction, mapSize, color, size = globalConstants.creatureSize, speed = globalConstants.enemySpeed) {
        super(x, y, direction, mapSize, size, speed)
        this.color = color;
    }

    move() {
        super.move();
        this.currentMovesBeforeResetting++;

        if (this.currentMovesBeforeResetting >= this.MAX_MOVES) {
            this.turnAroundRandomlyAndGetFaster();
            this.currentMovesBeforeResetting = 0;
        }
    }

    turnAroundRandomlyAndGetFaster() {
        this.direction = randomDirection();
        this.speed += globalConstants.enemyIncreaseSpeed
    }


}

class Cherry extends Creature {

    constructor(x, y, mapSize, size = globalConstants.creatureSize) {
        super(x, y, DIRECTIONS.RIGHT, mapSize, size, 0) //TBC - can remove direction as not used
    }

}