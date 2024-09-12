# Checkers Game Project Planning
![Checkers](/images/checkers-reference.png)
## Pseudocode for Overall Gameplay

### Initialize Game State:
```plaintext
- Create an 8x8 board with initial positions for P1 and P2 pieces.
- Set the current player to 'P1'.
- Initialize selectedPiece to null.
- Initialize possibleMoves to an empty array.
```

### Render Board:
```plaintext
- Loop through the board array.
- For each cell, create a corresponding HTML element.
- If the cell contains a piece, add a piece element inside the cell element.
- Append cell elements to the game container in the DOM.
```
### Handle Piece Selection:
```plaintext
- Add event listeners to all pieces.
- When a piece is clicked:
  * Check if the piece belongs to the current player.
  *  If yes, set selectedPiece to the clicked piece's
     position.
  *  Calculate possible moves for the selected piece.
  * Highlight the possible moves on the board.
```
### Calculate Possible Moves:
```plaintext
- Initialize an empty array for possible moves.
 - Determine move directions based on the current player
    (P1 moves up, P2 moves down).
- For each direction:
    * Calculate the new position.
    * Check if the new position is 
    within bounds and the cell is empty.
    * If yes, add the new position to 
      the possible moves 
      array.
- Check for capture moves:
    * Calculate the position of the
      opponent's piece.
    * Calculate the landing position
      after the capture.
    * Check if the landing position is
      within bounds and
      the cell is empty.
    * If yes, add the landing position
      to the possible moves array.
- Return the possible moves array.
```
### Handle Move:
``` plaintext
- Add event listeners to all highlighted cells (possible moves).
- When a highlighted cell is clicked:
    * Move the selected piece to the new
      position.
    * Update the board state.
    * If it's a capture move, remove the 
     captured piece from the board.
    * Clear the selected piece and
      possible moves.
    * Switch the current player.
    * Check for win condition.
```
### Check Win Condition:
```plaintext
- Count the number of pieces for each player on the board.
- If a player has no pieces left, declare the other player as the winner.
- Display a win/loss message in the HTML.
```
## Initial Data Structure for Checkers Game State
### Explanation
```plaintext
board: A 2D array representing the 8x8 game board. Each element can be:

null for an empty cell,
'P1' for a Player 1 piece,
'P2' for a Player 2 piece.
currentPlayer: A string indicating whose turn it is. It can be 'P1' or 'P2'.

selectedPiece: An object representing the currently selected piece. It will store the piece's position on the board (e.g., { row: 5, col: 2 }). Initially, it is set to null.

possibleMoves: An array of possible moves for the selected piece. Each move is represented as an object with row and col properties (e.g., { row: 4, col: 3 }). Initially, it is an empty array.
```

```javascript
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
