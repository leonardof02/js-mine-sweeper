import { Block, Mine } from "./block-objects.js";
import MineGrid from "./mine-grid.js";
export default class UI {
    // FIXME: Arreglar la vista del CSS

    //Props
    menu = false;

    // Build the Grid at UI with mines inside and labels with styles
    static buildGrid( _mineGrid = new MineGrid() ) {
        const mainGrid = document.getElementById('main-grid');
        document.getElementById('num-flags').innerText = _mineGrid.mines;
        document.getElementById('num-mines').innerText = _mineGrid.mines;


        for( let i = 1; i <= _mineGrid.row; i++ ) {
            let row = document.createElement( 'tr' );

            for( let j = 1; j <= _mineGrid.col; j++ ) {
                let col = document.createElement( 'td' );

                if( _mineGrid.grid[i][j] instanceof Mine ) {
                    col.innerHTML = `<img src="src/icons/mine.svg" alt="">`;
                    col.children[0].style.position = "absolute";
                }
                else {
                    let label = document.createElement('span');
                    if( _mineGrid.grid[i][j].label !== 0 )
                        label.innerText = _mineGrid.grid[i][j].label;
                    label.setAttribute("class", "m-2");
                    label.setAttribute("id", `s-${i - 1}-${j - 1}`);
                    col.appendChild(label);
                }
                

                let button = document.createElement('button');
                button.setAttribute("class", "btn btn-dark container");
                button.setAttribute("id", `b-${i - 1}-${j - 1}`);
                col.appendChild( button );

                row.appendChild( col );
            }
            mainGrid.appendChild( row );
        }
    }

    // Update the UI Grid
    static updateGrid( _mineGrid = new MineGrid() ) {
        document.getElementById('num-flags').innerText = _mineGrid.flags;
        for( let i = 1; i <= _mineGrid.row; i++ ) {
            for( let j = 1; j <= _mineGrid.col; j++ ) {
                if( _mineGrid.grid[i][j].state ) {
                    document.getElementById( `b-${ i - 1 }-${ j - 1 }` ).classList.add("button-hide");
                    document.getElementById( `b-${ i - 1 }-${ j - 1 }` ).style.display = "none";
    
                    //if(  )

                    // Style the Grid according to Number of Mines
                    if( _mineGrid.grid[i][j] instanceof Block ) {
                        const label = document.getElementById( `s-${ i - 1 }-${ j - 1 }` );
                        if( label.innerText === '1' || label.innerText === '5') {
                            label.parentNode.style.backgroundColor = '#240019';
                            label.parentNode.style.color = '#ea00f4';
                        }
                        if( label.innerText === '2' || label.innerText === '6') {
                            label.parentNode.style.backgroundColor = '#385942';
                            label.parentNode.style.color = '#45ff3f';
                        }
                        if( label.innerText === '3' || label.innerText === '7') {
                            label.parentNode.style.backgroundColor = '#0045df';
                            label.parentNode.style.color = '#00ffff';
                        }
                        if( label.innerText === '4' || label.innerText === '8' ) {
                            label.parentNode.style.backgroundColor = '#b48400';
                            label.parentNode.style.color = '#ecff00';
                        }
                    }
                }
            }
        }
    }

    static unhideMinesAnimation( _mineGrid = new MineGrid() ) {
        const explosionSound = document.getElementById('explosion-sfx');
        const mines = [];
        let count = 0;
        
        for( let i = 1; i <= _mineGrid.row; i++ ) {
            for( let j = 1; j <= _mineGrid.col; j++ ) {
                if( _mineGrid.grid[i][j] instanceof Mine ) {
                    mines.push( document.getElementById( `b-${ i - 1 }-${ j - 1 }` ) );
                }     
            }
        }

        let animation;

        const unhideMine = () => {
            explosionSound.play();
            mines[count].parentNode.style.backgroundColor = "darkred";
            mines[ count ].style.display = 'none';
            count++;
            if( count === mines.length )
                clearInterval(animation);
        }

        animation = setInterval( unhideMine, 100 );
    }

    static unhideAllBlocks( _mineGrid ) {
        for( let i = 1; i <= _mineGrid.row; i++ ) {
            for( let j = 1; j <= _mineGrid.col; j++ ) {
                document.getElementById(`b-${ i - 1 }-${ j - 1 }` ).style.display = 'none';
                if( _mineGrid.grid[i][j] instanceof Block )
                    document.getElementById(`s-${ i - 1 }-${ j - 1 }` ).innerText = '';
            }
        }
    }

    static WinAnimation( _mineGrid ) {
        let animation;
        let count = 0;
        const blocks = [];

        for( let i = 1; i <= _mineGrid.row; i++ ) {
            for( let j = 1; j <= _mineGrid.col; j++ ) {
                if( _mineGrid.grid[i][j].label !== 'm' )
                    blocks.push( document.getElementById(`s-${ i - 1 }-${ j - 1 }` ) );
            }
        }

        console.table( _mineGrid.grid );
        console.log( blocks );
        const unhideBlock = () => {
            if( blocks[count])
                
            blocks[count].parentNode.style.backgroundColor = '#38ff77';
            if( count === blocks.length )
                clearInterval(animation);
            count++;
        }

        animation = setInterval( unhideBlock, 20 );
    }

    static showMessageYouLose( _mineGrid = new MineGrid() ) {

        this.unhideMinesAnimation( _mineGrid );

        const mainGrid = document.getElementById('main-grid');
        const youLose = document.createElement('div');
        youLose.setAttribute('class', 'alert loose-alert');
        youLose.innerHTML = "<p>!!! HAS PERDIDO</p>";
        mainGrid.appendChild( youLose );
    }

    static showMessageYouWin( _mineGrid = new MineGrid() ) {

        this.unhideAllBlocks( _mineGrid );
        this.WinAnimation( _mineGrid );

        const mainGrid = document.getElementById('main-grid');
        const youWin = document.createElement('div');
        youWin.setAttribute('class', 'alert win-alert');
        youWin.innerHTML = "<p>HAS GANADO!!!</p>";
        mainGrid.appendChild( youWin );
    }

    static showAppMenu() {
        if( this.menu ) {
            document.getElementById('menu-icon').style.transform = 'rotate(0deg)';
            document.getElementById('settings-menu').style.right = '-340px';
        }
        else {
            document.getElementById('menu-icon').style.transform = 'rotate(90deg)';
            document.getElementById('settings-menu').style.right = '0px';
        }

        this.menu = ! this.menu;
    }

    static showGameErrorInMenu( text ) {
        if ( ! document.getElementById('settings-menu-alert') ) {
            const alert = document.createElement('div');
            alert.setAttribute( 'id', 'settings-menu-alert' );
            alert.innerText = text;
            document.getElementById('settings-menu').appendChild(alert);
        } else {
            document.getElementById('settings-menu-alert').innerText = text;
        }
    }

    static resetGame() {
        document.getElementById('main-grid').innerHTML = "";
    }
}