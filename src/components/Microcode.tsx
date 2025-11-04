import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from './ui/card';
import { RotateCcw, Save, Upload } from 'lucide-react';
import { MicrocodeEditDialog } from './MicrocodeEditDialog';

export function Microcode() {
  const microcodeContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  // Store subscriptions
  const microcode = useStore(state => state.microcode);
  const mcCounter = useStore(state => state.cpuState.mcCounter);
  
  // Actions
  const resetMicrocode = useStore(state => state.resetMicrocode);
  const saveMicrocodeToFile = useStore(state => state.saveMicrocodeToFile);
  const loadMicrocodeFromFile = useStore(state => state.loadMicrocodeFromFile);
  const updateMicrocodeRow = useStore(state => state.updateMicrocodeRow);

  // Auto-scroll to current microcode row
  useEffect(() => {
    if (microcodeContainerRef.current && mcCounter < microcode.length) {
      const container = microcodeContainerRef.current;
      const rowHeight = 24; // Approximate height of each row
      
      // Scroll to show current row and the previous one for context
      const scrollTop = Math.max(0, (mcCounter - 1) * rowHeight);
      
      // Smooth scroll to the position
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [mcCounter, microcode.length]);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadMicrocodeFromFile(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle double click on microcode row
  const handleRowDoubleClick = (index: number) => {
    setSelectedRowIndex(index);
    setEditDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedRowIndex(null);
  };

  // Handle dialog save
  const handleDialogSave = (rowIndex: number, instruction: string) => {
    updateMicrocodeRow(rowIndex, instruction);
    handleDialogClose();
  };

  return (
    <Card className="flex flex-col bg-slate-800/50 border-slate-700 p-4 col-span-2 gap-3" role="region" aria-label="Microcode">
      <h2 className="text-xs font-semibold text-slate-200">Microcode</h2>
      <div ref={microcodeContainerRef} className="font-mono text-xs bg-slate-900/50 p-4 rounded max-h-[200px] overflow-y-auto" role="log" aria-label="Microcode instructions" aria-live="polite">
        <div className="grid grid-cols-5 gap-2">
          {microcode.map((code, index) => (
            <React.Fragment key={index}>
              <span 
                className={`col-span-1 ${index === mcCounter ? 'bg-blue-600/50 text-white font-bold' : 'text-slate-500'} cursor-pointer hover:bg-slate-700/50 transition-colors`}
                onDoubleClick={() => handleRowDoubleClick(index)}
                title="Double-click to edit"
                role="button"
                tabIndex={0}
                aria-label={`Microcode row ${index}, ${index === mcCounter ? 'currently executing' : 'not executing'}. Double-click to edit.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowDoubleClick(index);
                  }
                }}
              >
                {index.toString().padStart(3, '0')}
              </span>
              <span 
                className={`col-span-1 ${index === mcCounter ? 'bg-blue-600/50 text-white font-bold' : 'text-slate-300'} cursor-pointer hover:bg-slate-700/50 transition-colors`}
                onDoubleClick={() => handleRowDoubleClick(index)}
                title="Double-click to edit"
                role="button"
                tabIndex={0}
                aria-label={`Instruction: ${code.instruction}, ${index === mcCounter ? 'currently executing' : 'not executing'}. Double-click to edit.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowDoubleClick(index);
                  }
                }}
              >
                {code.instruction}
              </span>
              <span 
                className={`col-span-3 ${index === mcCounter ? 'bg-blue-600/50 text-white font-bold' : 'text-slate-400'} cursor-pointer hover:bg-slate-700/50 transition-colors`}
                onDoubleClick={() => handleRowDoubleClick(index)}
                title="Double-click to edit"
                role="button"
                tabIndex={0}
                aria-label={`Description: ${code.description}, ${index === mcCounter ? 'currently executing' : 'not executing'}. Double-click to edit.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowDoubleClick(index);
                  }
                }}
              >
                {code.description}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Microcode Management Buttons */}
      <div className="flex gap-2 text-xs w-full">
        <button 
          onClick={resetMicrocode}
          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded w-16 hover:bg-blue-500/30 transition-colors"
          title="Reset Microcode Counter"
          aria-label="Reset microcode counter to zero"
        >
          mc:=0
        </button>
        <button className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded w-16" aria-label="Stop microcode execution">stop</button>
        
        {/* Microcode Management Icons */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={resetMicrocode}
            className="bg-red-500/20 text-red-300 p-1 rounded hover:bg-red-500/30 transition-colors"
            title="Reset Microcode"
            aria-label="Reset microcode to default state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={saveMicrocodeToFile}
            className="bg-green-500/20 text-green-300 p-1 rounded hover:bg-green-500/30 transition-colors"
            title="Save Microcode to File"
            aria-label="Save microcode to file"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500/20 text-blue-300 p-1 rounded hover:bg-blue-500/30 transition-colors"
            title="Load Microcode from File"
            aria-label="Load microcode from file"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Hidden file input for loading microcode */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mc,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Microcode Edit Dialog */}
      <MicrocodeEditDialog
        open={editDialogOpen}
        rowIndex={selectedRowIndex}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Card>
  );
}
