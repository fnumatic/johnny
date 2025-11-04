
import { MemorySection } from './sections/MemorySection'
import { ControlUnit } from './sections/ControlUnit'
import { ALU } from './sections/ALU'
import { Toolbar } from '@/components/Toolbar'
import { AddressBus } from './AddressBus'
import { DataBus } from './DataBus'
import { Maschinenraum } from './DevMode/Maschinenraum'
import { ProgramEditorModal } from './ProgramEditorModal'
import { useProgramHandlers } from '../hooks/useProgramHandlers'
import { useStore } from '../store/useStore'
import { useEffect } from 'react'

interface MainInterfaceProps {
  'data-testid'?: string;
}

export function MainInterface({ 'data-testid': testId }: MainInterfaceProps) {
  const { showEditor, programText, handleTextChange, handleLoadProgram, handleCancelEditor } = useProgramHandlers();
  const toggleDevMode = useStore(state => state.toggleDevMode);

  // Keyboard shortcut to enable/disable dev mode: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDevMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDevMode]);

  return (
    <div className="min-h-screen bg-slate-700 text-white" data-testid={testId}>
      <Toolbar />
      <main className="flex flex-col gap-4 m-4">
        {/* Address Bus */}
        <AddressBus />

        <div className="grid grid-cols-12 gap-4 ">
          {/* Memory Section */}
          <div className="col-span-4">
            <MemorySection />
          </div>

          {/* Control Unit */}
          <div className="col-span-4">
            <ControlUnit />
          </div>

          {/* ALU Section */}
          <div className="col-span-4">
            <ALU />
          </div>
        </div>

        {/* Data Bus */}
        <DataBus />
        </main>
      
      {/* Dev Mode Maschinenraum Panel */}
      <Maschinenraum />
      
      {/* Program Editor Modal */}
      <ProgramEditorModal 
        show={showEditor}
        programText={programText}
        onTextChange={handleTextChange}
        onLoad={handleLoadProgram}
        onCancel={handleCancelEditor}
      />
    </div>
  )
} 