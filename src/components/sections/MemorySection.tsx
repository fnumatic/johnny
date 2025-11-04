import { useState, useMemo, useCallback, memo } from 'react';
import { useStore } from '../../store/useStore';
import { CodeInputDialog } from '../CodeInputDialog';
import { getCurrentMicrocode, generateOpcodeMapping } from '../../lib/engine';

// Memoized row component to prevent unnecessary re-renders
const MemoryRow = memo<{
  index: number;
  value: number;
  isSelected: boolean;
  isProgramCounter: boolean;
  onRowClick: (index: number) => void;
  onRowDoubleClick: (index: number, formattedData: string, parsedOperation: string) => void;
  formatNumberToOpData: (num: number) => string;
  parseDataToAsm: (data: string) => string;
  parseDataToOpnd: (data: string) => string;
  parseOpDataToOperation: (opData: string) => string;
}>(({ 
  index, 
  value, 
  isSelected, 
  isProgramCounter, 
  onRowClick, 
  onRowDoubleClick,
  formatNumberToOpData,
  parseDataToAsm,
  parseDataToOpnd,
  parseOpDataToOperation
}) => {
  const formattedData = formatNumberToOpData(value);
  
  return (
    <tr 
      className={`hover:bg-slate-700 cursor-pointer ${
        isSelected ? 'bg-slate-600' : ''
      } ${
        isProgramCounter ? 'bg-yellow-500/20' : ''
      }`}
      onClick={() => onRowClick(index)}
      onDoubleClick={() => {
        const parsedOperation = parseOpDataToOperation(formattedData);
        onRowDoubleClick(index, formattedData, parsedOperation);
      }}
      role="button"
      tabIndex={0}
      data-testid={`memory-cell-${index}`}
      aria-label={`Memory address ${index}, data: ${formattedData}, ${isProgramCounter ? 'program counter location' : ''}, ${isSelected ? 'selected' : 'not selected'}. Double-click to edit.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick(index);
        }
      }}
    >
      <td>{index}</td>
      <td>{formattedData}</td>
      <td>{parseDataToAsm(formattedData)}</td>
      <td>{parseDataToOpnd(formattedData)}</td>
    </tr>
  );
});

MemoryRow.displayName = 'MemoryRow';

export const MemorySection = memo(function MemorySection() {
  // Selective store subscriptions - only subscribe to what we actually need
  const ram = useStore(state => state.cpuState.ram);
  const pc = useStore(state => state.cpuState.pc);
  const selectedMemoryRow = useStore(state => state.selectedMemoryRow);
  const currentMode = useStore(state => state.currentMode);
  const availableModes = useStore(state => state.availableModes);
  
  // Actions
  const setSelectedMemoryRow = useStore(state => state.setSelectedMemoryRow);
  const updateRamRow = useStore(state => state.updateRamRow);

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [currentOpData, setCurrentOpData] = useState('');
  const [currentOperation, setCurrentOperation] = useState('');

  // Memoize expensive calculations
  const currentMicrocode = useMemo(() => 
    getCurrentMicrocode(currentMode, availableModes), 
    [currentMode, availableModes]
  );
  
  const operations = useMemo(() => 
    currentMicrocode.operations.filter(op => op !== 'FETCH'), 
    [currentMicrocode.operations]
  );
  
  const opcodeMapping = useMemo(() => 
    generateOpcodeMapping(currentMicrocode.operations), 
    [currentMicrocode.operations]
  );

  // Memoize helper functions
  const formatNumberToOpData = useCallback((num: number): string => {
    const op = Math.floor(num / 1000);
    const data = num % 1000;
    return `${op.toString().padStart(2, '0')}.${data.toString().padStart(3, '0')}`;
  }, []);

  const parseOpDataToNumber = useCallback((opData: string): number => {
    const parts = opData.split('.');
    if (parts.length === 2) {
      const op = parseInt(parts[0]) || 0;
      const data = parseInt(parts[1]) || 0;
      return op * 1000 + data;
    }
    return 0;
  }, []);

  const extractOperationCode = useCallback((opData: string) => {
    const parts = opData.split('.');
    if (parts.length === 2) {
      const opPart = parts[0].trim();
      return opPart.padStart(2, '0');
    }
    return '';
  }, []);

  const parseOpDataToOperation = useCallback((opData: string) => {
    const operation = extractOperationCode(opData);
    if (operation) {
      const operationName = opcodeMapping[operation] || 'UNKNOWN';
      return `${operation}: ${operationName}`;
    }
    return '01: TAKE'; // Default fallback
  }, [opcodeMapping, extractOperationCode]);

  const parseDataToAsm = useCallback((data: string) => {
    if (!data || data === '00.000') return '';
    
    const operation = extractOperationCode(data);
    const operationName = opcodeMapping[operation] || '';
    // Don't show 'FETCH' in the UI
    return operationName === 'FETCH' ? '' : operationName;
  }, [opcodeMapping, extractOperationCode]);

  const parseDataToOpnd = useCallback((data: string) => {
    if (!data || data === '00.000') return '';
    
    const parts = data.split('.');
    if (parts.length === 2) {
      const dataPart = parts[1].trim();
      return dataPart.padEnd(3, '0');
    }
    return '';
  }, []);

  // Memoize event handlers
  const handleRowClick = useCallback((index: number) => {
    setSelectedMemoryRow(index);
  }, [setSelectedMemoryRow]);

  const handleRowDoubleClick = useCallback((index: number, formattedData: string, parsedOperation: string) => {
    setEditingRow(index);
    setSelectedMemoryRow(index);
    setCurrentOpData(formattedData);
    setCurrentOperation(parsedOperation);
    setShowCodeInput(true);
  }, [setSelectedMemoryRow]);

  const handleCloseCodeInput = useCallback(() => {
    setShowCodeInput(false);
    setEditingRow(null);
  }, []);

  const handleSave = useCallback((rowIndex: number, opData: string) => {
    const numberValue = parseOpDataToNumber(opData);
    updateRamRow(rowIndex, numberValue);
    setShowCodeInput(false);
    setEditingRow(null);
  }, [parseOpDataToNumber, updateRamRow]);

  const handleSaveAndNext = useCallback((rowIndex: number, opData: string) => {
    const numberValue = parseOpDataToNumber(opData);
    updateRamRow(rowIndex, numberValue);
    const nextRow = rowIndex + 1;
    if (nextRow < ram.length) {
      setEditingRow(nextRow);
      setSelectedMemoryRow(nextRow);
      const nextFormattedData = formatNumberToOpData(ram[nextRow]);
      setCurrentOpData(nextFormattedData);
      const parsedOperation = parseOpDataToOperation(nextFormattedData);
      setCurrentOperation(parsedOperation);
    } else {
      setShowCodeInput(false);
      setEditingRow(null);
    }
  }, [parseOpDataToNumber, updateRamRow, ram.length, setSelectedMemoryRow, formatNumberToOpData, parseOpDataToOperation]);

  return (
    <>
      <section aria-label="Memory Section" className="bg-slate-800 p-4 rounded-lg" data-testid="memory-section">
        <h2 className="text-xl mb-4">MEMORY</h2>
        
        {/* Memory Table Section */}
        <section aria-label="Memory Table" className="overflow-y-auto max-h-[500px]">
          <table className="w-full" role="table" aria-label="Memory addresses and data" data-testid="memory-grid">
            <thead>
              <tr className="text-left">
                <th>Address</th>
                <th>Data</th>
                <th>Asm</th>
                <th>Opnd</th>
              </tr>
            </thead>
            <tbody>
              {ram.map((value, index) => (
                <MemoryRow
                  key={index}
                  index={index}
                  value={value}
                  isSelected={selectedMemoryRow === index}
                  isProgramCounter={pc === index}
                  onRowClick={handleRowClick}
                  onRowDoubleClick={handleRowDoubleClick}
                  formatNumberToOpData={formatNumberToOpData}
                  parseDataToAsm={parseDataToAsm}
                  parseDataToOpnd={parseDataToOpnd}
                  parseOpDataToOperation={parseOpDataToOperation}
                />
              ))}
            </tbody>
          </table>
        </section>

        {/* Data Transfer Controls */}
        <section aria-label="Memory Data Transfer Controls" className="mt-8 grid grid-cols-2 gap-2 mx-auto w-fit">
          <div className="flex justify-center">
            <span className="text-green-500 text-3xl">⬆</span>
          </div>
          <div className="flex justify-center">
            <span className="text-green-500 text-3xl">⬇</span>
          </div>

          <button 
            className="bg-green-600/20  p-2 rounded hover:bg-green-600/30 transition-colors flex items-center justify-center gap-2 w-24"
          >
            <span className="text-sm">db🡒ram</span>
          </button>
          <button 
            className="bg-green-600/20 p-2 rounded hover:bg-green-600/30 transition-colors flex items-center justify-center gap-2 w-24"
          >
            <span className="text-sm">ram🡒db</span>
          </button>
        </section>
      </section>

      <CodeInputDialog
        open={showCodeInput}
        rowIndex={editingRow}
        initialOpData={currentOpData}
        initialOperation={currentOperation}
        operations={operations}
        onClose={handleCloseCodeInput}
        onSave={handleSave}
        onSaveAndNext={handleSaveAndNext}
      />
    </>
  );
});

MemorySection.displayName = 'MemorySection'; 