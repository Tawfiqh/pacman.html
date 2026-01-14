// .______       _______ .__   __.  _______   _______ .______       _______ .______      
// |   _  \     |   ____||  \ |  | |       \ |   ____||   _  \     |   ____||   _  \     
// |  |_)  |    |  |__   |   \|  | |  .--.  ||  |__   |  |_)  |    |  |__   |  |_)  |    
// |      /     |   __|  |  . `  | |  |  |  ||   __|  |      /     |   __|  |      /     
// |  |\  \----.|  |____ |  |\   | |  '--'  ||  |____ |  |\  \----.|  |____ |  |\  \----.
// | _| `._____||_______||__| \__| |_______/ |_______|| _| `._____||_______|| _| `._____|
class Renderer {

    scaleFactor = globalConstants.scaleFactor; // this is the number of pixels per game unit

    constructor(initialSize) {
        this.canvas = document.getElementById("gameBoard");
        this.ctx = this.canvas.getContext("2d");

        // set width and height to gameState width and height
        this.canvas.width = initialSize * this.scaleFactor;
        this.canvas.height = initialSize * this.scaleFactor;

        this.currentPlayerAnimationFrame = 0;
        this.totalPlayerAnimationFrames = 24;

    }

    renderCharacter(character, color) {
        this.drawCircle(
            character.x,
            character.y,
            character.size,
            color
        )

    }

    renderCharacterFace(character, color) {
        this.renderCharacterMouth(character, color)
        this.renderCharacterEye(character, color)
    }

    renderCharacterMouth(character, color) {

        // How far through the animation are we? Calculate how much of an angle to render
        function calculateMouthArc(percentage) {
            return 0.33 * Math.PI * percentage;
        }


        function calculateDirectionOffset(direction) {
            switch (direction) {
                case DIRECTIONS.RIGHT: //0 degrees
                    return 0;
                case DIRECTIONS.LEFT: // 180 degrees to the left
                    return Math.PI;
                case DIRECTIONS.UP: // TBC - not 100% sure why this is flipped - and not just 0.5 * Math.PI - should be rotated 90 Degrees Anti-Clockwise
                    return 1.5 * Math.PI;
                case DIRECTIONS.DOWN: // TBC - not 100% sure why this is flipped - and not just 1.5 * Math.PI - should be rotated 270 Degrees Anti-Clockwise
                    return 0.5 * Math.PI;
            }
        }

        const mouthArcAngle = calculateMouthArc(
            this.currentPlayerAnimationFrame / this.totalPlayerAnimationFrames,
        );
        this.currentPlayerAnimationFrame = (this.currentPlayerAnimationFrame + 1) % this.totalPlayerAnimationFrames;

        const directionOffset = calculateDirectionOffset(character.direction);

        // Draw an arc on the face - this is the mouth - which will open and close as the animation progresses
        const ctx = this.ctx
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.arc(
            character.x * this.scaleFactor,
            character.y * this.scaleFactor,
            character.size * this.scaleFactor,
            directionOffset - mouthArcAngle,
            directionOffset + mouthArcAngle,
            false // draw the arc clockwise
        );
        ctx.lineTo(character.x * this.scaleFactor, character.y * this.scaleFactor);
        ctx.stroke();
        ctx.fill();
    }

    renderCharacterEye(character, color) {

        // Draw an eye on the face - this is the left eye - which will move as the animation progresses
        function calculateEyeOffset(direction) {
            let xOffset = 0;
            let yOffset = 0;

            switch (direction) {
                case DIRECTIONS.RIGHT:
                    xOffset = -1
                    yOffset = -1
                    break;
                case DIRECTIONS.LEFT:
                    xOffset = 1
                    yOffset = -1
                    break;
                case DIRECTIONS.UP:
                    xOffset = 1
                    yOffset = 1
                    break;
                case DIRECTIONS.DOWN:
                    xOffset = -1
                    yOffset = -1
                    break;
            }

            return {
                x: xOffset * character.size * 0.4,
                y: yOffset * character.size * 0.4
            };
        }

        const eyeOffset = calculateEyeOffset(character.direction);

        this.drawCircle(
            character.x + eyeOffset.x,
            character.y + eyeOffset.y,
            character.size * 0.2,
            color
        )
    }

    drawCircle(x, y, radius, color) {
        const ctx = this.ctx
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.arc(
            x * this.scaleFactor,
            y * this.scaleFactor,
            radius * this.scaleFactor,
            0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderPlayer(player) {
        this.renderCharacter(player, "yellow")
        this.renderCharacterFace(player, "darkblue")
    }

    renderEnemy(enemy) {
        this.renderCharacter(enemy, enemy.color)
        this.renderGhostTrail(enemy, enemy.color)
        this.renderGhostFace(enemy, enemy.color)
    }

    renderGhostFace(character, color) {
        let eyeOffset = character.size * 0.4
        let eyeRadius = character.size * 0.2

        // Draw the right eye
        this.drawCircle(
            (character.x + eyeOffset),
            (character.y - eyeOffset),
            eyeRadius,
            "darkblue"
        )

        // Draw the left eye
        this.drawCircle(
            (character.x - eyeOffset),
            (character.y - eyeOffset),
            eyeRadius,
            "darkblue"
        )

        // Another circle for the mouth
        this.drawCircle(
            (character.x),
            (character.y + eyeOffset),
            eyeRadius * 1.4,
            "darkblue"
        )
    }

    renderGhostTrail(character, color) {
        const ctx = this.ctx
        ctx.beginPath();

        // 1. Start at the top of the Ghost Head
        const startPosition = [
            character.x * this.scaleFactor,
            (character.y - character.size) * this.scaleFactor
        ]
        ctx.moveTo(startPosition[0], startPosition[1]);

        //2. Move down to the bottom left (with a small offset so that it's larger than just the circle of the character)
        let trailOffset = (character.size * 1.1)

        let bottomLeft = [
            (character.x - trailOffset) * this.scaleFactor,
            (character.y + trailOffset) * this.scaleFactor
        ]
        // Move down to the bottom left
        ctx.lineTo(bottomLeft[0], bottomLeft[1]);


        // 3. Draw a squiggle across to the bottom right (complex-ish bit)
        //  -=-=-=-=- Now draw a squiggle across to the bottom right -=-=-=-=-
        let bottomRight = [
            (character.x + trailOffset) * this.scaleFactor,
            bottomLeft[1] //no Y-variance as it's a flat line horizontally
        ]

        let bottomRightOffsetX = bottomRight[0] - bottomLeft[0]

        let previousPoint = [ // Used within the for loop to calculate the control points
            bottomLeft[0],
            bottomLeft[1]
        ]

        const incrementsInSquiggle = 10
        // For each increment draw an arc 1/10 along the way to the bottom right
        for (let i = 1; i <= incrementsInSquiggle; i++) {
            let nextPointX = bottomLeft[0] + (bottomRightOffsetX * (i / incrementsInSquiggle))
            let nextPointY = bottomLeft[1] //no Y-variance as it's a flat line horizontally

            let controlPointX = previousPoint[0] + (nextPointX - previousPoint[0]) / 2

            let controlPointOffset = i % 2 === 0 ? 10 : -10;
            let controlPointY = bottomLeft[1] + controlPointOffset //Adjust the control point Y-offset to create the squiggle effect

            // Draw an arc to the next point
            ctx.arcTo( // Uses ArcTo: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arcTo
                controlPointX, controlPointY, // Control point 1
                nextPointX, nextPointY, // Control point 2
                bottomRightOffsetX / incrementsInSquiggle
            ) // Radius

            previousPoint = [
                nextPointX,
                nextPointY
            ]
        }
        // -=-=-=-=- end of squiggle now move back to the starting point-=-=-=-=-
        // 4. Move back to the starting point
        ctx.moveTo(startPosition[0], startPosition[1]);

        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fill();

    }


    renderCherry(cherry) { //tbc - make more of a cherry size
        const cherryRadius = cherry.size * 0.5

        //draw stem
        this.drawCircle(cherry.x, cherry.y - cherryRadius, cherryRadius * 0.75, "green")

        // Draw two cherries 🍒
        this.drawCircle(cherry.x + cherryRadius / 2, cherry.y, cherryRadius, "brown")
        this.drawCircle(cherry.x - cherryRadius / 2, cherry.y, cherryRadius, "red")


    }
    renderGame(gameState) {
        this.clearCanvas();

        // Render Player
        this.renderPlayer(gameState.player)
        if (gameState.cherry) {
            this.renderCherry(gameState.cherry)
        }

        // Render enemies
        for (let enemy of gameState.enemies) {
            this.renderEnemy(enemy)
        }

        // Render score
        this.renderScore(gameState.score);
    }

    renderScore(score) {
        const ctx = this.ctx

        const fontSize = 5 * this.scaleFactor;
        ctx.font = fontSize + "px 'Courier New', Courier, monospace";
        ctx.fillStyle = "greenyellow";
        const x = 10
        const y = fontSize + 10;
        ctx.fillText("Score: " + score, x, y);
    }

    gameOver(finalScore) {
        console.log("----GAME OVER = refresh to play again ----")
        document.getElementById("gameOver").style.display = "block";
        document.getElementById("finalScore").innerHTML = finalScore;

    }
}
