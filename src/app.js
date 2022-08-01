export class Block {
    constructor(){
        this.state = false;
        this.label = 0;
        this.flag = false;
    }
}

export class Mine {
    constructor() {
        this.state = false;
        this.label = 'm';
        this.flag = false;
    }
}

export class Grid {
    constructor( row, col ) {
        this.grid;
        this.row = row;
        this.col = col;
        this.buildEmptyGrid();
    }

    // Build a void matrix for introducing data
    buildEmptyGrid() {
        // NOTE: The matrix must have a row and col more than contains for correct processing
        // the game logic and for preventing errors
        this.grid = new Array();
        for( let i = 0; i < this.row + 2; i++ ) {
            const row = [];
            for( let j = 0; j < this.col + 2; j++ ) {
                row.push( new Block() );
            }
            this.grid[i] = [ ...row ];
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

export class MineGrid extends Grid {
    constructor( row, col ) {
        super( row, col );
        this.mines;
        this.countR = 0;
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

        this.mines = mines;
        return this.mines;
    }

    // Set randoms mines at grid
    setMines( numMines ) {
        while( this.countMines() < numMines ) {
            let x = Math.floor( Math.random() * this.col + 1);
            let y = Math.floor( Math.random() * this.row + 1);
            this.grid[ x ][ y ] = new Mine();
        }
    }

    // Numerate the grid around a single mine
    numerateMine( row, col ) {
        for( let i = row - 1; i <= row + 1; i++ ) {
            for( let j = col - 1; j <= col + 1; j++ ) {
                if( i === row && j === col ) continue;
                if( this.grid[i][j].label !== 'm' )
                    this.grid[i][j].label++;
            }
        }
    }

    // Type a number according to the number of mines around for all the mines
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
        if ( this.grid[row][col].label === 0 ) 
            return this.unhideSection(row, col)
        else
            return this.unhideThis(row, col);
    }

    unhideThis( row, col ) {
        if( this.grid[row][col] instanceof Mine ) {
            this.grid[row][col].state = true;
            return false;
        }

        if( this.grid[row][col].label !== 'm' && this.grid[row][col].label !== 0 ) {
            this.grid[row][col].state = true;
            return true;
        }
    }

    unhideSection( row, col) {
            
            for( let i = row - 1; i <= row + 1; i++ ) {
                for( let j = col - 1; j <= col + 1; j++ ) {
                    if( this.grid[i][j].flag ) continue;
                    this.grid[i][j].state = true;
                    // FIXME: Implement Recursion
                    // this.unhideSection(i, j)
                }
            }

            return true;
    }

    renderGame() {
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
        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col + 1; j++ ) {
                if( this.grid[i][j].flag && this.grid[i][j] instanceof Mine )
                    count++;
            }
        }

        if( count === this.mines )
            return true;
        else
            return false;
    }

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