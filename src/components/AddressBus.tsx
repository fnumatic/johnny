import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AddressBusProps {
  className?: string;
  showLabel?: boolean;
  formatWidth?: number;
}

export function AddressBus({
  className = '',
  showLabel = true,
  formatWidth = 3
}: AddressBusProps) {
  // Selective store subscriptions - only subscribe to what we actually need
  const addressBusValue = useStore(state => state.cpuState.ab);
  const setAddressBus = useStore(state => state.setAddressBus);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(addressBusValue.toString());
  };

  const handleSave = () => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value >= 0 && value <= 999) {
      setAddressBus(value.toString());
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
    <section aria-label="Address Bus" className={`bg-blue-500 p-4 rounded-lg ${className}`} data-testid="address-bus">
      <div className="flex items-center gap-5">
        {showLabel && <span className="text-xl min-w-fit">Address Bus</span>}
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <>
              <Input
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="font-mono !text-2xl font-bold w-24  text-center focus-visible:ring-offset-0 focus-visible:ring-0"
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
                value={addressBusValue.toString().padStart(formatWidth, '0')}
                readOnly
                className="font-mono !text-2xl font-bold w-24 text-center focus-visible:ring-offset-0 focus-visible:ring-0 border-0"
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