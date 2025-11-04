import React from 'react'
import { useStore } from '../store/useStore'

interface StartScreenProps {
  'data-testid'?: string;
}

export function StartScreen({ 'data-testid': testId }: StartScreenProps) {
  const loadMsg = useStore(state => state.loadMsg)
  
  return (
    <div className="flex flex-col text-center text-gray-400 bg-gray-700 w-screen h-screen" data-testid={testId}>
      <p className="text-[15vmin]">Johnny 2.0</p>
      <p className="text-[7vmin]">{loadMsg}</p>
      <p className="text-[6vmin]">Simulation of a simplified Von Neumann Computer</p>
      <p className="text-[4vmin]">David Laubersheimer</p>
      <p className="text-[4vmin]">2019-2021</p>
      <p className="text-[4vmin]">Peter Dauscher</p>
      <p className="text-[4vmin]">2009-2014</p>
    </div>
  )
} 