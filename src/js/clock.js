export class Clock {

    constructor( minutes = 0, seconds = 0 ) {
        this.seconds = seconds;
        this.minutes = minutes;
        this.time = "";
        this.start();
    }

    start() {

        setInterval( () => {
            this.time = [];
            this.seconds++;

            if( this.seconds === 60 ) {
                this.seconds = 0;
                this.minutes++;
            }


            if( this.minutes < 10 )
                this.time.unshift( '0' );
                
            this.time.push( `${ this.minutes }:` );
    
            if( this.seconds < 10 )
                this.time.push( `0${ this.seconds }` );
            else
                this.time.push( `${ this.seconds }` );
                
            console.log( this.time );

        }, 1000 )
    }
}