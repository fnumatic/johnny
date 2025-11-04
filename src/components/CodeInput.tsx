import { useState, useEffect, useRef } from 'react';
import { parseInputResult, checkValidFormat } from '../lib/parsingUtil';

interface CodeInputProps {
  onCodeChange?: (opData: string, operation: string) => void;
  initialOpData?: string;
  initialOperation?: string;
  operations: string[];
  opcodeMapping: Record<string, string>;
}

export function CodeInput({
  onCodeChange,
  initialOpData = '01.000',
  initialOperation = '01: TAKE',
  operations,
  opcodeMapping
}: CodeInputProps) {
  const [opData, setOpData] = useState(initialOpData);
  const [selectedOperation, setSelectedOperation] = useState(initialOperation);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format operations for display with index
  const formattedOperations = operations && operations.length > 0 
    ? operations.map((op, index) => ({
        value: op,
        label: `${(index + 1).toString().padStart(2, '0')}: ${op}`
      }))
    : [];

  const handleOpDataChange = (value: string) => {
    // Validate input format
    if (value === '') {
      setOpData(value);
      onCodeChange?.(value, selectedOperation);
      return;
    }

    
    if (checkValidFormat(value) || value === '') {
      setOpData(value);
      
      // Auto-update selected operation based on parsed result
      const parsed = parseInputResult(value, opcodeMapping, true);
      if (parsed.isValid && parsed.operationName !== 'UNKNOWN') {
        const newOperation = `${parsed.operation}: ${parsed.operationName}`;
        setSelectedOperation(newOperation);
        onCodeChange?.(value, newOperation);
      } else {
        onCodeChange?.(value, selectedOperation);
      }
    }
  };

  const parsedResult = parseInputResult(opData, opcodeMapping, true);

  const handleOperationChange = (operation: string) => {
    setSelectedOperation(operation);
    
    // Extract operation number from selected operation and update first field
    const operationMatch = operation.match(/^(\d+):\s*(.+)$/);
    if (operationMatch) {
      const opNumber = operationMatch[1];
      const currentData = opData.split('.')[1] || '000';
      const newOpData = `${opNumber}.${currentData}`;
      setOpData(newOpData);
      onCodeChange?.(newOpData, operation);
    } else {
      onCodeChange?.(opData, operation);
    }
  };

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update state when props change
  useEffect(() => {
    if (opData !== initialOpData || selectedOperation !== initialOperation) {
      setOpData(initialOpData);
      setSelectedOperation(initialOperation);
    }
  }, [initialOpData, initialOperation, opData, selectedOperation]);

  return (
    <div className="space-y-4">
      {/* Op+Data Field */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Op+Data
        </label>
        <input
          ref={inputRef}
          type="text"
          value={opData}
          onChange={(e) => handleOpDataChange(e.target.value)}
          placeholder="Enter op+data freely"
          className="w-full px-3 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        
        {/* Real-time result display */}
        {opData && (
          <div className="mt-1 p-2 ">
            {parsedResult.isValid ? (
              <div className="text-sm text-slate-300 font-mono">
                {parsedResult.operation}.{parsedResult.data} 🡒 {parsedResult.operationName} {parsedResult.data}
              </div>
            ) : (
              <div className="text-sm text-red-300 font-mono">
                Invalid format
              </div>
            )}
          </div>
        )}
      </div>

      {/* Operation Selection Field */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Operation
        </label>
        <div className="relative">
          <select
            value={selectedOperation}
            onChange={(e) => handleOperationChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer"
          >
            {formattedOperations.map((op) => (
              <option key={op.value} value={op.label}>
                {op.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}