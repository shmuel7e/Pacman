'use strict';
var WALL = '🌲';
var FOOD = '🍯';
var EMPTY = ' ';
var SUPER_FOOD = '🥞';
var CHERRY = '🍒';
var elScore = document.querySelector('header h3 span');
var gElGameOverModal = document.querySelector('.game-over-modal');
var gElGameWonModal = document.querySelector('.game-won-modal');
var gFoodAmount = -1;
var gBoard;
var gEmptyCells = [];
var gCherryInterval;


var gGame = {
    score: 0,
    isOn: false,
    isPowerFoodOn: false
};

function init() {
    gBoard = buildBoard();
    gCherryInterval = setInterval(generateCherry, 10000);
    countFoodAmount(gBoard);
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    gGame.isOn = true;
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;

            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {

                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = SUPER_FOOD;
    board[1][8] = SUPER_FOOD;
    board[8][1] = SUPER_FOOD;
    board[8][8] = SUPER_FOOD;
    return board;
}

function updateScore(value) {
    gGame.score += value;
    elScore.innerText = gGame.score;
}

function gameOver() {
    console.log('Game Over');
    clearInterval(gCherryInterval);
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    gElGameOverModal.classList.remove('hidden');
}

function resetGame() {
    gEmptyCells = [];
    gGame.score = 0;
    elScore.innerText = gGame.score;
    gSmallFoodEaten = -1;
    gFoodAmount = -1;
    gElGameOverModal.classList.add('hidden');
    gElGameWonModal.classList.add('hidden');
    init();
}

function countFoodAmount(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        var cell = gBoard[i];
        for (var j = 0; j < cell.length; j++) {
            if (cell[j] === FOOD) {
                gFoodAmount++;
            }
        }
    }
}

function checkIfGameWon() {
    if (gSmallFoodEaten === gFoodAmount) winTheGame();
}

function winTheGame() {
    gGame.isOn = false;
    clearInterval(gCherryInterval);
    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    gElGameWonModal.classList.remove('hidden');
}

function generateCherry() {
    if (!gEmptyCells.length) return;
    var randomIndex = Math.floor(Math.random() * gEmptyCells.length);
    var currCell = gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j];
    while (currCell === PACMAN) {
        randomIndex = Math.floor(Math.random() * gEmptyCells.length);
        currCell = gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j];
    }
    gBoard[gEmptyCells[randomIndex].i][gEmptyCells[randomIndex].j] = CHERRY;
    renderCell({ i: gEmptyCells[randomIndex].i, j: gEmptyCells[randomIndex].j }, CHERRY);
}