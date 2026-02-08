
import React, { useMemo } from 'react';
import { Block } from '../../types';
import { useStore } from '../../store/useStore';
import { Menu, X, AlignRight, Grid, User, Search, ShoppingBag, MoreHorizontal, MoreVertical, CircleDot } from 'lucide-react';
import BlockRenderer from '../Editor/BlockRenderer';

interface NavigationBlockProps {
  block: Block;
}

const ICON_MAP: Record<string, any> = {
  Menu, AlignRight, Grid, User, Search, ShoppingBag, MoreHorizontal, MoreVertical, CircleDot
};

const NavigationBlock: React.FC<NavigationBlockProps> = ({ block }) => {
  const { content } = block;
  const { updateBlock, viewport, offCanvasBlocks, selectBlock, editingMode } = useStore();
  
  const navContent = content || { links: [] };
  const hamburgerContent = navContent.hamburger || { icon: 'Menu', drawer: {} };
  const drawerSettings = hamburgerContent.drawer || { isOpen: false, backgroundColor: '#ffffff' };
  
  // Default: Show hamburger on tablet too
  const showHamburgerOnTablet = navContent.showHamburgerOnTablet !== false; 
  
  const isHamburgerView = viewport === 'mobile' || (viewport === 'tablet' && showHamburgerOnTablet);

  // Resolve styles based on active viewport
  const styles = useMemo(() => {
    // Basic fallback logic for styles
    if (viewport === 'mobile') return block.styles;
    
    // For tablet/desktop, merge overrides
    const override = (block.styles as any)[viewport] || {};
    return { ...block.styles, ...override };
  }, [block.styles, viewport]);

  
  const HamburgerIcon = ICON_MAP[hamburgerContent.icon] || Menu;

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  };

  const toggleDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Do not toggle drawer if we are editing the header itself, 
    // as we want to focus on editing the bar, not the drawer (which has its own mode)
    if (editingMode === 'header') {
        selectBlock(block.id);
        return;
    }

    updateBlock(block.id, {
      content: {
        ...content,
        hamburger: {
          ...hamburgerContent,
          drawer: {
            ...drawerSettings,
            isOpen: !drawerSettings.isOpen
          }
        }
      }
    });
  };

  const getDrawerTransform = () => {
    if (!drawerSettings.isOpen) return 'translateX(100%)';
    return 'translate(0)';
  };

  // Desktop/Tablet Links Container Style
  const navStyle: React.CSSProperties = {
     paddingTop: styles.padding?.top ? `${styles.padding.top}px` : '0',
     paddingBottom: styles.padding?.bottom ? `${styles.padding.bottom}px` : '0',
     paddingLeft: styles.padding?.left ? `${styles.padding.left}px` : '0',
     paddingRight: styles.padding?.right ? `${styles.padding.right}px` : '0',
     gap: styles.gap ? `${styles.gap}px` : '24px',
     alignItems: 'center', // Ensure links are centered in the nav container
     lineHeight: 1, // Reset line height for container
     display: 'flex', // Always flex, conditional rendering handles visibility
  };

  // Mobile Hamburger Button Style
  const buttonStyle: React.CSSProperties = {
    color: styles.color || '#64748B',
    backgroundColor: styles.backgroundColor || 'transparent',
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '8px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '8px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '8px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '8px',
    borderTopLeftRadius: styles.cornerRadii?.topLeft !== undefined ? `${styles.cornerRadii.topLeft}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '12px'),
    borderTopRightRadius: styles.cornerRadii?.topRight !== undefined ? `${styles.cornerRadii.topRight}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '12px'),
    borderBottomRightRadius: styles.cornerRadii?.bottomRight !== undefined ? `${styles.cornerRadii.bottomRight}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '12px'),
    borderBottomLeftRadius: styles.cornerRadii?.bottomLeft !== undefined ? `${styles.cornerRadii.bottomLeft}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '12px'),
    lineHeight: 1,
    display: 'flex',
  };

  const iconSize = styles.fontSize || 24;

  return (
    <div className="flex items-center justify-end leading-none">
      {/* Desktop/Tablet Links - Render only if NOT hamburger view */}
      {!isHamburgerView && (
        <nav 
            className="items-center"
            style={navStyle}
        >
            {navContent.links?.map((link: any, i: number) => (
            <a 
                key={i} 
                href={link.url} 
                className="font-black uppercase tracking-widest hover:text-[#FF7575] transition-colors block"
                style={{ 
                    color: styles.color || '#334155',
                    fontSize: styles.fontSize ? `${styles.fontSize}px` : '10px',
                    fontWeight: styles.fontWeight || '700',
                    lineHeight: 1, // Enforce snug line-height
                }}
            >
                {link.label}
            </a>
            ))}
        </nav>
      )}

      {/* Mobile/Tablet Hamburger - Render only IF hamburger view */}
      {isHamburgerView && (
        <div>
            <button 
            onClick={handleIconClick}
            style={buttonStyle}
            className="hover:opacity-80 transition-all items-center justify-center"
            >
            <HamburgerIcon size={iconSize} />
            </button>
        </div>
      )}

      {/* Drawer Overlay - Only render if NOT editing header template, to keep builder clean */}
      {editingMode !== 'header' && (
          <div 
            className={`fixed inset-0 z-[120] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${drawerSettings.isOpen ? 'visible' : 'invisible'}`}
            onClick={toggleDrawer}
          >
            <div className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${drawerSettings.isOpen ? 'opacity-100' : 'opacity-0'}`} />
            
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{ 
                transform: getDrawerTransform(),
                backgroundColor: drawerSettings.backgroundColor || 'white',
                right: 0,
                width: '85%',
                height: '100%'
              }}
              className="absolute top-0 shadow-2xl flex flex-col transition-transform duration-500 overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-end p-6">
                <button onClick={toggleDrawer} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col px-6 pb-12">
                {offCanvasBlocks.map((b) => (
                  <BlockRenderer key={b.id} block={b} />
                ))}
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default NavigationBlock;
