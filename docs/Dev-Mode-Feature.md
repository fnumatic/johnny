# Dev Mode Feature Specification

## Overview

The Dev Mode feature introduces a developer-focused interface that provides advanced debugging and development tools for the Johnny2 CPU Simulator. It includes a toggleable development environment with specialized panels for testing, monitoring, and debugging CPU operations.

## Feature Requirements

### 1. Dev Mode State Management

#### 1.1 Store Integration
- Add `isDevMode` boolean state to the main store
- Dev Mode should be persisted during the session
- Dev Mode should be disabled by default for end users

#### 1.2 Dev Mode Toggle
- Accessible through the toolbar interface
- Should provide visual feedback when active
- Must maintain state across component re-renders

### 2. Toolbar Integration

#### 2.1 Dev Options Button
- Position: Left of the Settings button in the toolbar
- Icon: `Wrench` or `Code` from Lucide icons
- Tooltip: "Dev Options"
- Visibility: Only shown when Dev Mode is enabled
- Function: Toggles the "Maschinenraum" side panel

#### 2.2 Test Program Management
- Remove existing "Load Test Program" button from main toolbar
- Move test program functionality to the Dev Options panel
- Maintain existing test program loading logic

### 3. Maschinenraum Side Panel

#### 3.1 Panel Structure
- **Location**: Slides in from the right side of the screen
- **Width**: 400px minimum, resizable
- **Background**: Dark theme consistent with application
- **Z-index**: Above main content but below modals

#### 3.2 Panel Header
- **Title**: "Maschinenraum" (German for "Engine Room")
- **Close Button**: X icon to close the panel
- **Toolbar**: Mini toolbar with common dev actions

#### 3.3 Sub-panels
The Maschinenraum contains multiple sub-panels with tabs:

##### 3.3.1 Test Programs Tab
- **Load Test Program**: Button to load the default test program
- **Custom Program Input**: Text area for loading custom programs
- **Program History**: List of recently loaded programs
- **Quick Programs**: Predefined program snippets for testing

##### 3.3.2 CPU Statistics Tab
- **Execution Metrics**:
  - Instructions executed count
  - Clock cycles elapsed
  - Execution time
  - Average instructions per second
- **Memory Usage**:
  - RAM utilization graph
  - Memory access patterns
  - Hot memory regions
- **Performance Metrics**:
  - Microcode execution efficiency
  - Jump frequency analysis
  - Halt condition statistics

##### 3.3.3 Debug Tools Tab
- **Breakpoints**: Set breakpoints at specific memory addresses
- **Memory Watch**: Monitor specific memory locations
- **Register Dump**: Current state of all CPU registers
- **Execution Trace**: Log of recent instruction executions

##### 3.3.4 System Info Tab
- **Application Version**: Current Johnny2 version
- **Performance Info**: Browser performance metrics
- **Configuration**: Current simulator settings
- **Debug Console**: Live debug output

### 4. Technical Implementation

#### 4.1 Store Extensions
```typescript
interface DevModeState {
  isDevMode: boolean;
  showMaschinenraum: boolean;
  executionStats: {
    instructionsExecuted: number;
    clockCycles: number;
    startTime: number | null;
    executionTime: number;
  };
  breakpoints: Set<number>;
  watchedAddresses: Set<number>;
  executionTrace: Array<{
    timestamp: number;
    instruction: string;
    address: number;
    result: string;
  }>;
}

interface DevModeActions {
  toggleDevMode: () => void;
  toggleMaschinenraum: () => void;
  resetExecutionStats: () => void;
  addBreakpoint: (address: number) => void;
  removeBreakpoint: (address: number) => void;
  addWatchAddress: (address: number) => void;
  removeWatchAddress: (address: number) => void;
  addExecutionTrace: (entry: ExecutionTraceEntry) => void;
  clearExecutionTrace: () => void;
}
```

#### 4.2 Component Structure
```
src/components/
├── DevMode/
│   ├── Maschinenraum.tsx          # Main side panel component
│   ├── DevToolbar.tsx             # Dev options toolbar button
│   ├── tabs/
│   │   ├── TestProgramsTab.tsx    # Test program management
│   │   ├── StatisticsTab.tsx      # CPU statistics display
│   │   ├── DebugToolsTab.tsx      # Debug tools interface
│   │   └── SystemInfoTab.tsx      # System information
│   └── hooks/
│       ├── useDevMode.ts          # Dev mode state hook
│       └── useExecutionStats.ts   # Statistics tracking hook
```

#### 4.3 Styling Requirements
- Use existing Tailwind CSS theme
- Match application's dark color scheme
- Ensure accessibility compliance
- Responsive design for different screen sizes
- Smooth animations for panel transitions

### 5. User Experience

#### 5.1 Enabling Dev Mode
1. User needs to enable Dev Mode through a specific action (e.g., keyboard shortcut or hidden menu)
2. Once enabled, the Dev Options button appears in the toolbar
3. Dev Mode state persists for the session

#### 5.2 Using Dev Tools
1. Click Dev Options button to open Maschinenraum
2. Navigate between tabs to access different tools
3. All tools provide real-time updates during CPU execution
4. Panel can be closed/reopened without losing state

#### 5.3 Integration with Main Interface
- Dev tools do not interfere with normal simulator operation
- Statistics update in real-time during execution
- Breakpoints integrate with the existing execution engine
- Memory watches highlight relevant cells in the main memory view

### 6. Security and Performance

#### 6.1 Performance Considerations
- Statistics collection should have minimal performance impact
- Large execution traces should be automatically pruned
- Panel rendering should be optimized for smooth operation

#### 6.2 Data Privacy
- No sensitive data collection
- All statistics remain client-side
- No external API calls for dev features

### 7. Future Enhancements

#### 7.1 Advanced Debug Features
- Visual flow chart of program execution
- Memory diff visualization
- Performance profiling graphs
- Export debug data functionality

#### 7.2 Development Tools Integration
- Integration with browser DevTools
- Custom logging levels
- Debug symbol support
- Source map integration for microcode

### 8. Acceptance Criteria

#### 8.1 Functional Requirements
- [ ] Dev Mode can be enabled/disabled
- [ ] Dev Options button appears only when Dev Mode is active
- [ ] Maschinenraum panel opens/closes smoothly
- [ ] All sub-panels render correctly with proper content
- [ ] Test program loading works from the new location
- [ ] Statistics update in real-time during execution
- [ ] Panel state persists during navigation

#### 8.2 Technical Requirements
- [ ] No performance degradation when Dev Mode is disabled
- [ ] Memory usage remains reasonable with statistics collection
- [ ] All components follow existing code style guidelines
- [ ] Proper TypeScript typing for all new interfaces
- [ ] Unit tests for dev mode functionality

#### 8.3 UI/UX Requirements
- [ ] Panel design matches application theme
- [ ] Smooth animations for all interactions
- [ ] Responsive design works on different screen sizes
- [ ] Accessibility standards maintained
- [ ] Intuitive navigation between dev tools

### 9. Implementation Phases

#### Phase 1: Core Infrastructure
- Add dev mode state to store
- Implement basic panel structure
- Add dev options button to toolbar

#### Phase 2: Test Programs Tab
- Move test program functionality
- Implement custom program input
- Add program history feature

#### Phase 3: Statistics and Debug Tools
- Implement execution statistics collection
- Add basic debug tools (breakpoints, watches)
- Create system info display

#### Phase 4: Polish and Optimization
- Performance optimization
- Visual improvements
- Additional debug features
- Documentation updates

---

**Document Version**: 1.0  
**Created**: 2025-08-14  
**Author**: Johnny2 Development Team  
**Status**: Specification  

