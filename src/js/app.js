import MineGrid from "./mine-grid.js";
import UI from "./ui.js";
import { Clock } from "./clock.js";

document.addEventListener( 'DOMContentLoaded', () => {

    const clock = new Clock(9, 59);
    // Load settings from local storage
    const settings = {
        rows:   parseInt( localStorage.getItem('rows') ),
        cols:   parseInt( localStorage.getItem('cols') ),
        mines:  parseInt( localStorage.getItem('mines') ),
    }
    
    // INIT GAME
    const g = new MineGrid( settings.rows, settings.cols );
    g.setMines( settings.mines );
    g.numerateGrid();
    g.showGameState();
    UI.buildGrid( g );
    console.log( g.mines, g.row, g.col, g.flags );
    
    // Start a clock
    const initTime = new Date();
    let time = "";
    setInterval( () => {
        let now = new Date();
        let seconds = now.getSeconds() - initTime.getSeconds();
    
        //TODO: Repair the temporizador
        document.getElementById('time').innerText = `${ time }`;
    } ,1000)
    
    // Events
    // --------------------------------------------------------------------------------------------
    document.oncontextmenu = () => false; // Disable Context Menu
    document.getElementById('menu-icon').addEventListener( 'click', UI.showAppMenu ); // Showing app menu
    
    // Click on New Game Button
    document.getElementById('new-game').addEventListener( 'click', () => {
    
        // Get data for new game
        const gridRows = document.getElementById('grid-rows').value;
        const gridColumns = document.getElementById('grid-columns').value;
        const gridMines = document.getElementById('mines-config').value;
        const maxMines = ( gridRows * gridColumns ) - 1;
    
        // Check errors
        if( gridRows < 2 || gridColumns < 2 || gridRows > 20 || gridColumns > 20 )
            UI.showGameErrorInMenu("ERROR: Wrong Values of rows or columns");   
    
        else if( document.getElementById( 'mines-config' ).value > maxMines ) {
            UI.showGameErrorInMenu(
                `ERROR: Max num of mines out exceded the max size of grid(${maxMines})`
                );
        }
        else {
            // Remove the error alert if exists
            if ( document.getElementById('settings-menu-alert') )
                document.getElementById('settings-menu-alert').remove();
            
            // Set Game Values
            localStorage.setItem( 'rows', gridRows );
            localStorage.setItem( 'cols', gridColumns );
            localStorage.setItem( 'mines', gridMines );
    
            // Relaoad page
            window.location.reload();
        }
    })
    
    // Clicked in a Button on Grid
    document.querySelectorAll('td button').forEach( buttons => {
    
        // Manage clicks in buttons
        buttons.addEventListener( 'mousedown', ( e ) => {

            // Get position from the id of button
            const coordinates = e.target.id.split("-")
            .map( value => parseInt( value ) )
            .filter( value => ! isNaN( value ) );

            // If rigth click put a flag
            if( e.button === 2) {

                if( g.grid[ coordinates[0] + 1 ][ coordinates[1] + 1 ].flag ) {
                    e.target.innerHTML = "";
                    g.grid[ coordinates[0] + 1 ][ coordinates[1] + 1 ].flag = false;
                    g.flags++;
                }

                else {
                    if( g.flags === 0 ) return false;
                    e.target.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                    g.grid[ coordinates[0] + 1 ][ coordinates[1] + 1 ].flag = true;
                    g.flags--;
                }

                UI.updateGrid( g );
            }

            // Left Click unhide the block
            if( e.button === 0 ) {
                // g.clearMemo();
    
                if( g.grid[ coordinates[0] + 1][ coordinates[1] + 1].flag ) return false;
    
                if( g.grid[ coordinates[0] + 1][ coordinates[1] + 1].label !== 0 )
                    g.grid[ coordinates[0] + 1 ][ coordinates[1] + 1].state = true;
                else
                    g.unhideBlock( coordinates[0] + 1, coordinates[1] + 1 );
    
                UI.updateGrid( g );
            }

            // Check if the Game is over
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
    
            if( g.checkWin() )
                UI.showMessageYouWin( g );
            if( g.checkLose() )
                UI.showMessageYouLose( g );
            
        })
    })
})
