import  { Mine, MineGrid } from "./app.js";

class UI {
    // FIXME: Arreglar la vista del CSS

    // Build the Grid at UI with mines inside and labels
    static buildGrid( _mineGrid = new MineGrid() ) {
        const mainGrid = document.getElementById('main-grid');
        for( let i = 1; i <= _mineGrid.row; i++ ) {
            let row = document.createElement( 'tr' );

            for( let j = 1; j <= _mineGrid.col; j++ ) {
                let col = document.createElement( 'td' );

                let number = document.createElement('span');
                number.innerText = _mineGrid.grid[i][j].label;
                number.setAttribute("class", "m-2");
                number.setAttribute("id", `s-${i - 1}-${j - 1}`);
                number.style.position = "absolute";
                col.appendChild(number);

                let button = document.createElement('button');
                button.setAttribute("class", "btn btn-dark container");
                button.setAttribute("id", `b-${i - 1}-${j - 1}`);
                col.appendChild( button );
                //button.style = "position: relative";

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
                    document.getElementById( `b-${ i - 1 }-${ j - 1 }` ).style.display = "none";
                }
            }
        }
    }

    static showMessageYouLose() {
        const mainGrid = document.getElementById('main-grid');
        const youLose = document.createElement('div');
        youLose.setAttribute('class', 'alert alert-danger');
        youLose.innerText = "!!! HAS PERDIDO";
        mainGrid.appendChild( youLose );
    }
}

document.oncontextmenu = () => { return false; }

// APP MAIN
const g = new MineGrid(10, 10);
g.setMines(10);
g.numerateGrid();
UI.buildGrid( g );

// ---------------------- TESTING APP ------------------------ //

// ---------------------- END TESTING APP ------------------------ //

// Events

// Click in a Grid Button
document.querySelectorAll('td button').forEach( ( buttons ) => {

    // Right Click put a Flag in the Button
    buttons.addEventListener( 'mousedown', ( e ) => {
        // FIXME: Investigar sobre la propagacion de eventos
        if( e.button === 2) {
            
            if( e.target.localName === "button" ) {
                const coordinates = e.target.id.split("-");
                if( g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag ) {
                    e.target.innerHTML = "";
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = false;
                }
                else {
                    e.target.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = true;
                }
            }
            else {
                const coordinates = e.target.parentNode.id.split("-");
                if( g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag ) {
                    e.target.parentNode.innerHTML = "";
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = false;
                }
                else {
                    e.target.parentNode.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = true;
                }
            }
        }
    })

    // Click
    buttons.addEventListener( 'click', ( e ) => {
        const coordinates = e.target.id.split("-");
        if( g.unhideBlock( parseInt(coordinates[1]) + 1, parseInt(coordinates[2]) + 1 ) )
            UI.updateGrid( g );
        else {
            UI.showMessageYouLose();
            UI.updateGrid( g );
        }
    })

})

document.querySelectorAll('td').forEach( ( blocks ) => {

    // FIXME: Arreglar el proceso inverso de poner la banderita (quitar la banderita)

    blocks.addEventListener( 'dblclick' , ( e ) => {
        console.log( e.target );
        let coordinates;
        e.target.localName === 'span' ?  coordinates = e.target.id.split("-") : coordinates = e.target.children[0].id.split("-");
        console.log( "x: ", coordinates[1], "y: ", coordinates[2] );
        g.unhideSection( parseInt(coordinates[1]) + 1, parseInt(coordinates[2]) + 1 );
        UI.updateGrid( g );
        if( g.checkLose() )
            UI.showMessageYouLose();
    })



})


