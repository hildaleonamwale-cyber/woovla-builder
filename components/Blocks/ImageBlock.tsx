
import React from 'react';
import { Block } from '../../types';
import { Image as ImageIcon } from 'lucide-react';

const ImageBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;
  
  const style: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    width: '100%',
    display: 'flex',
    justifyContent: styles.textAlign === 'center' ? 'center' : styles.textAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  const imgStyle: React.CSSProperties = {
    borderRadius: `${styles.borderRadius || 0}px`,
    width: styles.width || '100%',
    height: styles.height || 'auto',
    aspectRatio: styles.aspectRatio || 'auto',
    objectFit: styles.objectFit || 'cover',
    boxShadow: styles.shadow === 'md' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
  };

  return (
    <div style={style}>
      {content.url ? (
        <img src={content.url} alt={content.alt} style={imgStyle} className="max-w-full" />
      ) : (
        <div className="w-full aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 text-slate-400">
          <ImageIcon size={32} strokeWidth={1.5} />
          <span className="text-[10px] font-black uppercase tracking-widest mt-2">No image selected</span>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
