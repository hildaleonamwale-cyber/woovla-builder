
import React from 'react';
import { Block } from '../../types';

const FormBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;
  
  // Palette Extraction
  const bgColor = styles.backgroundColor || 'transparent';
  const sectionColor = styles.sectionColor || '#F8FAFC'; // Input BG
  const primaryColor = styles.color || '#1e293b'; // Main Text
  const accentColor = styles.accentColor || '#FF7575'; // Button BG
  const mutedColor = styles.mutedColor || '#94a3b8'; // Labels

  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    backgroundColor: bgColor,
    textAlign: styles.textAlign || 'left',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: sectionColor,
    borderColor: 'transparent',
    color: primaryColor,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: accentColor,
    color: '#ffffff',
    boxShadow: `0 10px 20px -5px ${accentColor}60`,
  };

  return (
    <div style={containerStyle} className="w-full">
      <h3 style={{ color: primaryColor }} className="text-lg font-black mb-6 tracking-tight">{content.title}</h3>
      <div className="space-y-4">
        {content.fields?.map((f: any, i: number) => (
          <div key={i}>
            <label style={{ color: mutedColor }} className="text-[10px] font-bold uppercase tracking-widest mb-2 block ml-1">{f.label}</label>
            <input 
              type={f.type} 
              placeholder={f.placeholder}
              style={inputStyle}
              className="w-full rounded-2xl px-4 py-4 text-sm transition-all outline-none shadow-sm focus:ring-2 focus:ring-opacity-50 placeholder:opacity-50"
            />
          </div>
        ))}
        <button 
          style={buttonStyle}
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
        >
          {content.buttonText || 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default FormBlock;
