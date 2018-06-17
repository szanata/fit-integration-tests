const http = require( 'http' );

const parseBody = body => {
  const stringBody = Buffer.concat( body ).toString();
  try {
    return stringBody ? JSON.parse( stringBody ) : null;
  } catch ( err ) {
    return stringBody;
  }
};

const makeHandle = emitter => ( req, res ) => {
  const body = [];
  req.on( 'data', chunk => body.push( chunk ) ).on( 'end', () => {
    const emitterId = req.url.split( '/' )[1];
    const parsedBody = parseBody( body );
    if ( req.method === 'POST' ) {
      emitter.emit( 'any', { eventName: 'http-post', emitterId, args: { req, body: parsedBody } } );
    }
    if ( req.method === 'GET' ) {
      emitter.emit( 'any', { eventName: 'http-get', emitterId, args: { req } } );
    }
    res.end( );
  } );
};

module.exports = ( port, emitter ) => http.createServer( makeHandle( emitter ) ).listen( port );

