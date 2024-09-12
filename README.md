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
  - Check if the piece belongs to the current player.
  -  If yes, set selectedPiece to the clicked piece's
     position.
  -  Calculate possible moves for the selected piece.
  - Highlight the possible moves on the board.
```
### Calculate Possible Moves:
```plaintext
- Initialize an empty array for possible moves.
 - Determine move directions based on the current player
    (P1 moves up, P2 moves down).
- For each direction:
    * Calculate the new position.
    * Check if the new position is within bounds and the cell is empty.
    * If yes, add the new position to the possible moves 
      array.
- Check for capture moves:
    * Calculate the position of the opponent's piece.
    * Calculate the landing position after the capture.
    * Check if the landing position is within bounds and
      the cell is empty.
    * If yes, add the landing position to the possible 
      moves array.
- Return the possible moves array.
```
### Handle Move:
``` plaintext
- Add event listeners to all highlighted cells (possible moves).
- When a highlighted cell is clicked:
    * Move the selected piece to the new position.
    * Update the board state.
    * If it's a capture move, remove the captured piece from the board.
    * Clear the selected piece and possible moves.
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
