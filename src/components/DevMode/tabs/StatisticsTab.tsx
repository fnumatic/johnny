import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from '../../../store/useStore';
import { Clock, Cpu, MemoryStick, RotateCcw, Activity } from 'lucide-react';

export function StatisticsTab() {
  const executionStats = useStore(state => state.executionStats);
  const cpuState = useStore(state => state.cpuState);
  const resetExecutionStats = useStore(state => state.resetExecutionStats);
  const executionTrace = useStore(state => state.executionTrace);
  const breakpoints = useStore(state => state.breakpoints);
  const watchedAddresses = useStore(state => state.watchedAddresses);

  const formatTime = (milliseconds: number) => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    return `${(milliseconds / 1000).toFixed(2)}s`;
  };

  const getCurrentExecutionTime = () => {
    if (!executionStats.startTime) return 0;
    return Date.now() - executionStats.startTime;
  };

  const getInstructionsPerSecond = () => {
    const currentTime = getCurrentExecutionTime();
    if (currentTime === 0 || executionStats.instructionsExecuted === 0) return 0;
    return (executionStats.instructionsExecuted / (currentTime / 1000)).toFixed(2);
  };

  const getMemoryUtilization = () => {
    const nonZeroCells = cpuState.ram.filter(cell => cell !== 0).length;
    return ((nonZeroCells / cpuState.ram.length) * 100).toFixed(1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Execution Metrics */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Clock className="size-4" />
            Execution Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Instructions</div>
              <div className="text-white font-mono text-lg" data-testid="execution-count">{executionStats.instructionsExecuted}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Clock Cycles</div>
              <div className="text-white font-mono text-lg" data-testid="cycles-count">{executionStats.clockCycles}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Exec Time</div>
              <div className="text-white font-mono text-lg">
                {formatTime(getCurrentExecutionTime())}
              </div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">IPS</div>
              <div className="text-white font-mono text-lg">{getInstructionsPerSecond()}</div>
            </div>
          </div>
          <Button 
            onClick={resetExecutionStats}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="size-3 mr-1" />
            Reset Stats
          </Button>
        </CardContent>
      </Card>

      {/* CPU State */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Cpu className="size-4" />
            CPU State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">PC</div>
              <div className="text-white font-mono">{cpuState.pc.toString().padStart(3, '0')}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">ACC</div>
              <div className="text-white font-mono">{cpuState.acc.toString().padStart(5, '0')}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">IR</div>
              <div className="text-white font-mono">{cpuState.ir.toString().padStart(5, '0')}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">MC</div>
              <div className="text-white font-mono">{cpuState.mcCounter.toString().padStart(3, '0')}</div>
            </div>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <div className="text-gray-400 text-xs">Status</div>
            <div className="text-white font-mono text-sm">
              {cpuState.halted ? 'HALTED' : 'RUNNING'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Statistics */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <MemoryStick className="size-4" />
            Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Utilization</div>
              <div className="text-white font-mono">{getMemoryUtilization()}%</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Total Cells</div>
              <div className="text-white font-mono">{cpuState.ram.length}</div>
            </div>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <div className="text-gray-400 text-xs">Address Bus</div>
            <div className="text-white font-mono">{cpuState.ab.toString().padStart(3, '0')}</div>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <div className="text-gray-400 text-xs">Data Bus</div>
            <div className="text-white font-mono">{cpuState.db.toString().padStart(5, '0')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Summary */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Activity className="size-4" />
            Debug Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Breakpoints</div>
              <div className="text-white font-mono" data-testid="errors-count">{breakpoints.size}</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-gray-400">Watches</div>
              <div className="text-white font-mono">{watchedAddresses.size}</div>
            </div>
          </div>
          <div className="bg-slate-800 p-2 rounded">
            <div className="text-gray-400 text-xs">Trace Entries</div>
            <div className="text-white font-mono">{executionTrace.length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

