'use strict';

(() => {
    window.addEventListener('load', (event) => {
        // *****************************************************************************
        // #region Constants and Variables

        // Canvas references
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        // UI references
        const restartButton = document.querySelector('#restart');
        const playerScoreText = document.querySelector('#score-text'); 

        // Constants for the Tic Tac Toe game
        const CELLS_PER_AXIS = 3; // Tic Tac Toe grid is 3x3
        const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
        const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;

        // Game objects
        let grids;
        let currentPlayer = 'X'; // Track the current player, starting with 'X'
        let stateChanged = false; // Track if a state change occurred

        // #endregion

        // *****************************************************************************
        // #region Game Logic

        function startGame(startingGrid = []) {
            if (startingGrid.length === 0) {
                startingGrid = initializeGrid();
            }
            initializeHistory(startingGrid);
            render(grids[0]);
        }

        function initializeGrid() {
            const newGrid = [];
            for (let i = 0; i < CELLS_PER_AXIS * CELLS_PER_AXIS; i++) {
                newGrid.push(''); // Initialize each cell as an empty string for Tic Tac Toe
            }
            return newGrid;
        }

        function initializeHistory(startingGrid) {
            grids = [];
            grids.push(startingGrid);
        }

        function rollBackHistory() {
            if (grids.length > 1) { // Ensure there's a previous state to go back to
                grids.pop(); // Remove the last grid state
                stateChanged = true; // Mark state change
            }
        }

        function render(grid) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-rendering
            ctx.font = '60px Arial'; // Set font for drawing X and O
            ctx.textAlign = 'center'; // Center the text
            ctx.textBaseline = 'middle'; // Vertically align text in the center

            for (let i = 0; i < grid.length; i++) {
                const cellValue = grid[i];
                const x = (i % CELLS_PER_AXIS) * CELL_WIDTH + CELL_WIDTH / 2; // X-coordinate of the cell center
                const y = Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT + CELL_HEIGHT / 2; // Y-coordinate of the cell center

                ctx.strokeStyle = 'black';
                ctx.strokeRect((i % CELLS_PER_AXIS) * CELL_WIDTH, Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT); // Draw cell borders

                // Draw X or O based on the grid state
                if (cellValue === 'X' || cellValue === 'O') {
                    ctx.fillStyle = 'black';
                    ctx.fillText(cellValue, x, y); // Draw X or O at the cell center
                }
            }
            playerScoreText.textContent = `Player ${currentPlayer}'s Turn`;
        }

        function updateGridAt(mousePositionX, mousePositionY) {
            const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY);
            const newGrid = grids[grids.length - 1].slice(); 
            const cellIndex = gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;

            // Only update if the cell is empty
            if (newGrid[cellIndex] === '') {
                newGrid[cellIndex] = currentPlayer; // Place X or O based on current player
                grids.push(newGrid); // Save new state to history
                stateChanged = true; // Mark state change

                // Switch turns
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                render(newGrid); // Render after updating the grid
            }
        }

        function checkWinCondition(grid) {
            // Define the winning combinations
            const winningCombinations = [
                [0, 1, 2], // Row 1
                [3, 4, 5], // Row 2
                [6, 7, 8], // Row 3
                [0, 3, 6], // Column 1
                [1, 4, 7], // Column 2
                [2, 5, 8], // Column 3
                [0, 4, 8], // Diagonal from top-left to bottom-right
                [2, 4, 6]  // Diagonal from top-right to bottom-left
            ];

            // Check if any of the winning combinations are satisfied
            for (const combination of winningCombinations) {
                const [a, b, c] = combination;
                if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
                    return grid[a]; // Return the winner (X or O)
                }
            }

            return null; // No winner yet
        }

        function restart() {
            currentPlayer = 'X'; // Reset to player X's turn
            startGame(initializeGrid());
            stateChanged = true; // Mark state change after restart
        }

        // #endregion

        // *****************************************************************************
        // #region Event Listeners

        canvas.addEventListener('mousedown', gridClickHandler);
        function gridClickHandler(event) {
            updateGridAt(event.offsetX, event.offsetY);
            const winner = checkWinCondition(grids[grids.length - 1]);

            if (winner) {
                alert(`Player ${winner} wins!`);
                restart(); // Restart game after win
            } else if (grids[grids.length - 1].every(cell => cell !== '')) { // Check for draw
                alert("It's a draw!");
                restart(); // Restart game after draw
            }
        }

        restartButton.addEventListener('mousedown', restartClickHandler);
        function restartClickHandler() {
            restart();
            if (stateChanged) {
                render(grids[grids.length - 1]);
                stateChanged = false;
            }
        }

        // #endregion

        // *****************************************************************************
        // #region Helper Functions

        function convertCartesiansToGrid(xPos, yPos) {
            return {
                column: Math.floor(xPos / CELL_WIDTH),
                row: Math.floor(yPos / CELL_HEIGHT)
            };
        }

        function chooseRandomPropertyFrom(object) {
            const keys = Object.keys(object);
            return object[keys[Math.floor(keys.length * Math.random())]];
        }

        function arraysAreEqual(arr1, arr2) {
            if (arr1.length != arr2.length) { return false; }
            else {
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i] != arr2[i]) {
                        return false;
                    }
                }
                return true;
            }
        }

        // #endregion

        // Start game
        startGame();
    });
})();
