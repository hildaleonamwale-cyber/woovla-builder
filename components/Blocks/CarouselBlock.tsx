
import React from 'react';
import { Block } from '../../types';

const CarouselBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;

  const accentColor = styles.accentColor || '#FF7575';
  
  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    overflowX: 'auto',
    display: 'flex',
    gap: '16px',
    scrollSnapType: 'x mandatory',
  };

  return (
    <div className="w-full relative">
      <div style={containerStyle} className="no-scrollbar">
        {content.slides?.map((slide: any, i: number) => (
          <div key={i} className="min-w-[85%] aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden scroll-snap-align-start relative shadow-lg">
            <img src={slide.url} className="w-full h-full object-cover" alt={slide.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-black text-lg">{slide.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {content.slides?.map((_: any, i: number) => (
          <div 
            key={i} 
            style={{ backgroundColor: i === 0 ? accentColor : '#e2e8f0' }}
            className="w-1.5 h-1.5 rounded-full transition-colors" 
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselBlock;
