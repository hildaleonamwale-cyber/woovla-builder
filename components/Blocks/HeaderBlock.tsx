
import React from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import BlockRenderer from '../Editor/BlockRenderer';
import { Edit2 } from 'lucide-react';

interface HeaderBlockProps {
  block: Block;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ block }) => {
  const { headerBlocks, setEditingMode, editingMode } = useStore();

  // If we are currently editing the header, we don't render this block essentially,
  // or we render it but the canvas is already showing the header blocks.
  // Actually, this block exists on the 'page'. When in 'page' mode, it renders the template.
  
  if (editingMode === 'header') {
    return (
      <div className="p-4 border border-dashed border-[#FF7575] bg-[#FF7575]/5 rounded-xl text-center">
        <span className="text-xs font-bold text-[#FF7575] uppercase tracking-widest">Editing Header Template...</span>
      </div>
    );
  }

  const handleEditHeader = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMode('header');
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.styles.backgroundColor || 'white',
    paddingTop: block.styles.padding?.top !== undefined ? `${block.styles.padding.top}px` : '0px',
    paddingBottom: block.styles.padding?.bottom !== undefined ? `${block.styles.padding.bottom}px` : '0px',
    paddingLeft: block.styles.padding?.left !== undefined ? `${block.styles.padding.left}px` : '0px',
    paddingRight: block.styles.padding?.right !== undefined ? `${block.styles.padding.right}px` : '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: block.styles.borderBottom ? '1px solid #f1f5f9' : 'none',
    position: block.styles.sticky ? 'sticky' : 'relative',
    top: 0,
    zIndex: 40,
    boxShadow: block.styles.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
  };

  return (
    <header className="relative group w-full" style={containerStyle}>
      {/* Overlay to Edit */}
      <div className="absolute inset-0 bg-[#FF7575]/0 group-hover:bg-[#FF7575]/10 transition-colors z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        <button 
          onClick={handleEditHeader}
          className="bg-[#FF7575] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Edit2 size={12} /> Edit Header
        </button>
      </div>

      {/* Render Template Blocks */}
      {/* We map the headerBlocks. Note: We use a simplified rendering here to avoid ID conflicts or just render them as read-only preview essentially */}
      {/* But to allow visual fidelity, we render them fully. However, pointer-events are blocked by the overlay above when hovering. */}
      {headerBlocks.map((b) => (
        <div key={b.id} className="pointer-events-none">
          <BlockRenderer block={b} />
        </div>
      ))}
      
      {headerBlocks.length === 0 && (
         <div className="text-slate-300 text-xs font-bold uppercase tracking-widest">Empty Header</div>
      )}
    </header>
  );
};

export default HeaderBlock;
