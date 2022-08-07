import MineGrid from "./mine-grid.js";
import UI from "./ui.js";

//Init Game
const settings = {
    rows: 10,
    cols: 10,
    mines: 20,
}

var g = new MineGrid( settings.rows , settings.cols);
g.setMines( settings.mines );
g.numerateGrid();
g.showGameState();
UI.buildGrid( g );

// Start a clock
const initTime = new Date();
let time = "";
setInterval( () => {
    let now = new Date();
    let seconds = now.getSeconds() - initTime.getSeconds();

    //TODO: Repair the temporizador
    document.getElementById('time').innerText = `${ time }`;
} ,1000)

//TODO: Repair the new game
//TODO: Change select table size and set like Windows minesweeper


// Events
// --------------------------------------------------------------------------------------------
document.oncontextmenu = () => false; // Disable Context Menu
document.getElementById('menu-icon').addEventListener( 'click', UI.showAppMenu ); // Showing app menu

// INIT A NEW GAME
document.getElementById('new-game').addEventListener( 'click', () => {

    UI.resetGame();

    const gridRows = document.getElementById('grid-rows').value;
    const gridColumns = document.getElementById('grid-columns').value;
    const gridMines = document.getElementById('mines-config').value;
    const maxMines = gridRows * gridColumns;

    if( gridRows < 2 || gridColumns < 2 || gridRows > 20 || gridColumns > 20 )
        UI.showGameErrorInMenu("ERROR: Wrong Values of rows or columns");   

    else if( document.getElementById( 'mines-config' ).value > maxMines ) {
        UI.showGameErrorInMenu(
            `ERROR: Max num of mines out exceded the max size of grid(${maxMines})`
            );
    }

    else{
        if ( document.getElementById('settings-menu-alert') )
            document.getElementById('settings-menu-alert').remove();
        
        // Set Game Values
        settings.rows = gridRows;
        settings.cols = gridColumns;
        settings.mines = gridMines;

        window.location.reload();
    }
} )

// Clicked in a MineGrid Button
document.querySelectorAll('td button').forEach( ( buttons ) => {

    // Right Click put a Flag in the Button
    buttons.addEventListener( 'mousedown', ( e ) => {
        // TODO: Investigar sobre la propagacion de eventos
        if( e.button === 2) {
            console.log(g.flags);
            
            if( e.target.localName === "button" ) {

                const coordinates = e.target.id.split("-");
                if( g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag ) {
                    e.target.innerHTML = "";
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = false;
                    g.flags++;
                }
                else {
                    if( g.flags === 0 ) return false;
                    e.target.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = true;
                    g.flags--;
                }
            }
            else {
                const coordinates = e.target.parentNode.id.split("-");
                if( g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag ) {
                    e.target.parentNode.innerHTML = "";
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = false;
                    g.flags++;
                }
                else {
                    if( g.flags === 0 ) return false;
                    e.target.parentNode.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                    g.grid[ parseInt(coordinates[1]) + 1 ][ parseInt(coordinates[2]) + 1 ].flag = true;
                    g.flags--;
                }
            }

            UI.updateGrid( g );
        }

        // Left Click unhide the block
        if( e.button === 0 ) {
            g.clearMemo();
            const coordinates = e.target.id.split("-").map( value => parseInt(value) );

            if( g.grid[ coordinates[1] + 1][ coordinates[2] + 1].flag ) return false;

            if( g.grid[ coordinates[1] + 1][ coordinates[2] + 1].label !== 0 )
                g.grid[ coordinates[1] + 1 ][ coordinates[2] + 1].state = true;
            else
                g.unhideBlock( coordinates[1] + 1, coordinates[2] + 1 );

            UI.updateGrid( g );
        }

        if( g.checkWin() )
            UI.showMessageYouWin( g );
        if( g.checkLose() )
            UI.showMessageYouLose( g );
    })
})


document.querySelectorAll('td').forEach( ( blocks ) => {

    blocks.addEventListener( 'dblclick' , ( e ) => {
        console.log( e.target );
        let coordinates;

        e.target.localName === 'span' ?
        coordinates = e.target.id.split("-") :
        coordinates = e.target.children[0].id.split("-");

        g.unhideSection( parseInt(coordinates[1]) + 1, parseInt(coordinates[2]) + 1 );
        UI.updateGrid( g );

        if( g.checkLose() ) {
            UI.showMessageYouLose( g );
        }
        if( g.checkWin() )
            UI.showMessageYouWin( g );
    })
})
