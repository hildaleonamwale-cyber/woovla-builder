
import React from 'react';
import { Block } from '../../types';
import { Plus } from 'lucide-react';

const LayoutBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;
  
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${content.columns || 2}, 1fr)`,
    gap: `${styles.gap || 20}px`,
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    backgroundColor: styles.backgroundColor || 'transparent',
  };

  return (
    <div style={containerStyle} className="w-full">
      {Array.from({ length: content.columns || 2 }).map((_, idx) => (
        <div 
          key={idx} 
          className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#FF7575] group-hover:bg-[#FF7575]/10 transition-all">
            <Plus size={16} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayoutBlock;
