var GHOST = '👻';
var gDeadGhostCount = 0;
var gIntervalGhosts;
var gGhosts;
var gOriginalGhostColor = [];

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor()
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
    gGhosts = [];
    createGhost(board)
    createGhost(board)
    createGhost(board)
    gIntervalGhosts = setInterval(moveGhosts, 1500);
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        var moveDiff = getMoveDiff();
        var nextLocation = { i: ghost.location.i + moveDiff.i, j: ghost.location.j + moveDiff.j }
        if (gBoard[nextLocation.i][nextLocation.j] === WALL) return
        if (gBoard[nextLocation.i][nextLocation.j] === PACMAN && gPacman.isSuper) {
            gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
            renderCell(ghost.location, ghost.currCellContent)
            ghost.location = nextLocation
            ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]
            gBoard[ghost.location.i][ghost.location.j] = GHOST
            renderCell(ghost.location, getGhostHTML(ghost))
            gameOver()
            return
        }
        if (gBoard[nextLocation.i][nextLocation.j] === GHOST) {
            return
        }
        if (gBoard[nextLocation.i][nextLocation.j] === PACMAN && gPacman.isSuper) return;
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)
        ghost.location = nextLocation
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    return `<span style="color:${ghost.color};">${GHOST}</span>`
}

function removeGhost(ghostLocation) {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        if (ghostLocation.i === ghost.location.i && ghostLocation.j === ghost.location.j) {
            gDeadGhostCount++;
            gGhosts.splice(i, 1);
            if (ghost.currCellContent === FOOD) {
                gSmallFoodEaten++;
            }
        }
    }
}

function reviveGhost(numOfDeadGhosts) {
    for (var i = 0; i < numOfDeadGhosts; i++) {
        createGhost(gBoard);
    }
}