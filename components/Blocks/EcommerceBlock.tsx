
import React from 'react';
import { Block } from '../../types';

const EcommerceBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;

  // Palette Extraction
  const bgColor = styles.backgroundColor || '#ffffff';
  const primaryColor = styles.color || '#1e293b';
  const accentColor = styles.accentColor || '#FF7575';
  const mutedColor = styles.mutedColor || '#94a3b8'; // Unused in default but available
  
  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderTopLeftRadius: styles.cornerRadii?.topLeft !== undefined ? `${styles.cornerRadii.topLeft}px` : '32px',
    borderTopRightRadius: styles.cornerRadii?.topRight !== undefined ? `${styles.cornerRadii.topRight}px` : '32px',
    borderBottomRightRadius: styles.cornerRadii?.bottomRight !== undefined ? `${styles.cornerRadii.bottomRight}px` : '32px',
    borderBottomLeftRadius: styles.cornerRadii?.bottomLeft !== undefined ? `${styles.cornerRadii.bottomLeft}px` : '32px',
    boxShadow: styles.shadow === 'md' ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' : 'none',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: accentColor,
    color: '#ffffff',
    boxShadow: `0 10px 20px -5px ${accentColor}40`,
  };
  
  return (
    <div style={containerStyle} className="w-full">
      <div style={cardStyle} className="overflow-hidden border border-slate-100 group">
        <div className="aspect-square w-full overflow-hidden relative">
          <img src={content.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={content.title} />
          {/* Optional Badge support could go here using mutedColor/accentColor */}
        </div>
        <div className="p-8 flex flex-col items-center text-center">
          <h3 style={{ color: primaryColor }} className="text-xl font-black tracking-tight">{content.title}</h3>
          <span style={{ color: accentColor }} className="font-black text-lg mt-1">{content.price}</span>
          <button 
            style={buttonStyle}
            className="mt-6 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
          >
            {content.buttonText || 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcommerceBlock;
