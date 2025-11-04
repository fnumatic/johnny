import { Button } from "@/components/ui/button";
import { useStore } from '../../store/useStore';
import { Wrench } from 'lucide-react';

export function DevToolbar() {
  const isDevMode = useStore(state => state.isDevMode);
  const showMaschinenraum = useStore(state => state.showMaschinenraum);
  const toggleMaschinenraum = useStore(state => state.toggleMaschinenraum);

  // Only show dev options when dev mode is enabled
  if (!isDevMode) {
    return null;
  }

  return (
    <Button 
      variant={showMaschinenraum ? 'secondary' : 'ghost'}
      size="icon" 
      title="Dev Options - Maschinenraum"
      onClick={toggleMaschinenraum}
      className="text-orange-400 hover:text-orange-300"
    >
      <Wrench className="size-6" />
    </Button>
  );
}

