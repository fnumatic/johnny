import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from '../../../store/useStore';
import { CircleDot, Eye, Trash2, Plus, Target } from 'lucide-react';
import { useState } from 'react';

export function DebugToolsTab() {
  const breakpoints = useStore(state => state.breakpoints);
  const watchedAddresses = useStore(state => state.watchedAddresses);
  const executionTrace = useStore(state => state.executionTrace);
  const cpuState = useStore(state => state.cpuState);
  
  const addBreakpoint = useStore(state => state.addBreakpoint);
  const removeBreakpoint = useStore(state => state.removeBreakpoint);
  const addWatchAddress = useStore(state => state.addWatchAddress);
  const removeWatchAddress = useStore(state => state.removeWatchAddress);
  const clearExecutionTrace = useStore(state => state.clearExecutionTrace);

  const [newBreakpoint, setNewBreakpoint] = useState('');
  const [newWatchAddress, setNewWatchAddress] = useState('');

  const handleAddBreakpoint = () => {
    const address = parseInt(newBreakpoint);
    if (!isNaN(address) && address >= 0 && address < cpuState.ram.length) {
      addBreakpoint(address);
      setNewBreakpoint('');
    }
  };

  const handleAddWatchAddress = () => {
    const address = parseInt(newWatchAddress);
    if (!isNaN(address) && address >= 0 && address < cpuState.ram.length) {
      addWatchAddress(address);
      setNewWatchAddress('');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Breakpoints */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <CircleDot className="size-4" />
            Breakpoints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Address (0-999)"
              value={newBreakpoint}
              onChange={(e) => setNewBreakpoint(e.target.value)}
              className="flex-1 h-8 bg-slate-800 border-slate-600 text-white text-xs"
              min="0"
              max="999"
            />
            <Button
              onClick={handleAddBreakpoint}
              disabled={!newBreakpoint}
              size="sm"
              className="h-8 px-2"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Array.from(breakpoints).sort((a, b) => a - b).map((address) => (
              <div key={address} className="flex items-center justify-between bg-slate-800 p-2 rounded text-xs">
                <span className="text-white font-mono">
                  {address.toString().padStart(3, '0')}
                </span>
                <Button
                  onClick={() => removeBreakpoint(address)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
            {breakpoints.size === 0 && (
              <div className="text-gray-400 text-xs text-center py-2">
                No breakpoints set
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Memory Watches */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Eye className="size-4" />
            Memory Watches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Address (0-999)"
              value={newWatchAddress}
              onChange={(e) => setNewWatchAddress(e.target.value)}
              className="flex-1 h-8 bg-slate-800 border-slate-600 text-white text-xs"
              min="0"
              max="999"
            />
            <Button
              onClick={handleAddWatchAddress}
              disabled={!newWatchAddress}
              size="sm"
              className="h-8 px-2"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Array.from(watchedAddresses).sort((a, b) => a - b).map((address) => (
              <div key={address} className="flex items-center justify-between bg-slate-800 p-2 rounded text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    [{address.toString().padStart(3, '0')}]
                  </span>
                  <span className="text-blue-400 font-mono">
                    {cpuState.ram[address]?.toString().padStart(5, '0') || '00000'}
                  </span>
                </div>
                <Button
                  onClick={() => removeWatchAddress(address)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
            {watchedAddresses.size === 0 && (
              <div className="text-gray-400 text-xs text-center py-2">
                No memory watches set
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Register Dump */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Target className="size-4" />
            Register Dump
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Program Counter:</span>
              <span className="text-white">{cpuState.pc.toString().padStart(3, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Accumulator:</span>
              <span className="text-white">{cpuState.acc.toString().padStart(5, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Instruction Register:</span>
              <span className="text-white">{cpuState.ir.toString().padStart(5, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Address Bus:</span>
              <span className="text-blue-400">{cpuState.ab.toString().padStart(3, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Data Bus:</span>
              <span className="text-green-400">{cpuState.db.toString().padStart(5, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Microcode Counter:</span>
              <span className="text-white">{cpuState.mcCounter.toString().padStart(2, '0')}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Halted:</span>
              <span className={cpuState.halted ? "text-red-400" : "text-green-400"}>
                {cpuState.halted ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Trace */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-4" />
              Execution Trace
            </div>
            <Button
              onClick={clearExecutionTrace}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="size-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {executionTrace.slice(-20).reverse().map((entry, index) => (
              <div key={index} className="bg-slate-800 p-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-mono">
                    @{entry.address.toString().padStart(3, '0')}
                  </span>
                  <span className="text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white font-mono">{entry.instruction}</div>
                <div className="text-green-400 font-mono text-xs">{entry.result}</div>
              </div>
            ))}
            {executionTrace.length === 0 && (
              <div className="text-gray-400 text-xs text-center py-4">
                No execution trace available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

