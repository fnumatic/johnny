import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useStore } from '../store/useStore';
import { 
  FilePlus, 
  FolderOpen, 
  Save, 
  Play, 
  Pause, 
  StepForward, 
  StopCircle, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  RotateCcw,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import { DevToolbar } from './DevMode/DevToolbar';

export function Toolbar() {
  // Selective store subscriptions - only subscribe to what we actually need
  const isRunning = useStore(state => state.isRunning);
  const executionSpeed = useStore(state => state.executionSpeed);
  const isControlUnit = useStore(state => state.isControlUnit);
  
  // Actions
  const setExecutionSpeed = useStore(state => state.setExecutionSpeed);
  const toggleControlUnit = useStore(state => state.toggleControlUnit);
  const stepForward = useStore(state => state.stepForward);
  const stepMicrocode = useStore(state => state.stepMicrocode);
  const resetProgramCounter = useStore(state => state.resetProgramCounter);

  const loadProgramFromString = useStore(state => state.loadProgramFromString);
  const runUntilHalt = useStore(state => state.runUntilHalt);
  const stopAutoRun = useStore(state => state.stopAutoRun);

  const [showProgramInput, setShowProgramInput] = useState(false);
  const [programText, setProgramText] = useState('');

  const handleSpeedChange = (value: number[]) => {
    setExecutionSpeed(value[0]);
  };

  const handleLoadProgram = () => {
    if (programText.trim()) {
      loadProgramFromString(programText);
      setShowProgramInput(false);
      setProgramText('');
    }
  };

  return (
    <nav  className="bg-slate-800 p-4 flex items-center gap-4 border-b border-slate-700" data-testid="toolbar">
      <section aria-label="File Controls" className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="New File">
          <FilePlus className="size-6" />
        </Button>
        <Button variant="ghost" size="icon" title="Open File">
          <FolderOpen className="size-6" />
        </Button>
        <Button variant="ghost" size="icon" title="Save File">
          <Save className="size-6" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          title="Load Custom Program" 
          onClick={() => setShowProgramInput(!showProgramInput)}
          data-testid="load-program-button"
        >
          <Upload className="size-6" />
        </Button>
      </section>

      <Separator orientation="vertical" className="h-6 bg-white/20" />

      {/* Cpu Controls */}
      <section aria-label="Cpu Controls" className="flex items-center gap-2">
        <Button 
          variant="default"
          size="icon"
          onClick={runUntilHalt}
          title="Run Until End"
          data-testid="start-button"
          disabled={isRunning}
        >
          <Play className="size-6" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          title="Stop" 
          onClick={stopAutoRun}
          data-testid="stop-button"
          disabled={!isRunning}
        >
          <StopCircle className="size-6" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          title="Step Forward" 
          onClick={stepForward}
          data-testid="step-button"
        >
          <StepForward className="size-6" />
        </Button>
        <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded">
          <span className="text-sm text-gray-300">Speed</span>
          <Slider 
            min={1}
            max={10}
            value={[executionSpeed]}
            onValueChange={handleSpeedChange}
            className="w-32"
            data-testid="speed-slider"
          />
          <span className="text-sm text-gray-300" data-testid="speed-display">{executionSpeed}x</span>
        </div>
        <Button 
          variant="destructive" 
          size="icon" 
          title="Reset" 
          onClick={() => {
            stopAutoRun();
            resetProgramCounter();
          }}
          data-testid="reset-button"
        >
          <RotateCcw className="size-6" />
        </Button>
      </section>

      {/* Control Unit */}
      <section aria-label="Control Unit" className="flex items-center gap-2">
        <Button 
          variant="ghost"
          size="icon"
          onClick={toggleControlUnit}
          title={isControlUnit ? 'Hide Control Unit' : 'Show Control Unit'}
        >
          {isControlUnit ? <ChevronDown className="size-6" /> : <ChevronUp className="size-6" />}
        </Button>
        {isControlUnit && (
          <Button 
            variant="ghost" 
            size="icon" 
            title="Microcode Step" 
            onClick={stepMicrocode}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
          >
            <StepForward className="size-6" />
          </Button>
        )}
      </section>
      
      <section aria-label="Dev Toolbar" className="ml-auto flex items-center gap-2">
        <DevToolbar />
        <Button variant="ghost" size="icon" title="Settings">
          <Settings className="size-6" />
        </Button>
      </section>

      {/* Program Input Modal */}
      {showProgramInput && (
        <section aria-label="Program Input Modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96 max-h-96">
            <h3 className="text-lg font-semibold mb-4">Load Custom Program</h3>
            <p className="text-sm text-gray-300 mb-4">
              Enter program in multiline format. Each line should be a number (e.g., 1005 for opcode 1, data 5).
            </p>
            <textarea
              value={programText}
              onChange={(e) => setProgramText(e.target.value)}
              placeholder={`Example:
1005
2006
3007
10000
23
3
10`}
              className="w-full h-48 p-3 bg-slate-700 text-white border border-slate-600 rounded-md resize-none"
              data-testid="program-input"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleLoadProgram} disabled={!programText.trim()} data-testid="save-program-button">
                Load Program
              </Button>
              <Button variant="outline" onClick={() => setShowProgramInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </section>
      )}
    </nav>
  );
}; 