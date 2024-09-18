// Variables
const initialBoard = [
    [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
    ['P2', null, 'P2', null, 'P2', null, 'P2', null],
    [null, 'P2', null, 'P2', null, 'P2', null, 'P2'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P1', null, 'P1', null, 'P1', null, 'P1', null],
    [null, 'P1', null, 'P1', null, 'P1', null, 'P1'],
    ['P1', null, 'P1', null, 'P1', null, 'P1', null],
];

const gameState = {
    board: initialBoard.map(row => row.slice()), // Deep copy of the initial board
    currentPlayer: 'P1',
    selectedPiece: null,
    possibleMoves: [],
    playerNames: {
        P1: '',
        P2: ''
    },
    captures: {
        P1: 0,
        P2: 0
    }
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

            // Apply alternating colors
            if ((rowIndex + colIndex) % 2 === 0) {
                aCell.classList.add('light');
            } else {
                aCell.classList.add('dark');
            }

            if (cell) {
                const piece = document.createElement('div');
                if (cell.includes('P1')) {
                    piece.className = 'piece player1';
                } else if (cell.includes('P2')) {
                    piece.className = 'piece player2';
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
}

function updatePlayerTurn() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.innerHTML = `<b>Current Player: ${gameState.playerNames[gameState.currentPlayer]}</b>`;
}

function updateCaptures() {
    document.getElementById('player1-capture-title').innerText = `${gameState.playerNames.P1} has captured:`;
    document.getElementById('player2-capture-title').innerText = `${gameState.playerNames.P2} has captured:`;
    document.getElementById('player1-captured-pieces').innerText = gameState.captures.P1;
    document.getElementById('player2-captured-pieces').innerText = gameState.captures.P2;
}

function handlePieceClick(event) {
    const piece = event.target;
    const row = piece.parentElement.dataset.row;
    const col = piece.parentElement.dataset.col;
    console.log(`Piece clicked: Row ${row}, Col ${col}`);
    console.log(`Piece value: ${gameState.board[row][col]}`); // Add this line to debug the piece value
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
    const directions = gameState.currentPlayer === 'P1' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    const captureDirections = gameState.currentPlayer === 'P1' ? [[-2, -2], [-2, 2]] : [[2, -2], [2, 2]];

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
        gameState.captures[gameState.currentPlayer]++; // Increase the capture count
        updateCaptures(); // Update the UI to show captured pieces
    }

    // Move the selected piece to the new position
    gameState.board[newRow][newCol] = gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col];
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null; // Correctly clear the original position

    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    renderBoard(); // Re-render the board to reflect the move
    switchPlayer(); // Switch to the other player's turn
    checkWinCondition(); // Check for win/loss condition
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'P1' ? 'P2' : 'P1';
    updatePlayerTurn();
    checkForLegalMoves(); // Check if the new current player has any legal moves
}

function checkForLegalMoves() {
    const currentPlayerPieces = gameState.board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === gameState.currentPlayer ? { row: rowIndex, col: colIndex } : null))
    ).filter(piece => piece !== null);

    const hasLegalMoves = currentPlayerPieces.some(piece => calculatePossibleMoves(piece).length > 0);

    if (!hasLegalMoves) {
        showWinAnnouncement(`${gameState.playerNames[gameState.currentPlayer === 'P1' ? 'P2' : 'P1']} wins!`);
        resetGame();
    }
}

function checkWinCondition() {
    const player1Pieces = gameState.board.flat().filter(cell => cell && cell.includes('P1')).length;
    const player2Pieces = gameState.board.flat().filter(cell => cell && cell.includes('P2')).length;
    if (player1Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames['P2']} wins! We know who the better player is now!`);
        resetGame();
    } else if (player2Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames['P1']} wins! We know who the better player is now!`);
        resetGame();
    }
}

function resetGame() {
    gameState.board = initialBoard.map(row => row.slice()); // Deep copy of the initial board
    gameState.currentPlayer = 'P1';
    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    gameState.captures = { P1: 0, P2: 0 }; // Reset capture counts
    renderBoard();
    updatePlayerTurn();
    updateCaptures(); // Reset the UI for captured pieces
}

// Show player announcement modal
function showPlayerAnnouncement(message) {
    const modal = document.getElementById('player-announcement-modal');
    const modalText = document.getElementById('player-announcement-text');
    modalText.innerText = message;
    modal.style.display = 'block';
}

// Show win announcement modal
function showWinAnnouncement(message) {
    const modal = document.getElementById('win-announcement-modal');
    const modalText = document.getElementById('win-announcement-text');
    modalText.innerText = message;
    modal.style.display = 'block';
}

// Show how to play modal
function showHowToPlay() {
    const modal = document.getElementById('how-to-play-modal');
    modal.style.display = 'block';
}

// Hide modals
function hideModals() {
    document.getElementById('player-announcement-modal').style.display = 'none';
    document.getElementById('win-announcement-modal').style.display = 'none';
    document.getElementById('how-to-play-modal').style.display = 'none';
}

// Handle form submission to capture player names and start the game
document.getElementById('name-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;
    gameState.playerNames.P1 = player1Name;
    gameState.playerNames.P2 = player2Name;

    // Hide the name input screen and show the game screen
    document.getElementById('name-input-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Display the player announcement modal
    showPlayerAnnouncement(`${player1Name} is Red\n${player2Name} is Black\nMay the better player win! :)`);

    // Start the game
    renderBoard();
    updatePlayerTurn();
    updateCaptures(); // Initialize the captured pieces display
});

// Handle theme switch
document.getElementById('theme-switch-button').addEventListener('click', function() {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    if (themeStylesheet.getAttribute('href') === './css/modern-theme.css') {
        themeStylesheet.setAttribute('href', './css/classic-theme.css');
    } else {
        themeStylesheet.setAttribute('href', './css/modern-theme.css');
    }
});

// Handle how to play button
document.getElementById('how-to-play-button').addEventListener('click', showHowToPlay);

// Handle modal close buttons
document.getElementById('player-announcement-close').addEventListener('click', hideModals);
document.getElementById('win-announcement-close').addEventListener('click', hideModals);
document.getElementById('how-to-play-close').addEventListener('click', hideModals);

// DOM
document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play().catch(() => {
        // If autoplay is blocked, wait for user interaction
        document.addEventListener('click', () => {
            backgroundMusic.play();
        }, { once: true });
    })});
