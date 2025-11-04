import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useStore } from '../store/useStore';

export function LoadFileButton() {
  const loadProgramFromFile = useStore(state => state.loadProgramFromFile);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ram';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        loadProgramFromFile(file);
      }
    };
    input.click();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      title="Load .ram File"
      onClick={handleFileSelect}
      data-testid="load-program-button"
    >
      <Upload className="size-6" />
    </Button>
  );
}