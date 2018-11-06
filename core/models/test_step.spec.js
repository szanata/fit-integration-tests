const Hook = require( './test_hook' );
const Step = require( './test_step' );
const TestBitResult = require( './test_bit_result' );
const { DirectHooks } = require( './types' );

describe( 'Test Step Spec', () => {
  it( 'Should create a step with hash, name and fn', () => {
    const hash = '33434';
    const name = 'Foo';
    const fn = () => 'bar';

    const step = Step.init( hash, name, fn );
    expect( step.hash ).toBe( hash );
    expect( step.name ).toBe( name );
    expect( step.fn ).toBe( fn );

  } );

  describe( '.ok', () => {

    it( 'Should return ok when there is no hooks', () => {
      const step = Step.init();
      expect( step.ok ).toBe( true );
    } );

    it( 'Should return ok when the test result is ok', () => {
      const step = Step.init();
      const result = TestBitResult.init();
      step.result = result;
      expect( step.ok ).toBe( true );
    } );

    it( 'Should return ok when the hooks are ok', () => {
      const step = Step.init();
      const hook = Hook.init( DirectHooks.afterEach, () => {} );
      const result = TestBitResult.init();
      hook.result = result;
      step.hooks.push( hook );
      expect( step.ok ).toBe( true );
    } );

    it( 'Should return NOT ok when some hooks is not ok', () => {
      const step = Step.init();
      const hook = Hook.init( DirectHooks.afterEach, () => {} );
      const result = TestBitResult.init();
      result.err = new Error();
      hook.result = result;
      step.hooks.push( hook );
      expect( step.ok ).toBe( false );
    } );
  } );
} );