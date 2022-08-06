import MineGrid from "./mine-grid.js";
import UI from "./ui.js";
import { Mine } from "./block-objects.js";


// APP MAIN
const g = new MineGrid(10, 10);
g.setMines(8);
g.numerateGrid();
UI.buildGrid( g );
g.consoleRenderGame();

// Events
// --------------------------------------------------------------------------------------------

// Clicked in a MineGrid Button
document.querySelectorAll('td button').forEach( ( buttons ) => {

    // Right Click put a Flag in the Button
    buttons.addEventListener( 'mousedown', ( e ) => {
        // TODO: Investigar sobre la propagacion de eventos
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

        // Left Click unhide the block
        if( e.button === 0 ) {
            g.clearMemo();
            const coordinates = e.target.id.split("-").map( value => parseInt(value) );

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
