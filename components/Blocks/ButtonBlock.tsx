
import React, { useMemo } from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';

interface ButtonBlockProps {
  block: Block;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ block }) => {
  const { content, styles } = block;
  const { viewport } = useStore();

  // Resolve responsive styles
  const activeStyles = useMemo(() => {
    // Base mobile styles
    let final = { ...styles };

    // Apply tablet overrides
    if ((viewport === 'tablet' || viewport === 'desktop') && styles.tablet) {
       final = { ...final, ...styles.tablet, 
          padding: { ...final.padding, ...styles.tablet.padding },
          margin: { ...final.margin, ...styles.tablet.margin },
          cornerRadii: { ...final.cornerRadii, ...styles.tablet.cornerRadii }
       };
    }

    // Apply desktop overrides
    if (viewport === 'desktop' && styles.desktop) {
       final = { ...final, ...styles.desktop,
          padding: { ...final.padding, ...styles.desktop.padding },
          margin: { ...final.margin, ...styles.desktop.margin },
          cornerRadii: { ...final.cornerRadii, ...styles.desktop.cornerRadii }
       };
    }
    return final;
  }, [styles, viewport]);
  
  // Wrapper controls positioning (Margin + Text Align)
  const wrapperStyle: React.CSSProperties = {
    textAlign: activeStyles.textAlign || 'center',
    marginTop: activeStyles.margin?.top !== undefined ? `${activeStyles.margin.top}px` : '0px',
    marginBottom: activeStyles.margin?.bottom !== undefined ? `${activeStyles.margin.bottom}px` : '0px',
    marginLeft: activeStyles.margin?.left !== undefined ? `${activeStyles.margin.left}px` : '0px',
    marginRight: activeStyles.margin?.right !== undefined ? `${activeStyles.margin.right}px` : '0px',
  };

  // Button controls appearance (Padding = Size, Color, Radius)
  const buttonStyle: React.CSSProperties = {
    backgroundColor: activeStyles.backgroundColor || '#FF7575',
    color: activeStyles.color || '#ffffff',
    fontSize: activeStyles.fontSize ? `${activeStyles.fontSize}px` : '16px',
    fontWeight: activeStyles.fontWeight || '600',
    
    // Border Radius Logic: Prefer granular cornerRadii, fallback to generic borderRadius, default to 8px
    borderTopLeftRadius: activeStyles.cornerRadii?.topLeft !== undefined ? `${activeStyles.cornerRadii.topLeft}px` : (activeStyles.borderRadius ? `${activeStyles.borderRadius}px` : '8px'),
    borderTopRightRadius: activeStyles.cornerRadii?.topRight !== undefined ? `${activeStyles.cornerRadii.topRight}px` : (activeStyles.borderRadius ? `${activeStyles.borderRadius}px` : '8px'),
    borderBottomRightRadius: activeStyles.cornerRadii?.bottomRight !== undefined ? `${activeStyles.cornerRadii.bottomRight}px` : (activeStyles.borderRadius ? `${activeStyles.borderRadius}px` : '8px'),
    borderBottomLeftRadius: activeStyles.cornerRadii?.bottomLeft !== undefined ? `${activeStyles.cornerRadii.bottomLeft}px` : (activeStyles.borderRadius ? `${activeStyles.borderRadius}px` : '8px'),

    // Padding controls the size of the button
    paddingTop: activeStyles.padding?.top !== undefined ? `${activeStyles.padding.top}px` : '12px',
    paddingBottom: activeStyles.padding?.bottom !== undefined ? `${activeStyles.padding.bottom}px` : '12px',
    paddingLeft: activeStyles.padding?.left !== undefined ? `${activeStyles.padding.left}px` : '24px',
    paddingRight: activeStyles.padding?.right !== undefined ? `${activeStyles.padding.right}px` : '24px',

    display: 'inline-block',
    transition: 'all 0.2s ease',
    boxShadow: activeStyles.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1.5,
    textDecoration: 'none'
  };

  const hasLink = content.link && content.link !== '#';

  if (hasLink) {
      return (
        <div style={wrapperStyle} className="w-full">
            <a href={content.link} style={buttonStyle} className="active:scale-95 inline-block" onClick={(e) => e.preventDefault()}>
                {content.text || 'Button'}
            </a>
        </div>
      )
  }

  return (
    <div style={wrapperStyle} className="w-full">
      <button style={buttonStyle} className="active:scale-95">
        {content.text || 'Button'}
      </button>
    </div>
  );
};

export default ButtonBlock;
