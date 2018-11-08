const { init: initFeatures } = require( './features' );
const { init: initEnvironment } = require( './environment' );
const { execute } = require( './workflow' );
const EventEmitter = require( 'events' );
const Printer = require( './printer' );
const getStackFrameDir = require( './utils/stack/get_stack_frame_dir' );

module.exports = {
  async run( params ) {
    try {
      const relativeDir = getStackFrameDir( 3 );
      const emitter = new EventEmitter();
      const fwFeatures = await initFeatures( emitter );
      const fwEnv = initEnvironment( params, fwFeatures, relativeDir );

      Printer.startup( fwEnv );

      Printer.listenUpdates( emitter, fwEnv );

      const result = await execute( emitter, fwEnv );

      Printer.result( result );

      process.exit( result.ok ? 0 : 1 );
    } catch ( err ) {
      console.error( err );
      process.exit( 1 );
    }
  }
};
