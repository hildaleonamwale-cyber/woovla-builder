
import React from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import BlockRenderer from '../Editor/BlockRenderer';
import { Plus, Image as ImageIcon } from 'lucide-react';

const CoverBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { styles, content } = block;
  const { blocks, headerBlocks, footerBlocks, offCanvasBlocks, editingMode, addBlock, viewport, selectBlock } = useStore();

  // 1. Get Children (Slots)
  let allBlocks = blocks;
  if (editingMode === 'header') allBlocks = headerBlocks;
  if (editingMode === 'footer') allBlocks = footerBlocks;
  if (editingMode === 'offcanvas') allBlocks = offCanvasBlocks;

  const children = allBlocks
    .filter(b => b.parentId === block.id)
    .sort((a, b) => a.order - b.order);

  // 2. Resolve Styles
  const bgColor = styles.backgroundColor || '#ffffff';
  const cardBgStart = styles.cardBackgroundStart || 'rgba(255, 255, 255, 1)';
  const cardBgEnd = styles.cardBackgroundEnd || 'rgba(255, 245, 245, 1)';
  const accentColor = styles.accentColor || '#FF7575'; 
  const showCardImage = content.showCardImage === true;

  // 3. Slides Per View Logic
  const slidesPerView = content.settings?.slidesPerView?.[viewport] || 
    (viewport === 'mobile' ? 1.3 : viewport === 'tablet' ? 2.5 : 3.5);
  
  const gap = content.settings?.gap || 26;

  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '30px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '50px',
    backgroundColor: bgColor,
    width: '100%',
    fontFamily: 'Inter, sans-serif'
  };

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${gap}px`,
    padding: '20px 5%',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  };

  // 4. Card Styles
  const cardStyle: React.CSSProperties = {
    flex: `0 0 calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`,
    minWidth: '260px',
    position: 'relative',
    borderTopLeftRadius: styles.cornerRadii?.topLeft !== undefined ? `${styles.cornerRadii.topLeft}px` : '36px',
    borderTopRightRadius: styles.cornerRadii?.topRight !== undefined ? `${styles.cornerRadii.topRight}px` : '36px',
    borderBottomRightRadius: styles.cornerRadii?.bottomRight !== undefined ? `${styles.cornerRadii.bottomRight}px` : '36px',
    borderBottomLeftRadius: styles.cornerRadii?.bottomLeft !== undefined ? `${styles.cornerRadii.bottomLeft}px` : '36px',
    padding: showCardImage ? '0' : '30px', 
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.45s cubic-bezier(0.165, 0.84, 0.44, 1)',
    overflow: 'hidden',
    background: `linear-gradient(145deg, ${cardBgStart} 0%, ${cardBgEnd} 100%)`,
    boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
  };

  // 5. Empty Slot Button
  const addButtonStyle: React.CSSProperties = {
    flex: `0 0 calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`,
    minWidth: '260px',
    borderTopLeftRadius: styles.cornerRadii?.topLeft !== undefined ? `${styles.cornerRadii.topLeft}px` : '36px',
    borderTopRightRadius: styles.cornerRadii?.topRight !== undefined ? `${styles.cornerRadii.topRight}px` : '36px',
    borderBottomRightRadius: styles.cornerRadii?.bottomRight !== undefined ? `${styles.cornerRadii.bottomRight}px` : '36px',
    borderBottomLeftRadius: styles.cornerRadii?.bottomLeft !== undefined ? `${styles.cornerRadii.bottomLeft}px` : '36px',
    border: `2px dashed ${accentColor}40`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    minHeight: '300px',
    background: 'transparent'
  };

  return (
    <section style={containerStyle} className="relative group/section">
      <div style={trackStyle} className="gp-carousel-track no-scrollbar">
        {children.map((child) => (
          <div 
             key={child.id} 
             style={cardStyle}
             className="gp-glass-card-inner hover:-translate-y-2 hover:shadow-lg transition-transform"
          >
             {showCardImage && (
               <div 
                 className="w-full aspect-video bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden relative shrink-0 cursor-pointer group/image"
                 onClick={(e) => {
                    e.stopPropagation();
                    selectBlock(child.id);
                 }}
               >
                  {child.content.coverImage ? (
                    <img src={child.content.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                       <ImageIcon size={24} />
                       <span className="text-[8px] font-black uppercase tracking-widest mt-1">No Image</span>
                    </div>
                  )}
               </div>
             )}

             <div className="flex-1 w-full" style={{ padding: showCardImage ? '30px' : '0' }}>
                <BlockRenderer block={child} />
             </div>
          </div>
        ))}

        <div 
           style={addButtonStyle}
           className="hover:bg-slate-50 transition-colors group/empty"
           onClick={(e) => {
               e.stopPropagation();
               addBlock('slot', undefined, block.id);
           }}
        >
            <div 
                style={{ color: accentColor }}
                className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover/empty:scale-110 transition-transform bg-white shadow-sm"
            >
                <Plus size={24} />
            </div>
            <span style={{ color: accentColor }} className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-60 group-hover/empty:opacity-100">Add Slide</span>
        </div>
      </div>
    </section>
  );
};

export default CoverBlock;
