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

// DOM

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
});