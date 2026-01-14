
// .___  ___.      ___       __  .__   __.      _______      ___      .___  ___.  _______ 
// |   \/   |     /   \     |  | |  \ |  |     /  _____|    /   \     |   \/   | |   ____|
// |  \  /  |    /  ^  \    |  | |   \|  |    |  |  __     /  ^  \    |  \  /  | |  |__   
// |  |\/|  |   /  /_\  \   |  | |  . `  |    |  | |_ |   /  /_\  \   |  |\/|  | |   __|  
// |  |  |  |  /  _____  \  |  | |  |\   |    |  |__| |  /  _____  \  |  |  |  | |  |____ 
// |__|  |__| /__/     \__\ |__| |__| \__|     \______| /__/     \__\ |__|  |__| |_______|
class PacmanGame {

    constructor(config) {
        console.log('Welcome to Pacman 👻');

        // 1.
        this.setupGameState(config.mapSize);

        // 2 - Setup the game map - with the map size
        this.renderer = new Renderer(this.gameState.mapSize)

        // 3.
        this.setupKeyboardControls();

        // 4
        this.setupGameRunLoop(config.runLoopInterval);

    }

    setupGameState(mapSize) {
        this.gameState = {
            mapSize: mapSize, // Currently we just support a square map
            enemies: [
                new Ghost(mapSize / 2, 0, DIRECTIONS.RIGHT, mapSize, "pink"),
                new Ghost(mapSize / 2, mapSize, DIRECTIONS.LEFT, mapSize, "blue"),
                new Ghost(mapSize, mapSize / 2, DIRECTIONS.UP, mapSize, "green"),
                new Ghost(0, mapSize / 2, DIRECTIONS.DOWN, mapSize, "red")
            ],
            cherry: null,
            player: new Creature(mapSize / 2, mapSize / 2, DIRECTIONS.RIGHT, mapSize),
            score: 0
        };
    }


    movePlayerInDirection(direction) {
        this.gameState.player.direction = direction;
        console.log('MovePlayerInDirection', direction);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            console.log('keydown', event.key);
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    this.movePlayerInDirection(DIRECTIONS.UP);
                    break;
                case 'ArrowDown':
                case 's':
                    this.movePlayerInDirection(DIRECTIONS.DOWN);
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.movePlayerInDirection(DIRECTIONS.LEFT);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.movePlayerInDirection(DIRECTIONS.RIGHT);
                    break;
            }
        });

        document.addEventListener('touchstart', e => {
            this.touchstartX = e.changedTouches[0].screenX
            this.touchstartY = e.changedTouches[0].screenY
        })

        document.addEventListener('touchend', e => {
            this.touchendX = e.changedTouches[0].screenX
            this.touchendY = e.changedTouches[0].screenY
            this.checkSwipeDirection()
        })

    }

    // Mobile Touch logic -Source - https://stackoverflow.com/a/56663695
    // Posted by Damjan Pavlica, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-12-25, License - CC BY-SA 4.0
    touchstartX = 0
    touchendX = 0

    touchstartY = 0
    touchendY = 0

    checkSwipeDirection() {

        let xMovement = this.touchendX - this.touchstartX
        let yMovement = this.touchendY - this.touchstartY
        if (Math.abs(xMovement) > Math.abs(yMovement)) { // More horizontal movement than vertical movement
            if (xMovement > 0) {
                this.movePlayerInDirection(DIRECTIONS.RIGHT);
            } else {
                this.movePlayerInDirection(DIRECTIONS.LEFT);
            }
        } else {
            if (yMovement > 0) {
                this.movePlayerInDirection(DIRECTIONS.DOWN);
            } else {
                this.movePlayerInDirection(DIRECTIONS.UP);
            }
        }
    }

    runLoop; // this holds the interval id for the run loop so that we can cancel it later when game ends
    setupGameRunLoop(runLoopInterval) {
        this.runLoop = setInterval(() => { //RunLoop Code
            this.updateGameState();
            this.renderGame();
        }, runLoopInterval);
    }


    updateEnemies() {
        for (let enemy of this.gameState.enemies) {
            enemy.move()
            let gameHasEnded = enemy.checkCollisionWith(this.gameState.player)
            if (gameHasEnded) { this.endGame() }
        }
    }

    timeSinceLastCherries = 0

    checkIfCherriesNeeded() {
        const timeIntervalSinceLastCherries = (Date.now() - this.timeSinceLastCherries) / 1000
        return timeIntervalSinceLastCherries >= globalConstants.timeIntervalBetweenCherries;
    }

    generateCherry() {
        //x, y, mapSize
        const newCherry = new Cherry(
            Math.random() * this.gameState.mapSize,
            Math.random() * this.gameState.mapSize,
            this.gameState.mapSize
        )
        this.gameState.cherry = newCherry
        this.timeSinceLastCherries = Date.now()

        console.log('🍒Generated cherry', newCherry)
    }

    removeCherry() {
        this.gameState.cherry = null
        this.timeSinceLastCherries = Date.now()
    }

    checkCherryLifeSpan() {
        const timeIntervalSinceLastCherries = (Date.now() - this.timeSinceLastCherries) / 1000
        return timeIntervalSinceLastCherries >= globalConstants.cherryLifeSpan
    }

    updateCherries() {
        if (this.gameState.cherry) { // if there is a cherry 

            if (this.gameState.player.checkCollisionWith(this.gameState.cherry)) {
                this.removeCherry()
                this.gameState.score += 250
            }

            const cherryLifeSpanReached = this.checkCherryLifeSpan()
            if (cherryLifeSpanReached) {
                this.removeCherry()
            }

        }
        else {
            // console.log('🍒Checking if cherries are needed')
            const cherriesNeeded = this.checkIfCherriesNeeded()

            if (cherriesNeeded) {
                this.generateCherry()
            }
        }
    }

    updateGameState() {
        this.gameState.player.move()// Update player
        this.gameState.score += 1; // Update score

        this.updateCherries()
        this.updateEnemies();

    }

    renderGame() {
        this.renderer.renderGame(this.gameState);
    }

    endGame() {
        clearInterval(this.runLoop) // Cancel the run loop - stop it from updating
        this.renderer.gameOver(this.gameState.score)
    }
}
