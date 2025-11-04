import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Combobox, ComboboxOption } from './ui/combobox';

import { getMicrocodeDescription } from '../lib/engine';



type MicrocodeEditDialogProps = {
  open: boolean;
  rowIndex: number | null;
  onClose: () => void;
  onSave: (rowIndex: number, instruction: string) => void;
};

export function MicrocodeEditDialog({
  open,
  rowIndex,
  onClose,
  onSave,
}: MicrocodeEditDialogProps) {
  // Get current microcode from store
  const currentMicrocode = useStore(state => state.microcode);
  const rawMicrocode = useStore(state => state.rawMicrocode);
  const flattenedMicrocode = useStore(state => state.cpuState.microCode);
  
  // Get selected instruction from store
  const selectedInstruction = useStore(state => state.selectedInstruction);
  
  // Get store actions
  const setSelectedInstruction = useStore(state => state.setSelectedInstruction);
  const clearSelectedInstruction = useStore(state => state.clearSelectedInstruction);
  
  // Generate microcode operations dynamically from the current microcode
  const microcodeOperations = React.useMemo(() => {
    const operations: ComboboxOption[] = [];
    
    // Get all unique operation numbers from the current microcode
    const uniqueOperations = new Set<number>();
    flattenedMicrocode.forEach(value => {
      if (value !== undefined && value !== null && value !== 0) {
        uniqueOperations.add(value);
      }
    });
    
    // Convert to sorted array and create options
    const sortedOperations = Array.from(uniqueOperations).sort((a, b) => a - b);
    
    sortedOperations.forEach((opNumber: number) => {
      const description = getMicrocodeDescription(opNumber);
      operations.push({
        value: opNumber.toString(),
        label: `${opNumber.toString().padStart(2, '0')}: ${description}`
      });
    });
    
    // Sort by the numeric prefix for proper live search ordering
    const finalOperations = operations.sort((a, b) => {
      const aNum = parseInt(a.label.split(':')[0]);
      const bNum = parseInt(b.label.split(':')[0]);
      return aNum - bNum;
    });
    
    return finalOperations;
  }, [flattenedMicrocode]);

  // Reset form when dialog opens/closes or row changes
  useEffect(() => {
    if (open && rowIndex !== null && currentMicrocode[rowIndex]) {
      // Extract the numeric instruction value from the description or use current value
      // The microcode instructions are stored as numbers in the flattened array
      const currentValue = flattenedMicrocode[rowIndex]?.toString() || '';
      setSelectedInstruction(currentValue);
    } else {
      clearSelectedInstruction();
    }
  }, [open, rowIndex, currentMicrocode, flattenedMicrocode, setSelectedInstruction, clearSelectedInstruction]);

  // Auto-focus moved into Combobox via autoFocus prop

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSave = () => {
    if (rowIndex !== null) {
      onSave(rowIndex, selectedInstruction);
    }
  };

  // Handle instruction selection with immediate save
  const handleInstructionChange = (newInstruction: string) => {
    // Update store for UI display
    setSelectedInstruction(newInstruction);
    
    // If this is a valid instruction, save immediately
    if (newInstruction && rowIndex !== null) {
      onSave(rowIndex, newInstruction);
    }
  };

  if (!open || rowIndex === null) return null;

  const currentRow = currentMicrocode[rowIndex];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-[9999]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Card className="bg-slate-800 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Edit Microcode Row {rowIndex.toString().padStart(3, '0')}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Current row info */}
          <div className="text-sm text-slate-300">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <span className="text-slate-400">Macro:</span>
              <span className="col-span-2 font-mono">
                {(() => {
                  const macroIndex = Math.floor(rowIndex / 10);
                  return rawMicrocode.operations[macroIndex] || '(unknown)';
                })()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Description:</span>
              <span className="col-span-2 text-xs">{currentRow.description}</span>
            </div>
          </div>

          {/* Instruction selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Microcode Instruction
            </label>
            <Combobox
              options={microcodeOperations}
              value={selectedInstruction}
              onValueChange={handleInstructionChange}
              placeholder="Select microcode instruction..."
              className="w-full"
              autoFocus
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={!selectedInstruction}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}
