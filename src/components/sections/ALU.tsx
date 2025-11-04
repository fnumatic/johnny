import { useStore } from '../../store/useStore';

export function ALU() {
  // Selective store subscriptions - only subscribe to what we actually need
  const accumulatorValue = useStore(state => state.cpuState.acc);
  
  // Actions
  const incrementAccumulator = useStore(state => state.incrementAccumulator);
  const decrementAccumulator = useStore(state => state.decrementAccumulator);
  const resetAccumulator = useStore(state => state.resetAccumulator);
  const transferToAccumulator = useStore(state => state.transferToAccumulator);
  const transferFromAccumulator = useStore(state => state.transferFromAccumulator);
  const addToAccumulator = useStore(state => state.addToAccumulator);
  const subtractFromAccumulator = useStore(state => state.subtractFromAccumulator);

  return (
    <section aria-label="Arithmetic Logic Unit" className="bg-slate-800 p-4 rounded-lg h-full">
      <h2 className="text-xl mb-4">ARITHMETIC LOGIC UNIT</h2>
      
      {/* ALU Controls */}
      <section aria-label="Accumulator Controls" className="flex flex-col gap-2 mb-4 w-24 mx-auto">
        <button 
          onClick={incrementAccumulator} 
          className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-colors text-sm w-full"
          aria-label="Increment accumulator by 1"
        >
          acc++
        </button>
        <button 
          onClick={decrementAccumulator} 
          className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-colors text-sm w-full"
          aria-label="Decrement accumulator by 1"
        >
          acc--
        </button>
        <button 
          onClick={resetAccumulator} 
          className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-colors text-sm w-full"
          aria-label="Reset accumulator to zero"
        >
          acc=0
        </button>
      </section>

      {/* Accumulator Display */}
      <section aria-label="Accumulator Display" className="mt-8 flex flex-col justify-center gap-2 w-fit mx-auto">
        {/* Zero Flag */}
        <div 
          className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-500 text-sm my-auto"
          role="status"
          aria-label={`Zero flag: ${accumulatorValue === 0 ? 'accumulator is zero' : 'accumulator is not zero'}`}
        >
          =0?
        </div>
        <div 
          className="bg-slate-900 p-16 rounded-lg border border-slate-700 w-24 h-24 flex items-center justify-center"
          role="status"
          aria-label={`Accumulator value: ${accumulatorValue}`}
          data-testid="accumulator"
        >
          <div className="font-mono text-2xl text-center" data-testid="accumulator-value">
            {accumulatorValue.toString().padStart(5, '0')}
          </div>
        </div>
      </section>

      {/* Data Transfer Controls */}
      <section aria-label="Data Transfer and Arithmetic Operations" className="mt-8 grid grid-cols-2 gap-2 mx-auto w-fit">
        <div className="flex justify-center" aria-hidden="true">
          <span className="text-green-500 text-3xl">⬆</span>
        </div>
        <div className="flex justify-center" aria-hidden="true">
          <span className="text-green-500 text-3xl">⬇</span>
        </div>

        <button 
          onClick={transferToAccumulator} 
          className="bg-green-600/20 p-2 rounded hover:bg-green-600/30 transition-colors flex items-center justify-center gap-2 w-24"
          aria-label="Transfer data from data bus to accumulator"
        >
          <span className="text-sm">db🡒acc</span>
        </button>
        <button 
          onClick={transferFromAccumulator} 
          className="bg-green-600/20 p-2 rounded hover:bg-green-600/30 transition-colors flex items-center justify-center gap-2 w-24"
          aria-label="Transfer data from accumulator to data bus"
        >
          <span className="text-sm">acc🡒db</span>
        </button>

        <button 
          onClick={addToAccumulator} 
          className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-colors text-sm w-full"
          aria-label="Add data bus value to accumulator"
        >
          plus
        </button>
        <button 
          onClick={subtractFromAccumulator} 
          className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-colors text-sm w-full col-start-1"
          aria-label="Subtract data bus value from accumulator"
        >
          minus
        </button>
      </section>


    </section>
  );
}; 