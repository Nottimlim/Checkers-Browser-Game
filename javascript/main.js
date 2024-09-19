// Constants
const PLAYER_1 = 'P1'; // Identifier for Player 1
const PLAYER_2 = 'P2'; // Identifier for Player 2

// Initial game setup
const initialBoard = [ // Define the initial board setup with players' pieces
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
    board: initialBoard.map(row => [...row]), // Copy the initial board setup
    currentPlayer: PLAYER_1, // Set the current player to Player 1
    selectedPiece: null, // No piece is selected initially
    possibleMoves: [], // No possible moves initially
    playerNames: { [PLAYER_1]: '', [PLAYER_2]: '' }, // Player names are empty initially
    captures: { [PLAYER_1]: 0, [PLAYER_2]: 0 } // Capture counts start at 0
};

// Rendering Functions
const renderBoard = () => {
    const gameContainer = document.getElementById('game-container'); // Get the game container element
    gameContainer.innerHTML = ''; // Clear the game container
    gameState.board.forEach((row, rowIndex) => { // Loop through each row of the board
        const rowElement = document.createElement('div'); // Create a new div for the row
        rowElement.className = 'row'; // Set the class name for the row
        row.forEach((cell, colIndex) => { // Loop through each cell in the row
            const cellElement = document.createElement('div'); // Create a new div for the cell
            cellElement.className = `cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}`; // Set the class name based on the cell color
            cellElement.dataset.row = rowIndex; // Set the row index as a data attribute
            cellElement.dataset.col = colIndex; // Set the column index as a data attribute
            if (cell) { // If the cell is not empty
                const piece = document.createElement('div'); // Create a new div for the piece
                piece.className = `piece ${cell.toLowerCase()}`; // Set the class name for the piece
                piece.addEventListener('click', handlePieceClick); // Add a click event listener to the piece
                cellElement.appendChild(piece); // Append the piece to the cell
            }
            rowElement.appendChild(cellElement); // Append the cell to the row
        });
        gameContainer.appendChild(rowElement); // Append the row to the game container
    });
};

const updatePlayerTurn = () => {
    const playerTurnElement = document.getElementById('player-turn'); // Get the player turn element
    playerTurnElement.innerHTML = `<b>Current Player: ${gameState.playerNames[gameState.currentPlayer]}</b>`; // Update the player turn display
};

const updateCaptures = () => {
    document.getElementById('player1-capture-title').textContent = `${gameState.playerNames[PLAYER_1]} has captured:`; // Update Player 1 capture title
    document.getElementById('player2-capture-title').textContent = `${gameState.playerNames[PLAYER_2]} has captured:`; // Update Player 2 capture title
    document.getElementById('player1-captured-pieces').textContent = gameState.captures[PLAYER_1]; // Update Player 1 capture count
    document.getElementById('player2-captured-pieces').textContent = gameState.captures[PLAYER_2]; // Update Player 2 capture count
};

// Game Logic Functions
const handlePieceClick = (event) => {
    const piece = event.target; // Get the clicked piece element
    const { row, col } = piece.parentElement.dataset; // Get the row and column index from the parent cell
    console.log(`Piece clicked: Row ${row}, Col ${col}`); // Log the clicked piece position
    console.log(`Piece value: ${gameState.board[row][col]}`); // Log the piece value

    if (gameState.board[row][col] !== gameState.currentPlayer) return; // Check if the clicked piece belongs to the current player

    if (gameState.selectedPiece) { // If a piece is already selected
        document.querySelector('.selected')?.classList.remove('selected'); // Remove the 'selected' class from the previously selected piece
    }

    piece.classList.add('selected'); // Add the 'selected' class to the clicked piece
    gameState.selectedPiece = { row: parseInt(row), col: parseInt(col) }; // Update the selected piece in the game state
    highlightPossibleMoves(); // Highlight possible moves for the selected piece
};

const highlightPossibleMoves = () => {
    gameState.possibleMoves.forEach(move => { // Loop through each possible move
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`); // Get the cell element for the move
        if (cell) {
            cell.classList.remove('highlight'); // Remove the 'highlight' class from the cell
            cell.removeEventListener('click', handleMove); // Remove the click event listener from the cell
        }
    });

    gameState.possibleMoves = calculatePossibleMoves(gameState.selectedPiece); // Calculate possible moves for the selected piece
    console.log('Calculated possible moves for highlighting:', gameState.possibleMoves); // Log the possible moves

    gameState.possibleMoves.forEach(move => { // Loop through each possible move
        const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`); // Get the cell element for the move
        if (cell) {
            cell.classList.add('highlight'); // Add the 'highlight' class to the cell
            cell.addEventListener('click', handleMove); // Add a click event listener to the cell
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
                }
            }
        }
    });

    console.log('Possible moves:', possibleMoves); // Log the calculated possible moves for debugging
    return possibleMoves; // Return the array of possible moves
};

const handleMove = (event) => {
    const cell = event.target; // Get the clicked cell element
    const newRow = parseInt(cell.dataset.row); // Get the row index of the cell
    const newCol = parseInt(cell.dataset.col); // Get the column index of the cell
    console.log(`Move to: Row ${newRow}, Col ${newCol}`); // Log the move position

    const captureMove = gameState.possibleMoves.find(move => move.row === newRow && move.col === newCol && move.capture); // Check if the move is a capture move
    if (captureMove) {
        gameState.board[captureMove.capture.row][captureMove.capture.col] = null; // Remove the captured piece from the board
        gameState.captures[gameState.currentPlayer]++; // Increment the capture count for the current player
        updateCaptures(); // Update the capture display
    }

    gameState.board[newRow][newCol] = gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col]; // Move the piece to the new position
    gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col] = null; // Clear the old position

    gameState.selectedPiece = null; // Deselect the piece
    gameState.possibleMoves = []; // Clear the possible moves
    renderBoard(); // Re-render the board
    switchPlayer(); // Switch to the other player
    checkWinCondition(); // Check if the game has been won
};

const switchPlayer = () => {
    gameState.currentPlayer = gameState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1; // Switch the current player
    updatePlayerTurn(); // Update the player turn display
    checkForLegalMoves(); // Check if the new player has any legal moves
};

const checkForLegalMoves = () => {
    const currentPlayerPieces = gameState.board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === gameState.currentPlayer ? { row: rowIndex, col: colIndex } : null))
    ).filter(Boolean); // Get all pieces of the current player

    const hasLegalMoves = currentPlayerPieces.some(piece => calculatePossibleMoves(piece).length > 0); // Check if any piece has legal moves

    if (!hasLegalMoves) {
        const winner = gameState.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1; // Determine the winner
        showWinAnnouncement(`${gameState.playerNames[winner]} wins!`); // Show the win announcement
        resetGame(); // Reset the game
    }
};

const checkWinCondition = () => {
    const player1Pieces = gameState.board.flat().filter(cell => cell === PLAYER_1).length; // Count Player 1 pieces
    const player2Pieces = gameState.board.flat().filter(cell => cell === PLAYER_2).length; // Count Player 2 pieces

    if (player1Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames[PLAYER_2]} wins! We know who the better player is now!`); // Show win announcement for Player 2
        resetGame(); // Reset the game
    } else if (player2Pieces === 0) {
        showWinAnnouncement(`${gameState.playerNames[PLAYER_1]} wins! We know who the better player is now!`); // Show win announcement for Player 1
        resetGame(); // Reset the game
    }
};

const resetGame = () => {
    gameState.board = initialBoard.map(row => [...row]); // Reset the board to the initial setup
    gameState.currentPlayer = PLAYER_1; // Set the current player to Player 1
    gameState.selectedPiece = null; // Deselect any piece
    gameState.possibleMoves = []; // Clear possible moves
    gameState.captures = { [PLAYER_1]: 0, [PLAYER_2]: 0 }; // Reset capture counts
    renderBoard(); // Re-render the board
    updatePlayerTurn(); // Update the player turn display
    updateCaptures(); // Update the capture display
};

// Announcement functions
const showModal = (modalId, message) => {
    const modal = document.getElementById(modalId); // Get the modal element by ID
    if (!modal) {
        console.error(`Modal with id "${modalId}" not found`); // Log an error if the modal is not found
        return;
    }
    const modalText = modal.querySelector('.modal-text'); // Get the modal text element
    if (!modalText) {
        console.error(`Modal text element not found in modal with id "${modalId}"`); // Log an error if the modal text element is not found
        return;
    }
    modalText.innerHTML = message.replace(/\n/g, '<br>'); // Set the modal text with line breaks
    modal.style.display = 'block'; // Display the modal
};

const showPlayerAnnouncement = (message) => showModal('player-announcement-modal', message); // Show player announcement modal
const showWinAnnouncement = (message) => showModal('win-announcement-modal', message); // Show win announcement modal
const showHowToPlay = () => document.getElementById('how-to-play-modal').style.display = 'block'; // Show how-to-play modal
const hideModals = () => {
    ['player-announcement-modal', 'win-announcement-modal', 'how-to-play-modal'].forEach(modalId => {
        document.getElementById(modalId).style.display = 'none'; // Hide all modals
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialization Code
    document.getElementById('name-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting
        const player1Name = document.getElementById('player1-name').value; // Get Player 1 name
        const player2Name = document.getElementById('player2-name').value; // Get Player 2 name
        gameState.playerNames[PLAYER_1] = player1Name; // Set Player 1 name in the game state
        gameState.playerNames[PLAYER_2] = player2Name; // Set Player 2 name in the game state
        document.getElementById('name-input-screen').style.display = 'none'; // Hide the name input screen
        document.getElementById('game-screen').style.display = 'block'; // Show the game screen
        showPlayerAnnouncement(`${player1Name} is Red\n${player2Name} is Black\nMay the better player win! :)`); // Show player announcement
        renderBoard(); // Render the board
        updatePlayerTurn(); // Update the player turn display
        updateCaptures(); // Update the capture display
    });
    const backgroundMusic = document.getElementById('background-music'); // Get the background music element
    backgroundMusic.play().catch(() => { // Try to play the background music
        document.addEventListener('click', () => backgroundMusic.play(), { once: true }); // Play the music on the first click if autoplay fails
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

document.getElementById('how-to-play-button').addEventListener('click', showHowToPlay); // Show how-to-play modal on button click
['player-announcement-close', 'win-announcement-close', 'how-to-play-close'].forEach(id => {
    document.getElementById(id).addEventListener('click', hideModals); // Hide modals on close button click
});