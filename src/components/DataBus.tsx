import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DataBusProps {
  className?: string;
  showLabel?: boolean;
  formatWidth?: number;
}

export function DataBus({
  className = '',
  showLabel = true,
  formatWidth = 5
}: DataBusProps) {
  // Selective store subscriptions - only subscribe to what we actually need
  const dataBusValue = useStore(state => state.cpuState.db);
  const setDataBus = useStore(state => state.setDataBus);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(dataBusValue.toString());
  };

  const handleSave = () => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value >= 0 && value <= 99999) {
      setDataBus(value.toString());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setEditValue(value);
    }
  };

  return (
    <section aria-label="Data Bus" className={`bg-green-500 p-4 rounded-lg ${className}`} data-testid="data-bus">
      <div className="flex items-center gap-5">
        {showLabel && <span className="text-xl min-w-fit">Data Bus</span>}
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <>
              <Input
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="font-mono !text-2xl font-bold w-32 text-center focus-visible:ring-offset-0 focus-visible:ring-0"
                autoFocus
              />
              <Button
                onClick={handleSave}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Save"
              >
                <Check size={16} />
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Cancel"
              >
                <X size={16} />
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                value={dataBusValue.toString().padStart(formatWidth, '0')}
                readOnly
                className="font-mono !text-2xl font-bold w-32 text-center focus-visible:ring-offset-0 focus-visible:ring-0 border-0"
              />
              <Button
                onClick={handleEditClick}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Edit"
              >
                <Edit size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}; 