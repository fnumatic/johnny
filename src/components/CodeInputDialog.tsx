import React, { useState, useEffect, useRef } from 'react';
import { CodeInput } from './CodeInput';
import { generateOpcodeMapping } from '../lib/engine';

type CodeInputDialogProps = {
  open: boolean;
  rowIndex: number | null;
  initialOpData: string;
  initialOperation: string;
  operations: string[];
  onClose: () => void;
  onSave: (rowIndex: number, opData: string) => void;
  onSaveAndNext: (rowIndex: number, opData: string) => void;
};

export function CodeInputDialog({
  open,
  rowIndex,
  initialOpData,
  initialOperation,
  operations,
  onClose,
  onSave,
  onSaveAndNext,
}: CodeInputDialogProps) {
  const [opData, setOpData] = useState(initialOpData);
  const [operation, setOperation] = useState(initialOperation);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate opcode mapping from operations, prefix FETCH to align indices
  const opcodeMapping = generateOpcodeMapping(['FETCH', ...operations]);

  useEffect(() => {
    setOpData(initialOpData);
    setOperation(initialOperation);
  }, [initialOpData, initialOperation, rowIndex]);

  // Auto-focus when modal opens
  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.focus();
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'Enter' && rowIndex !== null && e.ctrlKey) {
      e.preventDefault();
      onSaveAndNext(rowIndex, opData);
      return;
    }
    if (e.key === 'Enter' && rowIndex !== null) {
      e.preventDefault();
      onSave(rowIndex, opData);
    }
  };

  if (!open || rowIndex === null) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={containerRef}
    >
      <div className="bg-slate-800 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Edit Memory Row {rowIndex}
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
        
        <CodeInput
          initialOpData={opData}
          initialOperation={operation}
          operations={operations}
          opcodeMapping={opcodeMapping}
          onCodeChange={(newOpData, newOperation) => {
            setOpData(newOpData);
            setOperation(newOperation);
          }}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (rowIndex !== null) {
                onSave(rowIndex, opData);
              }
            }}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors duration-200 font-medium"
          >
            Save
          </button>
          <button
            onClick={() => {
              if (rowIndex !== null) {
                onSaveAndNext(rowIndex, opData);
              }
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors duration-200 font-medium"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
}; 