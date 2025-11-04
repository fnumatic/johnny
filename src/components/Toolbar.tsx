import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useStore } from '../store/useStore';
import { 
  FilePlus, 
  FolderOpen, 
  Save, 
  Play, 
  StepForward, 
  StopCircle, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  RotateCcw,
  FileText,
  Upload
} from 'lucide-react';
import { DevToolbar } from './DevMode/DevToolbar';
import { useProgramHandlers } from '../hooks/useProgramHandlers';

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


  const { handlePasteProgram, handleLoadFile } = useProgramHandlers();
  const runUntilHalt = useStore(state => state.runUntilHalt);
  const stopAutoRun = useStore(state => state.stopAutoRun);



  const handleSpeedChange = (value: number[]) => {
    setExecutionSpeed(value[0]);
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
          title="Paste Program"
          onClick={handlePasteProgram}
          data-testid="paste-program-button"
        >
          <FileText className="size-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Load File"
          onClick={handleLoadFile}
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
    </nav>
  );
}; 