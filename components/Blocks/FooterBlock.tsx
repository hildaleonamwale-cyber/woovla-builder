
import React from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import BlockRenderer from '../Editor/BlockRenderer';
import { Edit2 } from 'lucide-react';

const FooterBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { footerBlocks, setEditingMode, editingMode } = useStore();
  
  if (editingMode === 'footer') {
    return (
      <div className="p-4 border border-dashed border-[#FF7575] bg-[#FF7575]/5 rounded-xl text-center">
        <span className="text-xs font-bold text-[#FF7575] uppercase tracking-widest">Editing Footer Template...</span>
      </div>
    );
  }

  const handleEditFooter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMode('footer');
  };

  const style: React.CSSProperties = {
    backgroundColor: block.styles.backgroundColor || '#F8FAFC',
    paddingTop: block.styles.padding?.top !== undefined ? `${block.styles.padding.top}px` : '0px',
    paddingBottom: block.styles.padding?.bottom !== undefined ? `${block.styles.padding.bottom}px` : '0px',
    paddingLeft: block.styles.padding?.left !== undefined ? `${block.styles.padding.left}px` : '0px',
    paddingRight: block.styles.padding?.right !== undefined ? `${block.styles.padding.right}px` : '0px',
    color: block.styles.color || '#64748B',
    borderTop: '1px solid #E2E8F0',
    position: 'relative'
  };

  return (
    <footer style={style} className="w-full flex flex-col items-center gap-4 group">
       {/* Overlay to Edit */}
      <div className="absolute inset-0 bg-[#FF7575]/0 group-hover:bg-[#FF7575]/10 transition-colors z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto rounded-none">
        <button 
          onClick={handleEditFooter}
          className="bg-[#FF7575] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Edit2 size={12} /> Edit Footer
        </button>
      </div>

      {footerBlocks.map((b) => (
        <div key={b.id} className="w-full pointer-events-none">
          <BlockRenderer block={b} />
        </div>
      ))}
       {footerBlocks.length === 0 && (
         <div className="text-slate-300 text-xs font-bold uppercase tracking-widest">Empty Footer</div>
      )}
    </footer>
  );
};

export default FooterBlock;
