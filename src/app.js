export class Grid {
    constructor( row, col ) {
        this.grid;
        this.row = row;
        this.col = col;
        this.buildEmptyGrid();
    }

    // Build a void matrix for introducing data
    buildEmptyGrid() {
        this.grid = new Array( this.row );
        for( let i = 0; i < this.row; i++ )
            this.grid[i] = new Array( this.col ).fill(0, 0);
    }

    // Add a 4 new bouders for preventing Segmentation Fault
    addLimiters() {
        const emptyArr = new Array(this.col).fill(0);
        this.grid.push( [...emptyArr] );
        this.grid.unshift( [...emptyArr] );

        this.grid.forEach( (value) => {
            value.push(0);
            value.unshift(0);
        })
    }

    // Remove the bouders 
    removeLimiters() {
        const emptyArr = new Array(this.col).fill(0);
        this.grid.pop();
        this.grid.shift();

        this.grid.forEach( (value) => {
            value.pop();
            value.shift();
        })
    }

    // Clear the grid and set to void values
    clearGrid() {
        this.grid.forEach( ( value ) => {
            value.fill(0);
        })
    }

    // Show grid in a table
    showGrid() {
        console.table( this.grid );
    }
}
export class MineGrid extends Grid {
    constructor( row, col ) {
        super( row, col );
        this.mines;
    }

    // Count all the mines in the grid
    countMines() {
        let mines = 0;
        for( let i in this.grid ) {
            this.grid[i].forEach( ( value ) => {
                if( value === 'm' )
                    mines++;
            })
        }
        this.mines = mines;
        return this.mines;
    }

    // Set randoms mines at grid
    setMines( numMines ) {
        while( this.countMines() < numMines ) {
            let x = Math.floor( Math.random() * this.col );
            let y = Math.floor( Math.random() * this.row );
            this.grid[ x ][ y ] = 'm';
        }
    }

    // Numerate the grid around a single mine
    numerateMine( row, col ) {
        for( let i = row - 1; i <= row + 1; i++ ) {
            for( let j = col - 1; j <= col + 1; j++ ) {
                if( i === row && j === col ) continue;
                if( this.grid[i][j] !== 'm' )
                    this.grid[i][j]++;
            }
        }
    }

    // Type a number according to the number of mines around for all the mines
    numerateGrid() {
        this.addLimiters();
        for( let i = 1; i <= this.row; i++ ) {
            for( let j = 1; j <= this.col; j++ ) {
                if( this.grid[i][j] === 'm' )
                    this.numerateMine(i, j);
            }
        }
        this.removeLimiters();
        console.table( this.grid );
    }
}

export class ShadowGrid extends Grid {
    constructor( mGrid = MineGrid() ) {
        super( mGrid.row, mGrid.col );

        // Props
        this.mineGrid = mGrid;
        this.shadowGrid;

        this.hide();
    }

    // Hide the elements of the grid
    hide() {
        this.shadowGrid = new Array( this.row );
        for( let i = 0; i < this.row; i++ )
            this.shadowGrid[i] = new Array( this.col ).fill(false, 0);
    }

    unhide( row, col ) {
        if( this.mineGrid.grid[row][col] === 'm' ) {
            this.shadowGrid[row][col] = 'm';
            this.showGrid();
            return false;
        }

        else if( Number.isInteger( this.mineGrid.grid[row][col] ) && this.mineGrid.grid[row][col] !== 0 ) {
            this.shadowGrid[row][col] = this.mineGrid.grid[row][col];
            this.showGrid();
            return true;
        }

        else if ( this.mineGrid.grid[row][col] === 0 ) {
            // FIXME: No desoculta las minas bien
            this.mineGrid.addLimiters();
            this.addLimiters();
            
            for( let i = row - 1; i <= row + 1; i++ ) {
                for( let j = col - 1; j <= col + 1; j++ ) {
                    if( this.mineGrid.grid[i][j] === 0 )
                        this.shadowGrid[i][j] = " ";
                    else
                        this.shadowGrid[i][j] = this.mineGrid.grid[i][j];
                }
            }

            this.mineGrid.removeLimiters();
            this.removeLimiters();
        }
        
        this.showGrid();
        return true;
    }

    unhideAll() {
        for( let i = 0; i < this.row; i++ ) {
            for( let j = 0; j < this.col; j++ ) {
                this.shadowGrid[i][j] = this.mineGrid.grid[i][j];
            }
        }
    }

    showGrid() {
        console.table( this.shadowGrid );
    }
}