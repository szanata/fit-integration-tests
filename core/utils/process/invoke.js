const { fork } = require( 'child_process' );
const genId = require( '../data/gen_id' );

const createHandler = proc => ( { name, args } ) => {
  setTimeout( () => {
    if ( proc.exitCode === null ) {
      proc.send( { name, args } );
    }
  }, 1500 );
};

module.exports = ( runner, emitter, args ) => {
  const id = genId();
  const params = [ JSON.stringify( { id, args } ) ];
  const options = { stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ] };
  const listenEvent = `message_to:${id}`;
  const proc = fork( runner, params, options );
  const handler = createHandler( proc );

  emitter.on( listenEvent, handler );

  // @DEV
  // proc.stdout.on( 'data', data => {
  //   console.log( Buffer.from( data ).toString() );
  // } );

  // proc.stderr.on( 'data', data => {
  //   console.error( Buffer.from( data ).toString() );
  // } );
  // end @DEV

  return new Promise( resolve => {
    proc.on( 'message', result => {
      emitter.removeListener( listenEvent, handler );
      resolve( result );
    } );
  } );
};
