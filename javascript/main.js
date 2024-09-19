// Constants
const PLAYER_1 = 'P1';
const PLAYER_2 = 'P2';

// Initial game setup
const initialBoard = [
    [null, PLAYER_2, null, PLAYER_2, null, PLAYER_2, null, PLAYER_2],
    [PLAYER_2, null, PLAYER_2, null, PLAYER_2, null, PLAYER_2, null],
    [null, PLAYER_2, null, PLAYER_2, null, PLAYER_2, null, PLAYER_2],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [PLAYER_1, null, PLAYER_1, null, PLAYER_1, null, PLAYER_1, null],
    [null, PLAYER_1, null, PLAYER_1, null, PLAYER_1, null, PLAYER_1],
    [PLAYER_1, null, PLAYER_1, null, PLAYER_1, null, PLAYER_1, null],
];

const gameState = {
    board: initialBoard.map(row => [...row]),
    currentPlayer: PLAYER_1,
    selectedPiece: null,
    possibleMoves: [],
    playerNames: { [PLAYER_1]: '', [PLAYER_2]: '' },
    captures: { [PLAYER_1]: 0, [PLAYER_2]: 0 }
};

// Rendering Functions
const renderBoard = () => {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    gameState.board.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = `cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}`;
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;

            if (cell) {
                const piece = document.createElement('div');
                piece.className = `piece ${cell.toLowerCase()}`; // This should create classes like 'piece p1' or 'piece p2'
                piece.addEventListener('click', handlePieceClick);
                cellElement.appendChild(piece);
            }
            rowElement.appendChild(cellElement);
        });
        gameContainer.appendChild(rowElement);
    });
};

const updatePlayerTurn = () => {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.innerHTML = `<b>Current Player: ${gameState.playerNames[gameState.currentPlayer]}</b>`;
};

const updateCaptures = () => {
    document.getElementById('player1-capture-title').textContent = `${gameState.playerNames[PLAYER_1]} has captured:`;
    document.getElementById('player2-capture-title').textContent = `${gameState.playerNames[PLAYER_2]} has captured:`;
    document.getElementById('player1-captured-pieces').textContent = gameState.captures[PLAYER_1];
    document.getElementById('player2-captured-pieces').textContent = gameState.captures[PLAYER_2];
};

// Game Logic Functions
const handlePieceClick = (event) => {
    const piece = event.target;
    const { row, col } = piece.parentElement.dataset;
    console.log(`Piece clicked: Row ${row}, Col ${col}`);
    console.log(`Piece value: ${gameState.board[row][col]}`);

    if (gameState.board[row][col] !== gameState.currentPlayer) return;

    if (gameState.selectedPiece) {
        document.querySelector('.selected')?.classList.remove('selected');
    }

    piece.classList.add('selected');
    gameState.selectedPiece = { row: parseInt(row), col: parseInt(col) };
    highlightPossibleMoves();
};

const highlightPossibleMoves = () => {
    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (cell) {
            cell.classList.remove('highlight');
            cell.removeEventListener('click', handleMove);
        }
    });

    gameState.possibleMoves = calculatePossibleMoves(gameState.selectedPiece);
    console.log('Calculated possible moves for highlighting:', gameState.possibleMoves);

    gameState.possibleMoves.forEach(move => {
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (cell) {
            cell.classList.add('highlight');
            cell.addEventListener('click', handleMove);
        }
    });
};

const calculatePossibleMoves = (piece) => {
    const possibleMoves = []; // Initialize an empty array to store possible moves

    // Define move directions based on the current player
    // Player 1 moves up (-1), Player 2 moves down (+1)
    const directions = gameState.currentPlayer === PLAYER_1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    // Define capture move directions based on the current player
    // Player 1 captures up (-2), Player 2 captures down (+2)
    const captureDirections = gameState.currentPlayer === PLAYER_1 ? [[-2, -2], [-2, 2]] : [[2, -2], [2, 2]];

    // Iterate over each direction to calculate possible moves
    directions.forEach((direction, index) => {
        // Calculate the new position based on the direction
        const [newRow, newCol] = [piece.row + direction[0], piece.col + direction[1]];
        // Check if the new position is within the bounds of the board
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            // Check if the new position is empty
            if (gameState.board[newRow][newCol] === null) {
                // Add the new position to the possible moves array
                possibleMoves.push({ row: newRow, col: newCol });
            } else {
                // Calculate the capture position based on the capture direction
                const [captureRow, captureCol] = [piece.row + captureDirections[index][0], piece.col + captureDirections[index][1]];

                // Check if the capture position is within bounds, the opponent's piece is in the way, and the landing cell is empty
                if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8 &&
                    gameState.board[newRow][newCol] !== gameState.currentPlayer &&
                    gameState.board[captureRow][captureCol] === null) {
                    // Add the capture move to the possible moves array
                    possibleMoves.push({ row: captureRow, col: captureCol, capture: { row: newRow, col: newCol } });
                }}}});

    console.log('Possible moves:', possibleMoves); // Log the calculated possible moves for debugging
    return possibleMoves; // Return the array of possible moves
};

const handleMove = (event) => {
    const cell = event.target;
    const newRow = parseInt(cell.dataset.row);
    const newCol = parseInt(cell.dataset.col);
    console.log(`Move to: Row ${newRow}, Col ${newCol}`);

    const captureMove = gameState.possibleMoves.find(move => move.row === newRow && move.col === newCol && move.capture);
    if (captureMove) {
        gameState.board[captureMove.capture.row][captureMove.capture.col] = null;
        gameState.captures[gameState.currentPlayer]++;
        updateCaptures();
    }

    gameState.board[newRow][newCol] = gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col];
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null;

    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    renderBoard();
    switchPlayer();
    checkWinCondition();
};

const switchPlayer = () => {
    gameState.currentPlayer = gameState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    updatePlayerTurn();
    checkForLegalMoves();
};

const checkForLegalMoves = () => {
    const currentPlayerPieces = gameState.board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === gameState.currentPlayer ? { row: rowIndex, col: colIndex } : null))
    ).filter(Boolean);

    const hasLegalMoves = currentPlayerPieces.some(piece => calculatePossibleMoves(piece).length > 0);

    if (!hasLegalMoves) {
        const winner = gameState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        showWinAnnouncement(`${gameState.playerNames[winner]} wins!`);
        resetGame();
    }
};

const checkWinCondition = () => {
    const player1Pieces = gameState.board.flat().filter(cell => cell === PLAYER_1).length;
    const player2Pieces = gameState.board.flat().filter(cell => cell === PLAYER_2).length;

    if (player1Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames[PLAYER_2]} wins! We know who the better player is now!`);
        resetGame();
    } else if (player2Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames[PLAYER_1]} wins! We know who the better player is now!`);
        resetGame();
    }
};

const resetGame = () => {
    gameState.board = initialBoard.map(row => [...row]);
    gameState.currentPlayer = PLAYER_1;
    gameState.selectedPiece = null;
    gameState.possibleMoves = [];
    gameState.captures = { [PLAYER_1]: 0, [PLAYER_2]: 0 };
    renderBoard();
    updatePlayerTurn();
    updateCaptures();
};

// Announcement functions
const showModal = (modalId, message) => {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with id "${modalId}" not found`);
        return;
    }
    const modalText = modal.querySelector('.modal-text');
    if (!modalText) {
        console.error(`Modal text element not found in modal with id "${modalId}"`);
        return;
    }
    modalText.innerHTML = message.replace(/\n/g, '<br>');
    modal.style.display = 'block';
};

const showPlayerAnnouncement = (message) => showModal('player-announcement-modal', message);
const showWinAnnouncement = (message) => showModal('win-announcement-modal', message);
const showHowToPlay = () => document.getElementById('how-to-play-modal').style.display = 'block';

const hideModals = () => {
    ['player-announcement-modal', 'win-announcement-modal', 'how-to-play-modal'].forEach(modalId => {
        document.getElementById(modalId).style.display = 'none';
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialization Code
    document.getElementById('name-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const player1Name = document.getElementById('player1-name').value;
        const player2Name = document.getElementById('player2-name').value;
        gameState.playerNames[PLAYER_1] = player1Name;
        gameState.playerNames[PLAYER_2] = player2Name;
        document.getElementById('name-input-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        showPlayerAnnouncement(`${player1Name} is Red\n${player2Name} is Black\nMay the better player win! :)`);
        renderBoard();
        updatePlayerTurn();
        updateCaptures();
    });
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play().catch(() => {
        document.addEventListener('click', () => backgroundMusic.play(), { once: true });
    });
});

// Adds an event listener to the "Switch Theme" button
document.getElementById('theme-switch-button').addEventListener('click', () => {
    // Gets the theme stylesheet link element
    const themeStylesheet = document.getElementById('theme-stylesheet');
    
    // Gets the current theme's href attribute
    const currentTheme = themeStylesheet.getAttribute('href');
    
    // Check the current theme and switch to the other theme
    // If the current theme is 'modern-theme.css', switch to 'classic-theme.css'
    // Otherwise, switch back to 'modern-theme.css'
    themeStylesheet.setAttribute('href', 
        currentTheme.includes('modern-theme.css') ? 'css/classic-theme.css' : 'css/modern-theme.css');
});

document.getElementById('how-to-play-button').addEventListener('click', showHowToPlay);
['player-announcement-close', 'win-announcement-close', 'how-to-play-close'].forEach(id => {
    document.getElementById(id).addEventListener('click', hideModals);
});