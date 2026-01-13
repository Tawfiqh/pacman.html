//  __    __   _______  __      .______    _______ .______          _______.
// |  |  |  | |   ____||  |     |   _  \  |   ____||   _  \        /       |
// |  |__|  | |  |__   |  |     |  |_)  | |  |__   |  |_)  |      |   (----`
// |   __   | |   __|  |  |     |   ___/  |   __|  |      /        \   \    
// |  |  |  | |  |____ |  `----.|  |      |  |____ |  |\  \----.----)   |   
// |__|  |__| |_______||_______|| _|      |_______|| _| `._____|_______/    
// Immutable Directions Enum
const DIRECTIONS = Object.freeze({
    UP: '⬆️',
    DOWN: '⬇️',
    LEFT: '⬅️',
    RIGHT: '➡️'
});

function randomDirection() {
    const directionsArray = Object.values(DIRECTIONS);
    return directionsArray[Math.floor(Math.random() * directionsArray.length)];
}
