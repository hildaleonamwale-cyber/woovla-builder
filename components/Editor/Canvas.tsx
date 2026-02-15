
import React from 'react';
import { useStore } from '../../store/useStore';
import BlockRenderer from './BlockRenderer';
import { ArrowLeft, Menu } from 'lucide-react';
import ContextualModal from './ContextualModal';

const Canvas: React.FC = () => {
  const { blocks, headerBlocks, footerBlocks, offCanvasBlocks, editingMode, pageSettings, setEditingMode, selectedBlockId } = useStore();
  
  // Select active blocks based on mode
  let activeBlocks = blocks;
  if (editingMode === 'header') activeBlocks = headerBlocks;
  if (editingMode === 'footer') activeBlocks = footerBlocks;
  if (editingMode === 'offcanvas') activeBlocks = offCanvasBlocks;

  // Filter for Root Blocks only (no parentId) and sort
  const rootBlocks = activeBlocks
    .filter(b => !b.parentId)
    .sort((a, b) => a.order - b.order);

  const getCanvasBackground = () => {
    if (editingMode === 'header') return '#ffffff'; // Headers usually white/transparent
    if (editingMode === 'footer') return '#F8FAFC'; // Footers usually slight gray
    if (editingMode === 'offcanvas') return '#ffffff';
    return pageSettings.backgroundColor;
  };

  const handleBack = () => {
    if (editingMode === 'offcanvas') {
      setEditingMode('header');
    } else {
      setEditingMode('page');
    }
  };

  // Calculate bottom padding: default + user setting + extra space if modal is open
  const baseBottomPadding = 8; // rem (toolbar space)
  const userBottomPadding = pageSettings.padding?.bottom || 0;
  const modalBuffer = selectedBlockId ? 500 : 0; // Add 500px buffer if block selected

  return (
    <div 
      className="w-full max-w-none flex flex-col transition-colors duration-300 min-h-full relative"
      style={{ 
        backgroundColor: getCanvasBackground(),
        fontFamily: pageSettings.fontFamily || 'Inter',
        paddingTop: pageSettings.padding?.top ? `${pageSettings.padding.top}px` : undefined,
        paddingRight: pageSettings.padding?.right ? `${pageSettings.padding.right}px` : undefined,
        paddingBottom: `calc(${baseBottomPadding}rem + ${userBottomPadding}px + ${modalBuffer}px)`,
        paddingLeft: pageSettings.padding?.left ? `${pageSettings.padding.left}px` : undefined,
      }}
    >
      {/* Navigation & Actions for Template Modes */}
      {editingMode !== 'page' && (
        <div className="sticky top-4 z-[90] flex justify-center mb-6 px-4 gap-2">
          <button 
            onClick={handleBack}
            className="bg-slate-900 text-white px-3 py-2 rounded-[10px] font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={10} /> {editingMode === 'offcanvas' ? 'Back' : 'Back to Page'}
          </button>

          {/* Special Button for Header Mode to Edit Off-Canvas Menu */}
          {editingMode === 'header' && (
            <button 
              onClick={() => setEditingMode('offcanvas')}
              className="bg-white text-slate-800 border border-slate-200 px-3 py-2 rounded-[10px] font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform hover:text-[#FF7575] hover:border-[#FF7575]"
            >
              <Menu size={10} /> Edit off-canvas menu
            </button>
          )}
        </div>
      )}

      {/* Editing Indicator */}
      {editingMode !== 'page' && (
        <div className="text-center pb-4 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Editing {editingMode === 'offcanvas' ? 'Mobile Menu' : editingMode + ' Template'}
          </span>
        </div>
      )}

      {/* Canvas Content */}
      <div 
        className={editingMode === 'header' ? 'flex flex-row items-center justify-between w-full max-w-none px-4' : 'flex flex-col w-full max-w-none'}
      >
        {rootBlocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
        
        {/* Subtle Empty State Notice */}
        {rootBlocks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 w-full opacity-60 pointer-events-none select-none min-h-[300px]">
             <div className="text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 leading-relaxed">
                  Start Building<br/>
                  <span className="text-slate-400 normal-case tracking-normal font-medium text-xs mt-2 block flex flex-col items-center gap-2">
                    Tap the <span className="inline-flex items-center justify-center w-14 h-14 bg-[#FF7575] text-white rounded-full shadow-xl text-3xl font-black mx-1 pt-0.5 hover:scale-110 transition-transform">+</span> button below
                  </span>
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Contextual Modal inside Canvas to allow absolute positioning relative to content flow */}
      {selectedBlockId && <ContextualModal />}
    </div>
  );
};

export default Canvas;
