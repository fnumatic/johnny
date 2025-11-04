import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onLoad: (file: File) => Promise<void>;
  onError?: (error: string) => void;
  'data-testid'?: string;
}

export function FileUpload({ onLoad, onError, 'data-testid': testId }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleError = (error: string) => {
    onError?.(error);
    console.error('File upload error:', error);
  };

  const handleFile = async (file: File) => {
    try {
      await onLoad(file);
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".ram"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => fileInputRef.current?.click()}
        title="Load .ram file"
        data-testid={testId}
      >
        <Upload className="size-6" />
      </Button>
    </div>
  );
}