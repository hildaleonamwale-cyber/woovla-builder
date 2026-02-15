
import React from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import BlockRenderer from '../Editor/BlockRenderer';
import { Plus } from 'lucide-react';

const SlotBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { blocks, headerBlocks, footerBlocks, offCanvasBlocks, editingMode, setAddMenuOpen } = useStore();

  // Get Children of this Slot (rendered vertically)
  let allBlocks = blocks;
  if (editingMode === 'header') allBlocks = headerBlocks;
  if (editingMode === 'footer') allBlocks = footerBlocks;
  if (editingMode === 'offcanvas') allBlocks = offCanvasBlocks;

  const children = allBlocks
    .filter(b => b.parentId === block.id)
    .sort((a, b) => a.order - b.order);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Gap between items in the stack
    width: '100%',
    height: '100%',
    // Styles from the block itself (though Cover usually controls the container)
    padding: block.styles.padding ? `${block.styles.padding.top}px ${block.styles.padding.right}px ${block.styles.padding.bottom}px ${block.styles.padding.left}px` : '0',
  };

  return (
    <div style={containerStyle} className="h-full relative">
      {/* Render Vertical Children */}
      {children.map((child) => (
        <BlockRenderer key={child.id} block={child} />
      ))}

      {/* Internal Add Button - Allows adding more items to this stack */}
      <button
        onClick={(e) => {
            e.stopPropagation();
            setAddMenuOpen(true, block.id);
        }}
        className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-slate-300 hover:text-[#FF7575] hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all flex items-center justify-center gap-2 mt-auto"
      >
         <Plus size={14} />
         <span className="text-[9px] font-bold uppercase tracking-widest">Add Block</span>
      </button>
    </div>
  );
};

export default SlotBlock;
