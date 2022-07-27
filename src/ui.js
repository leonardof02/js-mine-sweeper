import { ShadowGrid, MineGrid } from "./app.js";

class UI {

    // FIXME: Arreglar la vista del CSS
    static buildGrid( _shadowGrid = new ShadowGrid() ) {
        const mainGrid = document.getElementById('main-grid');
        for( let i = 0; i < _shadowGrid.row; i++ ) {
            let row = document.createElement( 'tr' );

            for( let j = 0; j < _shadowGrid.col; j++ ) {
                let col = document.createElement( 'td' );

                let button = document.createElement('button');
                button.setAttribute("class", "btn btn-dark container");
                button.style = `width: 30px, height: 30px`;
                button.setAttribute("id", `${i}-${j}`);     
                col.appendChild( button );

                let number = document.createElement('span');
                number.innerText = _shadowGrid.mineGrid.grid[i][j];
                number.setAttribute("class", "m-2")
                button.appendChild(number);

                row.appendChild( col );
            }
            mainGrid.appendChild( row );
        }
    }
}

document.oncontextmenu = () => { return false; }

// ---------------------- TESTING APP ------------------------ //

const g = new MineGrid(10, 10);
g.setMines(10);
g.numerateGrid();

const s = new ShadowGrid( g );
s.showGrid();
s.unhide(3, 3);
s.unhideAll();
s.showGrid();

const array = [
    [ {obj: "mine", number: 3}, {obj: false, number: 2}, {obj: false, number: 3} ],
    [ {obj: "mine", number: 3}, {obj: false, number: 2}, {obj: false, number: 3} ],
    [ {obj: "mine", number: 3}, {obj: false, number: 2}, {obj: false, number: 3} ],
    [ {obj: "mine", number: 3}, {obj: false, number: 2}, {obj: false, number: 3} ],
]
console.table(array);

// UI.buildGrid( s );

// ---------------------- TESTING APP ------------------------ //

// Events
document.querySelectorAll('td button').forEach( ( buttons ) => {

    // FIXME: Arreglar el proceso inverso de poner la banderita (quitar la banderita)

    buttons.addEventListener( 'mousedown', ( e ) => {
        if( e.button === 2) {
            if( e.target.localName === "span" ) {
                e.target.innerText = "";
                e.target.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
            }

            if( e.target.localName === "button" ) {
                if( e.target.children[0].localName === "i" ) {
                    e.target.removeChild( document.querySelector('i') );
                }
                else {
                    let span = e.target.children[0];
                    span.innerText = "";
                    span.innerHTML = `<i class="fa fa-flag style="color: white" ></i>`;
                }
            }

            console.log(e.target);
            console.log(e.target.children); 
        }
    })
    
})
