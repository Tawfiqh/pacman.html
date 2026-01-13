# Pacman Game

# Overview
Simple ~one page~ Pacman game in vanilla HTML/CSS/JS -- originally uploaded: https://gist.github.com/Tawfiqh/982d596869405e98c8618396f1041ad7
Play it in browser here: https://tawfiq.co.uk/pacman

# What the code does

The codebase is organized into several modules:

- **pacmanGame.js** - Main `PacmanGame` class that orchestrates the game. It initializes the game state (player, enemies, score), sets up keyboard and touch controls for mobile devices, and runs * the main game loop * that updates positions and checks for collisions. The game ends when the player collides with any ghost.

- **pacmanRenderer.js** - Handles all canvas rendering operations. Draws the player, the ghosts, the score and finally shows the game over screen when the player is caught.

- **sprites.js** - Defines the game entities and handles the updating of their state: `Creature` (base class for all moving objects) and `Ghost` (enemy class). Creatures can move in four directions, wrap around the map edges, and ghosts change direction randomly and gradually increase speed over time. Also handles collision detection which is trivial for spherical creatures/players.

- **helpers.js** - Provides utility functions for managing `DIRECTIONS` as an enum. Also provides a `randomDirection()` function used by ghosts.

- **pacman.html** - Simple HTML and CSS structure for the the canvas, game over overlay, instructions. JS at the bottom initializes the game with *configuration settings* (map size, run loop interval, etc).


# TODO list

- ✅ Initialise Game State
- ✅ Setup Keyboard Controls
- ✅ Setup Run Loop to update game state and render game
- ✅ Move enemies + player
- ✅ Handle Collisions
- ✅ Add speed to enemies
- ✅ Stop creatures going off of the map!
- ✅ Give enemies colours
- ✅ Update Score
- ✅ Display score
- ✅ Show score on end-screen
- ✅ Resize to window size -- zoom/scale (and centre the play window on the screen)
- ✅ Animate pacman
- ✅ Ghost trails and faces
- ✅ Mobile support for touch
- ✅ Instructions on how to play
- ✅ Fix scrolling on mobile (should not scroll when swiping to play)
- Add cherries!! If the player eats a cherry then they can eat the ghosts! 
- Add walls - that the characters can't move through
- Add more enemies as times goes on!
- Restart button on end-screen