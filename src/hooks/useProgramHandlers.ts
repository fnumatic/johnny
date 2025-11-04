import { useStore } from '../store/useStore';

export function useProgramHandlers() {
  const showEditor = useStore(state => state.showProgramEditor);
  const programText = useStore(state => state.programEditorText);
  const loadProgramFromFile = useStore(state => state.loadProgramFromFile);
  const loadProgramFromString = useStore(state => state.loadProgramFromString);
  const showEditorAction = useStore(state => state.openProgramEditor);
  const hideEditor = useStore(state => state.hideProgramEditor);
  const setEditorText = useStore(state => state.setProgramEditorText);

  const handlePasteProgram = () => {
    showEditorAction();
  };

  const handleLoadProgram = () => {
    if (programText.trim()) {
      loadProgramFromString(programText);
      hideEditor();
    }
  };

  const handleCancelEditor = () => {
    hideEditor();
  };

  const handleTextChange = (text: string) => {
    setEditorText(text);
  };

  const handleLoadFile = () => {
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

  return {
    handlePasteProgram,
    handleLoadFile,
    showEditor,
    programText,
    handleLoadProgram,
    handleCancelEditor,
    handleTextChange
  };
}