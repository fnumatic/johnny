import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from '../../../store/useStore';
import { Info, Monitor, Cpu, HardDrive, Clock } from 'lucide-react';

export function SystemInfoTab() {
  const currentMode = useStore(state => state.currentMode);
  const cpuState = useStore(state => state.cpuState);
  const executionSpeed = useStore(state => state.executionSpeed);
  const isRunning = useStore(state => state.isRunning);

  const getBrowserInfo = () => {
    const { userAgent } = navigator;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getPerformanceInfo = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedHeap: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        totalHeap: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        heapLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  };

  const memoryInfo = getPerformanceInfo();

  return (
    <div className="p-4 space-y-4" data-testid="system-info-content">
      {/* Application Info */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Info className="size-4" />
            Application Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Version:</span>
              <span className="text-white font-mono">2.0.0</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Build:</span>
              <span className="text-white font-mono">DEV</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Mode:</span>
              <span className="text-white font-mono capitalize">{currentMode}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-mono ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
                {isRunning ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Environment */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Monitor className="size-4" />
            Browser Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Browser:</span>
              <span className="text-white font-mono">{getBrowserInfo()}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white font-mono">{navigator.platform}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Language:</span>
              <span className="text-white font-mono">{navigator.language}</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Online:</span>
              <span className={`font-mono ${navigator.onLine ? 'text-green-400' : 'text-red-400'}`}>
                {navigator.onLine ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {memoryInfo && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <HardDrive className="size-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-slate-800 p-2 rounded flex justify-between">
                <span className="text-gray-400">Used Heap:</span>
                <span className="text-white font-mono">{memoryInfo.usedHeap} MB</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between">
                <span className="text-gray-400">Total Heap:</span>
                <span className="text-white font-mono">{memoryInfo.totalHeap} MB</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between">
                <span className="text-gray-400">Heap Limit:</span>
                <span className="text-white font-mono">{memoryInfo.heapLimit} MB</span>
              </div>
              <div className="bg-slate-800 p-2 rounded flex justify-between">
                <span className="text-gray-400">Usage:</span>
                <span className="text-white font-mono">
                  {Math.round((memoryInfo.usedHeap / memoryInfo.heapLimit) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CPU Configuration */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Cpu className="size-4" />
            CPU Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">RAM Size:</span>
              <span className="text-white font-mono">{cpuState.ram.length} cells</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Execution Speed:</span>
              <span className="text-white font-mono">{executionSpeed}x</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Microcode Size:</span>
              <span className="text-white font-mono">{cpuState.microCode.length} instructions</span>
            </div>
            <div className="bg-slate-800 p-2 rounded flex justify-between">
              <span className="text-gray-400">Architecture:</span>
              <span className="text-white font-mono">Johnny2 VM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Console */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Clock className="size-4" />
            Debug Console
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 p-3 rounded text-xs font-mono text-green-400 h-32 overflow-y-auto">
            <div>[{new Date().toLocaleTimeString()}] Johnny2 CPU Simulator initialized</div>
            <div>[{new Date().toLocaleTimeString()}] Microcode mode: {currentMode}</div>
            <div>[{new Date().toLocaleTimeString()}] RAM initialized with {cpuState.ram.length} cells</div>
            <div>[{new Date().toLocaleTimeString()}] Dev Mode enabled</div>
            <div>[{new Date().toLocaleTimeString()}] Maschinenraum active</div>
            <div className="text-gray-500">...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

