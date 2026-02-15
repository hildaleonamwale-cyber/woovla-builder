
import React, { useRef, useState, useEffect } from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import BlockRenderer from '../Editor/BlockRenderer';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;
  const { blocks, headerBlocks, footerBlocks, offCanvasBlocks, editingMode, setAddMenuOpen, viewport } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // 1. Get Children
  let allBlocks = blocks;
  if (editingMode === 'header') allBlocks = headerBlocks;
  if (editingMode === 'footer') allBlocks = footerBlocks;
  if (editingMode === 'offcanvas') allBlocks = offCanvasBlocks;

  const children = allBlocks
    .filter(b => b.parentId === block.id)
    .sort((a, b) => a.order - b.order);

  // 2. Settings (Responsive)
  const settings = content.settings || {
    slidesPerView: { mobile: 1.2, tablet: 2.2, desktop: 3.2 },
    gap: 16,
    arrows: true,
    dots: true,
    loop: false
  };

  const slidesPerView = settings.slidesPerView[viewport] || settings.slidesPerView.mobile || 1.2;
  const gap = styles.gap !== undefined ? styles.gap : (settings.gap || 16);

  // 3. Styles
  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '20px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '20px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    marginTop: styles.margin?.top !== undefined ? `${styles.margin.top}px` : '0px',
    marginBottom: styles.margin?.bottom !== undefined ? `${styles.margin.bottom}px` : '0px',
    marginLeft: styles.margin?.left !== undefined ? `${styles.margin.left}px` : '0px',
    marginRight: styles.margin?.right !== undefined ? `${styles.margin.right}px` : '0px',
    backgroundColor: styles.backgroundColor || 'transparent',
    position: 'relative',
    width: '100%',
    overflow: 'hidden'
  };

  // 4. Slide Width Calculation
  // We use a CSS variable for gap to use in calc() if needed, or just standard calc
  // Width = (100% - (visibleCards - 1) * gap) / visibleCards
  const slideWidthStyle = {
    flex: `0 0 calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`,
    maxWidth: `calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})`
  };

  // 5. Scroll Handling
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const itemWidth = scrollContainerRef.current.scrollWidth / (children.length + 1); // +1 for add button
    const index = Math.round(scrollLeft / itemWidth);
    setActiveSlide(index);
  };

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    // Estimate width of one item + gap
    const containerWidth = scrollContainerRef.current.offsetWidth;
    // Better calculation of scroll amount: width of one slide + gap
    // This is approximate but effective for snapping
    const scrollAmount = (containerWidth / slidesPerView) + gap; 
    
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse Drag Logic for Desktop
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewport === 'mobile') return; // Let touch handle mobile
    setIsDown(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div style={containerStyle} className="group">
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ gap: `${gap}px` }}
      >
        {/* Render Children Slots */}
        {children.map((childBlock) => (
          <div 
            key={childBlock.id} 
            style={slideWidthStyle}
            className="snap-start shrink-0 h-full"
          >
             {/* We wrap BlockRenderer. Important: BlockRenderer needs to handle being a child without its own margins interfering too much if possible */}
             <BlockRenderer block={childBlock} />
          </div>
        ))}

        {/* Add Slide Placeholder */}
        <div 
           style={slideWidthStyle}
           className="snap-start shrink-0 flex flex-col"
        >
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 // Open the global add menu with this carousel as the parent
                 setAddMenuOpen(true, block.id);
               }}
               className="h-full min-h-[200px] w-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:text-[#FF7575] hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all gap-2 group/add"
             >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-slate-400 group-hover:text-[#FF7575]">
                   <Plus size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#FF7575]">Add Slide</span>
             </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {settings.arrows && viewport === 'desktop' && (
        <>
            <button 
                onClick={(e) => { e.stopPropagation(); scrollBy('left'); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white flex items-center justify-center text-slate-800 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); scrollBy('right'); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white flex items-center justify-center text-slate-800 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
                <ChevronRight size={20} />
            </button>
        </>
      )}

      {/* Dots */}
      {settings.dots && (
        <div className="flex justify-center gap-1.5 mt-4">
          {/* We create dots for existing children + 1 for add button */}
          {Array.from({ length: children.length + 1 }).map((_, i) => (
            <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-[#FF7575] w-3' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselBlock;
