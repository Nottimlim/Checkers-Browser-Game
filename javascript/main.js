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
    const possibleMoves = [];
    const directions = gameState.currentPlayer === PLAYER_1 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    const captureDirections = gameState.currentPlayer === PLAYER_1 ? [[-2, -2], [-2, 2]] : [[2, -2], [2, 2]];

    directions.forEach((direction, index) => {
        const [newRow, newCol] = [piece.row + direction[0], piece.col + direction[1]];
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (gameState.board[newRow][newCol] === null) {
                possibleMoves.push({ row: newRow, col: newCol });
            } else {
                const [captureRow, captureCol] = [piece.row + captureDirections[index][0], piece.col + captureDirections[index][1]];
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
    const modalText = modal.querySelector('.modal-text');
    if (modalText) {
        modalText.innerHTML = message.replace(/\n/g, '<br>');
    } else {
        console.error(`Modal text element not found in modal with id "${modalId}"`);
    }
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
    // All your initialization code, including event listeners, should go here
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
});

document.getElementById('theme-switch-button').addEventListener('click', () => {
    const themeStylesheet = document.getElementById('theme-stylesheet');
    const currentTheme = themeStylesheet.getAttribute('href');
    themeStylesheet.setAttribute('href', currentTheme.includes('css/modern-theme.css') ? 'css/classic-theme.css' : 'css/modern-theme.css');
});

document.getElementById('how-to-play-button').addEventListener('click', showHowToPlay);
['player-announcement-close', 'win-announcement-close', 'how-to-play-close'].forEach(id => {
    document.getElementById(id).addEventListener('click', hideModals);
});

document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play().catch(() => {
        document.addEventListener('click', () => backgroundMusic.play(), { once: true });
    });
});