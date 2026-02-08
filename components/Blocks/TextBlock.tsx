
import React from 'react';
import { Block } from '../../types';

interface TextBlockProps {
  block: Block;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const { content = {}, styles = {} } = block;
  
  const inlineStyles: React.CSSProperties = {
    fontSize: styles.fontSize ? `${styles.fontSize}px` : 'inherit',
    fontWeight: styles.fontWeight || 'normal',
    textAlign: styles.textAlign || 'left',
    color: styles.color || '#000000',
    backgroundColor: styles.backgroundColor || 'transparent',
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : '0',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    minHeight: '1.2em',
    display: 'block',
    width: '100%'
  };

  const Tag = (content.tag || 'p') as any;
  const hasContent = content.text && content.text.trim().length > 0;

  return (
    <div className="w-full">
      <Tag style={inlineStyles}>
        {hasContent ? content.text : (
          <span className="opacity-30">{content.placeholder || 'Add text here'}</span>
        )}
      </Tag>
    </div>
  );
};

export default TextBlock;
