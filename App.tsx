
import React from 'react';
import { useStore } from './store/useStore';
import Canvas from './components/Editor/Canvas';
import FloatingToolbar from './components/Editor/FloatingToolbar';
import ContextualModal from './components/Editor/ContextualModal';
import PageSettingsModal from './components/Editor/PageSettingsModal';
import Dashboard from './components/Dashboard/Dashboard';

const App: React.FC = () => {
  const { selectedBlockId, selectBlock, isSettingsOpen, view } = useStore();

  const handleGlobalClick = (e: React.MouseEvent) => {
    // Only deselect if the click is on the background area and not on a block or modal
    if (selectedBlockId || isSettingsOpen) {
      selectBlock(null);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen w-screen bg-white relative overflow-hidden" 
      onClick={handleGlobalClick}
    >
      {/* Workspace Area - Full Width */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        
        {/* Main Content Container - Always Full Width */}
        <div 
          className="w-full h-full bg-white flex flex-col overflow-hidden relative"
          onClick={(e) => {
            // Prevent deselecting when clicking inside the site preview
            e.stopPropagation();
          }}
        >
          {/* Main Content Switcher */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar overscroll-contain bg-white relative flex flex-col h-full">
             {view === 'canvas' ? <Canvas /> : <Dashboard />}
          </div>
        </div>
      </div>

      {/* Editor Overlays - Only visible in Canvas View */}
      {view === 'canvas' && (
        <>
            {selectedBlockId && <ContextualModal />}
            {isSettingsOpen && <PageSettingsModal />}
            <FloatingToolbar />
        </>
      )}
    </div>
  );
};

export default App;
