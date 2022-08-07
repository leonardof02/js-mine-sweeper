import { Block } from "./block-objects.js";

// Grid System class
export default class Grid {
    constructor( row, col ) {
        this.grid;
        this.row = row;
        this.col = col;
        this.buildBlockGrid();
    }

    // Build a void matrix for introducing data
    buildBlockGrid() {
        // NOTE: The matrix must have a row and col more than contains for correct processing
        // the game logic and for preventing errors
        this.grid = new Array();
        for( let i = 0; i < this.row + 2; i++ ) {
            const row = [];
            for( let j = 0; j < this.col + 2; j++ ) {
                row.push( new Block() );
            }
            this.grid.push(row);
        }
    }

    // Clear the grid and set to void values
    clearGrid() {
        this.grid.forEach( value => value.fill( new Block() ) );
    }

    // Show grid in a table
    showGameState() {
        const gameState = this.grid.slice(1, this.row + 1).map( value => value.slice(1, this.col + 1));
        console.table( gameState );
    }

    showOriginalGrid() {
        console.table( this.grid );
    }
}