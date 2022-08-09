import Grid from "./grid-system.js";
import { Block, Mine } from "./block-objects.js";

export default class MineGrid extends Grid {
    constructor( row, col ) {
        // Init the grid
        super( row, col );

        // Max num of mines and flags
        this.mines;
        this.flags;

        // Memoization for recursion unhiding
        this.memo;
        this.clearMemo();
    }

    // Matrix for memoization
    clearMemo() {
        this.memo = new Array();
        for (let i = 0; i < this.row + 2; i++) {
            let row = [];
            for( let j = 0; j < this.col + 2; j++ ){
                row.push(false);
            }
            this.memo.push(row);
        }
    }

    // Count all the mines in the grid
    countMines() {
        let mines = 0;

        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col; j++ ) {
                if( ( this.grid[i][j] instanceof Mine ) ) {
                    mines++;
                }
            }
        }

        return mines;
    }

    // Set randoms mines at grid
    setMines( numMines ) {
        while( this.countMines() < numMines ) {
            let x = Math.floor( Math.random() * this.col + 1);
            let y = Math.floor( Math.random() * this.row + 1);
            this.grid[ x ][ y ] = new Mine();
        }

        this.mines = numMines;
        this.flags = numMines;
    }

    // Precalculate the number of adyacent mines in a block
    numerateMine( row, col ) {
        for( let i = row - 1; i <= row + 1; i++ ) {
            for( let j = col - 1; j <= col + 1; j++ ) {
                if( i === row && j === col ) continue;
                if( this.grid[i][j].label !== 'm' )
                    this.grid[i][j].label++;
            }
        }
    }

    // Precalculate the mines matrix
    numerateGrid() {
        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col; j++ ) {
                if( this.grid[i][j] instanceof Mine )
                    this.numerateMine(i, j);
            }
        }
        this.showGameState();
    }

    // State of all blocks is hide (state: false);
    hideAll() {
        for( let row in this.grid ) 
            row.forEach( col => { col.state = false } );
    }

    unhideAll() {
        for( let i = 1; i <= this.row; i++  ) {
            for( let j = 1 ; j <= this.col; j++ ) {
                this.grid[i][j].state = true;
            }
        }
        this.showGameState();
    }

    unhideBlock(row, col) {

        if( this.memo[row][col] )
            return;
        
        // If is a corner
        if( row < 1 || row > this.row || col < 1 || col > this.col || this.grid[row][col] instanceof Mine ||
            this.grid[row][col].state || this.grid[row][col].flag ) {
                this.memo[row][col] = true;
                return true;
        }

        else if ( this.grid[row][col].label !== 0 && this.grid[row][col] instanceof Block  ) {
            this.grid[row][col].state = true;
            this.memo[row][col] = true;
            return;
        }
        
        this.grid[row][col].state = true;

        this.unhideBlock( row - 1, col );       // UP
        this.unhideBlock( row + 1, col );       // DOWN
        this.unhideBlock( row, col + 1 );       // RIGHT
        this.unhideBlock( row, row - 1 );       // LEFT
        this.unhideBlock( row + 1, col + 1 );
        this.unhideBlock( row + 1, col - 1 );
        this.unhideBlock( row - 1, col + 1 );
        this.unhideBlock( row - 1, col - 1 );
    }   

    checkFlagsAround( row, col ) {
        for( let i = row - 1; i <= row + 1; i++  ) {
            for( let j = col - 1 ; j <= col + 1; j++ ) {
                if( this.grid[i][j].flag )
                    return true;
            }
        }
        return false;
    }

    unhideSection(row, col) {
        if( this.grid[row][col].label === 0 ) return;
        if( ! this.checkFlagsAround( row, col ) ) return;

        for( let i = row - 1; i <= row + 1; i++  ) {
            for( let j = col - 1 ; j <= col + 1; j++ ) {
                if( this.grid[i][j].flag ) continue;
                if( this.grid[i][j].label === 0 ) this.unhideBlock( i, j );
                this.grid[i][j].state = true;
            }
        }
    }

    // Print the game for console
    consoleRenderGame() {
        const gameState = this.grid.slice(1, this.row + 1).map( value => value.slice(1, this.col + 1));
        const shadowGrid = new Array();
        
        for( let i = 0; i < this.row; i++ ) {
            const row = [];
            for( let j = 0; j < this.col; j++ ) {
                if( gameState[i][j].state )
                    row.push( gameState[i][j].label );
                else
                    row.push( " - ");
            }

            shadowGrid[i] = [ ...row ];
        }

        console.table( shadowGrid );
    }

    checkWin() {
        let count = 0;

        console.log(count);
        console.log( this.mines );

        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col; j++ ) {
                if( ! this.grid[i][j].state )
                    count++;
            }
        }

        if( count === this.mines )
            return true;

        return false;
    }

    // Check if the player loose
    checkLose() {
        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col + 1; j++ ) {
                if( this.grid[i][j].state && this.grid[i][j] instanceof Mine )
                    return true;
            }
        }
        return false;
    }
}