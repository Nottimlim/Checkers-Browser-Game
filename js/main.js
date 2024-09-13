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

            if (cell) {
                const piece = document.createElement('div');
                if (cell.includes('P1')) {
                    piece.className = 'piece player1';
                } else if (cell.includes('P2')) {
                    piece.className = 'piece player2';
                }
                if (cell.includes('K')) {
                    piece.classList.add('king');
                    console.log('King piece:', piece);
                }
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
};

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
        if (cell) {
            cell.classList.remove('highlight');
            cell.removeEventListener('click', handleMove); // Remove previous event listeners
        }
    });

    // Calculate and highlight new possible moves
    gameState.possibleMoves = calculatePossibleMoves(gameState.selectedPiece);
    console.log('Calculated possible moves for highlighting:', gameState.possibleMoves);

    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (cell) {
            cell.classList.add('highlight');
            cell.addEventListener('click', handleMove); // Add new event listeners
        }
    });
}

function calculatePossibleMoves(piece) {
    const possibleMoves = [];
    const isKing = gameState.board[piece.row][piece.col].includes('K');
    console.log(`Calculating moves for piece at Row ${piece.row}, Col ${piece.col}. Is King: ${isKing}`);

    // Define directions for normal and king pieces
    const directions = isKing ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : (gameState.currentPlayer === 'P1' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);
    const captureDirections = isKing ? [[-2, -2], [-2, 2], [2, -2], [2, 2]] : (gameState.currentPlayer === 'P1' ? [[-2, -2], [-2, 2]] : [[2, -2], [2, 2]]);

    directions.forEach((direction, index) => {
        const newRow = piece.row + direction[0];
        const newCol = piece.col + direction[1];
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (gameState.board[newRow][newCol] === null) {
                possibleMoves.push({ row: newRow, col: newCol });
            } else {
                const captureRow = piece.row + captureDirections[index][0];
                const captureCol = piece.col + captureDirections[index][1];
                if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8 &&
                    gameState.board[newRow][newCol] !== gameState.currentPlayer &&
                    gameState.board[captureRow][captureCol] === null) {
                    possibleMoves.push({ row: captureRow, col: captureCol, capture: { row: newRow, col: newCol } });
                }
            }
        }
    });

    console.log('Possible moves:', possibleMoves);
    return possibleMoves;
}


function handleMove(event) {
    const cell = event.target;
    const newRow = parseInt(cell.dataset.row);
    const newCol = parseInt(cell.dataset.col);
    console.log(`Move to: Row ${newRow}, Col ${newCol}`);

    // Check if the move is a capture move
    const captureMove = gameState.possibleMoves.find(move => move.row === newRow && move.col === newCol && move.capture);
    if (captureMove) {
        gameState.board[captureMove.capture.row][captureMove.capture.col] = null; // Remove captured piece
    }

    // Move the selected piece to the new position
    gameState.board[newRow][newCol] = gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col]; // Preserve 'K' if present
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null; // Correctly clear the original position

    // Debugging: Before promotion
    console.log('Before Promotion:', gameState.board[newRow][newCol]);

    // Promote to king if reaching the opposite end (for normal pieces)
    if ((gameState.currentPlayer === 'P1' && newRow === 0) || (gameState.currentPlayer === 'P2' && newRow === 7)) {
        gameState.board[newRow][newCol] += 'K';
        console.log('After Promotion:', gameState.board[newRow][newCol]);
    }

    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    renderBoard(); // Re-render the board to reflect the move
    switchPlayer(); // Switch to the other player's turn
    checkWinCondition(); // Check for win/loss condition
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'P1' ? 'P2' : 'P1';
    updatePlayerTurn();
}

function checkWinCondition() {
    const player1Pieces = gameState.board.flat().filter(cell => cell && cell.includes('P1')).length;
    const player2Pieces = gameState.board.flat().filter(cell => cell && cell.includes('P2')).length;

    if (player1Pieces === 0) {
        alert('Player 2 wins!');
        resetGame();
    } else if (player2Pieces === 0) {
        alert('Player 1 wins!');
        resetGame();
    }
}

function resetGame() {
    gameState.board = [
        [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
        ['P2', null, 'P2', null, 'P2', null, 'P2', null],
        [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P1', null, 'P1', null, 'P1', null, 'P1', null],
        [null, 'P1', null, 'P1', null, 'P1', null, 'P1'],
        ['P1', null, 'P1', null, 'P1', null, 'P1', null],
    ];
    gameState.currentPlayer = 'P1';
    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    renderBoard();
    updatePlayerTurn();
}

// DOM
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    updatePlayerTurn();
});
