
import React from 'react';
import { Block } from '../../types';

interface HeadingBlockProps {
  block: Block;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
  const { content = {}, styles = {} } = block;
  
  const inlineStyles: React.CSSProperties = {
    fontSize: styles.fontSize ? `${styles.fontSize}px` : '32px',
    fontWeight: styles.fontWeight || '700',
    textAlign: styles.textAlign || 'left',
    color: styles.color || '#000000',
    backgroundColor: styles.backgroundColor || 'transparent',
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '20px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '20px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0',
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : '0',
    lineHeight: '1', // Snug line-height
    wordBreak: 'break-word',
    minHeight: '1em', // Match line-height
    display: 'block', 
    width: '100%'
  };

  const Tag = (content.tag || 'h2') as any;
  const hasContent = content.text && content.text.trim().length > 0;

  return (
    <div className="w-full">
      <Tag style={inlineStyles}>
        {hasContent ? content.text : (
          <span className="opacity-30">{content.placeholder || 'Heading'}</span>
        )}
      </Tag>
    </div>
  );
};

export default HeadingBlock;
