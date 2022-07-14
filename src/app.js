class Grid {
    constructor( row, col ) {
        this.grid;
        this.row = row;
        this.col = col;
        this.buildEmptyGrid();
        this.mines = 0;
    }

    // Build a void matrix for introducing data
    buildEmptyGrid() {
        this.grid = new Array( this.row );
        for( let i = 0; i < this.row; i++ )
            this.grid[i] = new Array( this.col ).fill(0, 0);
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

