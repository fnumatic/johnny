import { describe, it, expect } from 'vitest';
import { useStore } from '../store/useStore';
import { getCurrentMicrocode, flattenMicrocode } from '../lib/engine';

describe('Microcode Consistency', () => {
  it('should maintain consistent microcode between steps', () => {
    const store = useStore.getState();
    
    // Get initial microcode
    const initialMicrocode = store.cpuState.microCode;
    const expectedMicrocode = flattenMicrocode(getCurrentMicrocode('normal', store.availableModes));
    
    // Verify initial microcode is correct
    expect(initialMicrocode).toEqual(expectedMicrocode);
    
    // Take a step
    useStore.getState().stepForward();
    
    // Get microcode after step
    const afterStepMicrocode = useStore.getState().cpuState.microCode;
    
    // Verify microcode hasn't changed
    expect(afterStepMicrocode).toEqual(initialMicrocode);
    
    // Take another step
    useStore.getState().stepForward();
    
    // Get microcode after second step
    const afterSecondStepMicrocode = useStore.getState().cpuState.microCode;
    
    // Verify microcode still hasn't changed
    expect(afterSecondStepMicrocode).toEqual(initialMicrocode);
  });
  
  it('should update microcode only when mode changes', () => {
    const store = useStore.getState();
    
    // Get initial microcode for normal mode
    const normalMicrocode = store.cpuState.microCode;
    
    // Change to bonsai mode
    useStore.getState().setCurrentMode('bonsai');
    
    // Get microcode after mode change
    const bonsaiMicrocode = useStore.getState().cpuState.microCode;
    const expectedBonsaiMicrocode = flattenMicrocode(getCurrentMicrocode('bonsai', store.availableModes));
    
    // Verify microcode changed to bonsai
    expect(bonsaiMicrocode).toEqual(expectedBonsaiMicrocode);
    expect(bonsaiMicrocode).not.toEqual(normalMicrocode);
    
    // Take a step
    useStore.getState().stepForward();
    
    // Verify microcode remains the same after step
    const afterStepMicrocode = useStore.getState().cpuState.microCode;
    expect(afterStepMicrocode).toEqual(bonsaiMicrocode);
  });
}); 