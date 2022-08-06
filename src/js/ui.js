import { Button } from "bootstrap";
import { Block, Mine } from "./block-objects.js";
import MineGrid from "./mine-grid.js";
export default class UI {
    // FIXME: Arreglar la vista del CSS

    // Build the Grid at UI with mines inside and labels with styles
    static buildGrid( _mineGrid = new MineGrid() ) {
        const mainGrid = document.getElementById('main-grid');
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
        for( let i = 1; i <= _mineGrid.row; i++ ) {
            for( let j = 1; j <= _mineGrid.col; j++ ) {
                if( _mineGrid.grid[i][j].state ) {
                    document.getElementById( `b-${ i - 1 }-${ j - 1 }` ).classList.add("button-hide");
                    setTimeout( () => {
                        document.getElementById( `b-${ i - 1 }-${ j - 1 }` ).style.display = "none";
    
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
                    }, 100 );

                }
            }
        }
    }

    static unhideMinesAnimation( _mineGrid = new MineGrid() ) {
        // TODO: Hacer que las minas se desoculten poco a poco;
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

    static WinAnimation( _mineGrid = new MineGrid() ) {
        let animation;
        const buttons = document.querySelectorAll( 'tr button' );
        let count = 0;

        const unhideBlock = () => {
            if( buttons[count].firstChild.localName === 'span' && buttons[count].firstChild. )
            buttons[count].style.display = 'none';
            buttons[count].parentNode.style.backgroundColor = '#5CF79A';
            if( count === buttons.length )
                clearInterval(animation);
            count++;
        }

        animation = setInterval( unhideBlock, 30 );
    }

    static showMessageYouLose( _mineGrid = new MineGrid() ) {

        this.unhideMinesAnimation( _mineGrid );

        const mainGrid = document.getElementById('main-grid');
        const youLose = document.createElement('div');
        youLose.setAttribute('class', 'alert alert-danger');
        youLose.innerText = "!!! HAS PERDIDO";
        mainGrid.appendChild( youLose );
    }

    static showMessageYouWin( _mineGrid = new MineGrid() ) {

        this.WinAnimation( _mineGrid );

        const mainGrid = document.getElementById('main-grid');
        const youWin = document.createElement('div');
        youWin.setAttribute('class', 'alert alert-success');
        youWin.innerText = "HAS GANADO!!!";
        mainGrid.appendChild( youWin );
    }
}