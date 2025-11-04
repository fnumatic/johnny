"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  disabled = false,
  autoFocus = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (autoFocus) {
      setOpen(true)
    }
  }, [autoFocus])

  // Sort options by numeric prefix
  const sortedOptions = React.useMemo(() => {
    return [...options].sort((a, b) => {
      // Extract numeric prefix from labels (e.g., "07:", "08:" 🡒 7, 8)
      const getNumericPrefix = (label: string) => {
        const match = label.match(/^(\d+):/)
        return match ? parseInt(match[1], 10) : 0
      }
      
      const aNum = getNumericPrefix(a.label)
      const bNum = getNumericPrefix(b.label)
      
      // Sort by numeric prefix first, then alphabetically
      if (aNum !== bNum) {
        return aNum - bNum
      }
      return a.label.localeCompare(b.label)
    })
  }, [options])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-[99999] bg-slate-900 border border-slate-700 text-slate-100">
        <Command 
          filter={(value, search) => {
            // Custom filter that preserves our sorting
            const option = sortedOptions.find(opt => opt.label === value)
            if (!option) return 0
            if (!search) return 1
            return option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }}
          className="[&_[cmdk-group-items]]:pointer-events-none [&_[cmdk-item]]:pointer-events-auto"
        >
          <CommandInput 
            placeholder="Search options..." 
            className="border-none"
          />
          <CommandList className="max-h-[180px]">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(selectedLabel) => {
                    const selectedOption = sortedOptions.find(opt => opt.label === selectedLabel)
                    if (selectedOption) {
                      onValueChange?.(selectedOption.value === value ? "" : selectedOption.value)
                    }
                    setOpen(false)
                  }}
                  className="cursor-pointer hover:bg-slate-800 aria-selected:bg-slate-700"
                >
                  <div 
                    className="w-full flex items-center"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onValueChange?.(option.value === value ? "" : option.value)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
