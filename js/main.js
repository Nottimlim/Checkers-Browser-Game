// Variables

const gameState = {
    board: [
        [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
        ['P2', null, 'P2', null, 'P2', null, 'P2', null],
        [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P1', null, 'P1', null, 'P1', null, 'P1', null],
        [null, 'P1', null, 'P1', null, 'P1', null, 'P1'],
        ['P1', null, 'P1', null, 'P1', null, 'P1', null],
    ],
    currentPlayer: 'P1',
    selectedPiece: null,
    possibleMoves: [],
};


// Functions

function renderBoard() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear previous board

    gameState.board.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        row.forEach((cell, colIndex) => {
            const aCell = document.createElement('div');
            aCell.className = 'cell';

            if (cell === 'P1') {
                const piece = document.createElement('div');
                piece.className = 'piece player1';
                aCell.appendChild(piece);
            } else if (cell === 'P2') {
                const piece = document.createElement('div');
                piece.className = 'piece player2';
                aCell.appendChild(piece);
            }

            rowElement.appendChild(aCell);
        });

        gameContainer.appendChild(rowElement);
    });
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = piece.parentElement.dataset.row;
    const col = piece.parentElement.dataset.col;
    if (gameState.board[row][col] !== gameStateState.currentPlayer) {
        return; // Not current players piece
    }
    gameState.selectedPiece = { row: parseInt(row), col: parseInt(col)};
    highlightPossibleMoves();
}

function highlightPossibleMoves() {
    // Clear previous highlights
    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}][data-col="${move.col}]`);
        cell.classList.remove('highlight');
    });
    gameState.possibleMoves = calculatePossibleMovies(gameState.selectedPiece);
    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        cell.classList.add('highlight');
        cell.addEventListener('click', handleMove);
    });
}

function calculatePossibleMoves(piece) {
    const possibleMoves = [];
    const directions = gameState.currentPlayer === 'P1' ? [[-1, 1], [-1, 1]] : [[1, -1], [1, 1]];
    directions.forEach(direction => {
        const newRow = piece.row + direction[0];
        const newCol = piece.col + direction [1];
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && gameState.board[newRow][newCol] === null) {
            possibleMoves.push({ row: newRow, col: newCol});
        }
    });
    return possibleMoves;
}

function handleMove(event) {
    const cell = event.target;
    const newRow = parseInt(cell.dataset.row);
    const newCol = parseInt(cell.dataset.col);
    gameState.board[newRow][newCol] = gameState.currentPlayer;
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null;
    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    renderBoard();
    switchPlayer();
}

function updatePlayerTurn() {
    const playerTurnE = document.getElementById('player-turn');
    playerTurnE.innerHTML = `<b> Current Player: ${gameState.currentPlayer}</b>`;
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'P1' ? 'P2' : 'P1';
    updatePlayerTurn();
}
// DOM

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    updatePlayerTurn();
});