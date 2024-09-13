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
            aCell.dataset.row = rowIndex;
            aCell.dataset.col = colIndex;

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

    // Add event listeners for piece selection
    document.querySelectorAll('.piece').forEach(piece => {
        piece.addEventListener('click', handlePieceClick);
    });
}

function updatePlayerTurn() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.innerHTML = `<b>Current Player: ${gameState.currentPlayer}</b>`;
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = piece.parentElement.dataset.row;
    const col = piece.parentElement.dataset.col;

    console.log(`Piece clicked: Row ${row}, Col ${col}`);

    if (gameState.board[row][col] !== gameState.currentPlayer) {
        return; // Not the current player's piece
    }

    // Deselect previously selected piece
    if (gameState.selectedPiece) {
        const prevSelectedPiece = document.querySelector('.selected');
        if (prevSelectedPiece) {
            prevSelectedPiece.classList.remove('selected');
        }
    }

    // Select the new piece
    piece.classList.add('selected');
    gameState.selectedPiece = { row: parseInt(row), col: parseInt(col) };
    highlightPossibleMoves();
}

function highlightPossibleMoves() {
    // Clear previous highlights
    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        cell.classList.remove('highlight');
        cell.removeEventListener('click', handleMove); // Remove previous event listeners
    });

    gameState.possibleMoves = calculatePossibleMoves(gameState.selectedPiece);

    console.log('Possible moves:', gameState.possibleMoves);

    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        cell.classList.add('highlight');
        cell.addEventListener('click', handleMove); // Add new event listeners
    });
}

function calculatePossibleMoves(piece) {
    const possibleMoves = [];
    const directions = gameState.currentPlayer === 'P1' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    directions.forEach(direction => {
        const newRow = piece.row + direction[0];
        const newCol = piece.col + direction[1];

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && gameState.board[newRow][newCol] === null) {
            possibleMoves.push({ row: newRow, col: newCol });
        }
    });

    return possibleMoves;
}

function handleMove(event) {
    const cell = event.target;
    const newRow = parseInt(cell.dataset.row);
    const newCol = parseInt(cell.dataset.col);

    console.log(`Move to: Row ${newRow}, Col ${newCol}`);

    // Move the selected piece to the new position
    gameState.board[newRow][newCol] = gameState.currentPlayer;
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null;
    gameState.selectedPiece = null;
    gameState.possibleMoves = [];

    renderBoard(); // Re-render the board to reflect the move
    switchPlayer(); // Switch to the other player's turn
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