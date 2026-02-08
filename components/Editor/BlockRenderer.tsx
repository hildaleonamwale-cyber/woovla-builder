
import React from 'react';
import { useStore } from '../../store/useStore';
import { Block } from '../../types';
import TextBlock from '../Blocks/TextBlock';
import HeadingBlock from '../Blocks/HeadingBlock';
import ButtonBlock from '../Blocks/ButtonBlock';
import HeaderBlock from '../Blocks/HeaderBlock';
import ImageBlock from '../Blocks/ImageBlock';
import LayoutBlock from '../Blocks/LayoutBlock';
import FooterBlock from '../Blocks/FooterBlock';
import CarouselBlock from '../Blocks/CarouselBlock';
import FormBlock from '../Blocks/FormBlock';
import BookingBlock from '../Blocks/BookingBlock';
import EcommerceBlock from '../Blocks/EcommerceBlock';
import NavigationBlock from '../Blocks/NavigationBlock';

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const { selectedBlockId, selectBlock, editingMode, viewport } = useStore();
  const isSelected = selectedBlockId === block.id;

  // Check visibility for current viewport
  const isVisible = block.visibility?.[viewport];

  // If not visible in current viewport, we render it with opacity in editor, or hide it if we strictly followed a preview mode
  // For the builder experience, it's better to show it dimmed so the user can still select and edit it (e.g. to turn visibility back on)
  const opacityClass = isVisible === false ? 'opacity-30 grayscale' : 'opacity-100';

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text': return <TextBlock block={block} />;
      case 'heading': return <HeadingBlock block={block} />;
      case 'button': return <ButtonBlock block={block} />;
      case 'header': return <HeaderBlock block={block} />;
      case 'image': return <ImageBlock block={block} />;
      case 'layout': return <LayoutBlock block={block} />;
      case 'footer': return <FooterBlock block={block} />;
      case 'carousel': return <CarouselBlock block={block} />;
      case 'form': return <FormBlock block={block} />;
      case 'booking': return <BookingBlock block={block} />;
      case 'ecommerce': return <EcommerceBlock block={block} />;
      case 'navigation': return <NavigationBlock block={block} />;
      default:
        return (
          <div className="p-12 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 min-h-[100px]">
            <span className="text-xs font-bold uppercase tracking-widest">{block.type} Block</span>
          </div>
        );
    }
  };

  // Apply margins at the wrapper level to ensure spacing works for all blocks
  const wrapperStyle: React.CSSProperties = {
    marginTop: block.styles.margin?.top ? `${block.styles.margin.top}px` : undefined,
    marginBottom: block.styles.margin?.bottom ? `${block.styles.margin.bottom}px` : undefined,
    marginLeft: block.styles.margin?.left ? `${block.styles.margin.left}px` : undefined,
    marginRight: block.styles.margin?.right ? `${block.styles.margin.right}px` : undefined,
  };

  // Conditionally apply width: full unless we are editing the header, where we want natural flow
  const widthClass = editingMode === 'header' ? 'w-auto' : 'w-full';

  return (
    <div 
      id={block.id}
      style={wrapperStyle}
      className={`relative group transition-all duration-300 ${widthClass} ${opacityClass} cursor-pointer flex-shrink-0 ${
        isSelected ? 'z-50 outline outline-2 outline-[#FF7575] outline-offset-[-2px]' : 'hover:outline hover:outline-1 hover:outline-[#FF7575]/30 hover:outline-offset-[-1px]'
      }`}
      onClick={(e) => {
        // Prevent click from bubbling up to the canvas/background deselect handler
        e.stopPropagation();
        selectBlock(block.id);
      }}
    >
      <div className="w-full pointer-events-auto">
        {renderBlockContent()}
      </div>
      
      {isSelected && (
        <div className="absolute top-0 right-0 bg-[#FF7575] text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider z-[60] shadow-sm animate-in fade-in zoom-in-95 pointer-events-none">
          {block.type}
        </div>
      )}
      
      {/* Visual indicator for hidden blocks */}
      {isVisible === false && (
        <div className="absolute top-0 left-0 bg-slate-800 text-white text-[8px] px-2 py-0.5 rounded-br-lg font-bold uppercase tracking-wider z-[55] shadow-sm pointer-events-none">
          Hidden on {viewport}
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
