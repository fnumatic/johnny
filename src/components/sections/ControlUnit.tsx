import { useStore } from '../../store/useStore';
import { Card } from '../../components/ui/card';
import { Microcode } from '../Microcode';

// Button component for control operations
type ControlButtonProps = {
  label: string;
  color: string;
  onClick: () => void;
};

function ControlButton({ label, color, onClick }: ControlButtonProps) {
  return (
    <button 
      className={`${color} px-2 py-1 rounded w-16 hover:opacity-80 transition-colors text-xs`}
      onClick={onClick}
      aria-label={`Control operation: ${label}`}
    >
      {label}
    </button>
  );
}

// Instruction Register Card Component
function InstructionRegisterCard() {
  const instructionRegister = useStore(state => state.cpuState.ir);
  const setAddressBus = useStore(state => state.setAddressBus);
  
  // Extract opcode and data from instruction register
  const opcode = Math.floor(instructionRegister / 1000);
  const data = instructionRegister % 1000;

  const handleDataBusToInstruction = () => {
    const dataBusValue = useStore.getState().cpuState.db;
    useStore.setState((state) => ({
      cpuState: { ...state.cpuState, ir: dataBusValue }
    }));
  };

  const handleInstructionToProgramCounter = () => {
    useStore.setState((state) => ({
      cpuState: { ...state.cpuState, pc: data }
    }));
  };



  const handleInstructionToMicrocode = () => {
    const newMcCounter = opcode * 10;
    useStore.setState((state) => ({
      cpuState: { ...state.cpuState, mcCounter: newMcCounter }
    }));
  };

  return (
    <Card className="flex flex-col bg-slate-800/50 border-slate-700 p-4 gap-3" role="region" aria-label="Instruction Register" data-testid="instruction-register">
      <h2 className="text-xs font-semibold truncate text-slate-200">Instruction Register</h2>
      <div className="space-y-2 text-xs">
        <div className="flex items-center bg-slate-700/50 p-2 rounded" role="status" aria-label={`Current instruction: opcode ${opcode}, data ${data}`}>
          <span className="text-slate-300 xl:block hidden flex-1 min-w-0 mr-2 truncate">Instruction:</span>
          <div className="font-mono font-semibold text-sm bg-slate-600 px-2 py-1 rounded flex-none" data-testid="instruction-register-value">
            <span className="text-red-400">{opcode.toString().padStart(2, '0')}</span>
            <span className="text-slate-400">.</span>
            <span className="text-blue-400">{data.toString().padStart(3, '0')}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs w-full self-end mt-auto">
        <ControlButton
          label="db🡒ins"
          color="bg-green-500/20 text-green-300"
          onClick={handleDataBusToInstruction}
        />
        <ControlButton
          label="ins🡒pc"
          color="bg-orange-500/20 text-orange-300"
          onClick={handleInstructionToProgramCounter}
        />
        <ControlButton
          label="ins🡒ab"
          color="bg-purple-500/20 text-purple-300"
          onClick={() => setAddressBus(data.toString())}
        />
        <ControlButton
          label="ins🡒mc"
          color="bg-blue-500/20 text-blue-300"
          onClick={handleInstructionToMicrocode}
        />
      </div>
    </Card>
  );
};

// Program Counter Card Component
function ProgramCounterCard() {
  const programCounter = useStore(state => state.cpuState.pc);
  const incrementProgramCounter = useStore(state => state.incrementProgramCounter);
  const setAddressBus = useStore(state => state.setAddressBus);



  return (
    <Card className="flex flex-col justify-start bg-slate-800/50 border-slate-700 p-4 gap-3" role="region" aria-label="Program Counter" data-testid="program-counter">
      <h2 className="text-xs font-semibold truncate text-slate-200">Program Counter</h2>
      <div className="space-y-2 text-xs w-full">
        <div className="flex items-center bg-slate-700/50 p-2 rounded" role="status" aria-label={`Program counter value: ${programCounter}`}>
          <span className="text-slate-300 xl:block hidden flex-1 min-w-0 mr-2 truncate">Value:</span>
          <span className="font-mono bg-slate-600 text-sm font-semibold px-2 py-1 rounded flex-none" data-testid="program-counter-value">
            {programCounter.toString().padStart(5, '0')}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs w-full self-end mt-auto">
        <ControlButton
          label="pc🡒ab"
          color="bg-purple-500/20 text-purple-300"
          onClick={() => setAddressBus(programCounter.toString())}
        />
        <ControlButton
          label="pc++"
          color="bg-blue-500/20 text-blue-300"
          onClick={incrementProgramCounter}
        />
      </div>
    </Card>
  );
};

export function ControlUnit() {
  const isControlUnit = useStore(state => state.isControlUnit);

  if (!isControlUnit) return null;

  return (
    <section aria-label="Control Unit" className="bg-slate-800 p-4 rounded-lg h-full flex flex-col" data-testid="control-unit">
      <h2 className="text-xl mb-4">CONTROL UNIT</h2>
      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4">
          <InstructionRegisterCard />
          <ProgramCounterCard />
        </div>
        <Microcode />
      </div>
    </section>
  );
} 