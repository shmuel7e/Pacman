var gPacman;
const PACMAN = '🐻';
var gSmallFoodEaten = -1;
var gPowerFoodInterval;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
    if (!gGame.isOn) return;
    var nextLocation = getNextLocation(eventKeyboard);
    if (!nextLocation) return;
    var nextCell = gBoard[nextLocation.i][nextLocation.j];
    if (nextCell === WALL) return;
    if (nextCell === FOOD) {
        gEmptyCells.push(nextLocation);
        updateScore(1)
        gSmallFoodEaten++;
        // console.log(gSmallFoodEaten);
        // console.log(gFoodOnFiled);
    } else if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
        updateScore(100);
        turnSuperPacman();
    } else if (nextCell === CHERRY) {
        updateScore(25);
    } else if (nextCell === SUPER_FOOD && gPacman.isSuper) {
        return;
    } else if (nextCell === GHOST && !gPacman.isSuper) {
        gameOver();
        renderCell(gPacman.location, EMPTY);
        return;
    } else if (nextCell === GHOST && gPacman.isSuper) {
        removeGhost(nextLocation);
    }
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);
    gPacman.location = nextLocation;
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    renderCell(gPacman.location, PACMAN);
    checkIfGameWon();
}

function getNextLocation(keyboardEvent) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };

    switch (keyboardEvent.code) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }

    return nextLocation;
}

function revertSuperPackman() {
    gPacman.isSuper = false;
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        ghost.color = gOriginalGhostColor[i];
    }
    reviveGhost(gDeadGhostCount);
    gDeadGhostCount = 0;
}

function turnSuperPacman() {
    gPacman.isSuper = true;
    gOriginalGhostColor = [];
    setTimeout(revertSuperPackman, 5000);
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        gOriginalGhostColor.push(ghost.color);
        ghost.color = 'blue';
    }
}