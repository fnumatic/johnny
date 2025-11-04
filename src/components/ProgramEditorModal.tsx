import { Button } from "@/components/ui/button";

interface ProgramEditorModalProps {
  show: boolean;
  programText: string;
  onTextChange: (text: string) => void;
  onLoad: () => void;
  onCancel: () => void;
}

export function ProgramEditorModal({ 
  show, 
  programText, 
  onTextChange, 
  onLoad, 
  onCancel 
}: ProgramEditorModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-[600px] max-h-[80vh]">
        <h3 className="text-lg font-semibold mb-4 text-white">Paste Program Code</h3>
        <p className="text-sm text-gray-300 mb-4">
          Enter program in multiline format. Each line should be a number (e.g., 1005 for opcode 1, data 5).
        </p>
        <textarea
          value={programText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Example:
1005
2006
3007
10000
23
3
10`}
          className="w-full h-64 p-3 bg-slate-700 text-white border border-slate-600 rounded-md resize-none font-mono text-sm"
          data-testid="program-input"
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={onLoad} 
            disabled={!programText.trim()}
            data-testid="load-pasted-program-button"
          >
            Load Program
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}