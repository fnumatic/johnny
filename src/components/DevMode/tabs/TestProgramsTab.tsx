import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from '../../../store/useStore';
import { TestTube, Upload, History, Zap, Info } from 'lucide-react';
import { useState } from 'react';

export function TestProgramsTab() {
  const loadTestProgram = useStore(state => state.loadTestProgram);
  const loadProgramFromString = useStore(state => state.loadProgramFromString);
  const resetProgramCounter = useStore(state => state.resetProgramCounter);
  const currentProgramMetadata = useStore(state => state.currentProgramMetadata);
  
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [programText, setProgramText] = useState('');

  const handleLoadCustomProgram = () => {
    if (programText.trim()) {
      loadProgramFromString(programText);
      setShowCustomInput(false);
      setProgramText('');
    }
  };

  const quickPrograms = [
    {
      name: 'Simple Loop',
      description: 'Basic increment loop with halt',
      program: 'RAM:{simple loop}:V1;1005;2006;7000;5000;10000;5;1'
    },
    {
      name: 'Add Two Numbers',
      description: 'Load two numbers and add them',
      program: 'RAM:{add two numbers}:V2;1005;2004;4007;10000;3;7;0'
    },
    {
      name: 'Counter',
      description: 'Count from 0 to 10',
      program: 'RAM:{counter 0 to 10}:V1;1008;2009;4010;7000;6007;5003;10000;0;1;10;0'
    },
    {
      name: 'Fibonacci Sequence',
      description: 'Calculate first 5 Fibonacci numbers',
      program: 'RAM:{fibonacci sequence}:V3;1020;2021;4022;7000;4020;1021;4021;2022;5002;10000;0;1;0;0'
    },
    {
      name: 'Multiplication by Addition',
      description: 'Multiply 3 x 4 using repeated addition',
      program: 'RAM:{multiply 3x4}:V1;1015;6016;2015;8000;6016;5008;4017;10000;3;4;0;0'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Current Program Info */}
      {currentProgramMetadata && (
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Info className="size-4" />
              Current Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-slate-800 p-2 rounded text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2 font-mono">{currentProgramMetadata.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white ml-2 font-mono">{currentProgramMetadata.version}</span>
                </div>
              </div>
              {currentProgramMetadata.description && (
                <div className="mt-2">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white ml-2">{currentProgramMetadata.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Test Program */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <TestTube className="size-4" />
            Default Test Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-300">
            Load the standard test program for basic CPU operations
          </p>
          <Button 
            onClick={loadTestProgram}
            className="w-full"
            size="sm"
            data-testid="load-test-program-button"
          >
            Load Test Program
          </Button>
        </CardContent>
      </Card>

      {/* Custom Program Input */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Upload className="size-4" />
            Custom Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!showCustomInput ? (
            <>
              <p className="text-xs text-gray-300">
                Load a custom program from text input. Supports both multiline and semicolon-separated formats.
              </p>
              <Button 
                onClick={() => setShowCustomInput(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Input Custom Program
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-gray-300 space-y-1">
                <div>Supported formats:</div>
                <div className="font-mono text-gray-400">• Semicolon: RAM:{'description'}:V1;1005;2006;10000</div>
                <div className="font-mono text-gray-400">• Multiline: 1005\n2006\n10000</div>
              </div>
              <textarea
                value={programText}
                onChange={(e) => setProgramText(e.target.value)}
                placeholder={`Examples:
RAM:{test program}:V1;1005;2006;3007;10000

Or multiline:
1005
2006
3007
10000`}
                className="w-full h-32 p-2 bg-slate-800 text-white border border-slate-600 rounded text-xs resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleLoadCustomProgram}
                  disabled={!programText.trim()}
                  size="sm"
                  className="flex-1"
                >
                  Load
                </Button>
                <Button 
                  onClick={() => {
                    setShowCustomInput(false);
                    setProgramText('');
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Programs */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Zap className="size-4" />
            Quick Programs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickPrograms.map((program, index) => (
            <div key={index} className="border border-slate-600 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-white">{program.name}</h4>
                <Button
                  onClick={() => loadProgramFromString(program.program)}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                >
                  Load
                </Button>
              </div>
              <p className="text-xs text-gray-400">{program.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reset Actions */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <History className="size-4" />
            Reset Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={resetProgramCounter}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            Reset CPU State
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
