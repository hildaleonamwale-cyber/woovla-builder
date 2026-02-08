
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, Trash2, Copy, Layers, Layout as LayoutIcon, Type as TypeIcon, 
  ChevronUp, ChevronDown, Check, Image as ImageIcon, ShoppingBag, 
  Calendar as CalendarIcon, FileText, Monitor, Smartphone, Tablet, 
  Menu, AlignRight, Grid, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Link,
  Undo2, Redo2, SlidersHorizontal, Settings2, Unlink, BoxSelect,
  MoreHorizontal, MoreVertical, CircleDot, Palette, PaintBucket, Laptop
} from 'lucide-react';
import { ViewportMode } from '../../types';

interface InputLabelProps {
  children?: React.ReactNode;
}

const InputLabel = ({ children }: InputLabelProps) => (
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">{children}</label>
);

interface SpacingInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  allowNegative?: boolean;
}

const SpacingInput = ({ label, value, onChange, allowNegative = false }: SpacingInputProps) => (
  <div 
    className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-xl group hover:border-[#FF7575]/30 transition-colors"
    onClick={(e) => e.stopPropagation()}
  >
    <span className="text-[9px] font-black text-slate-300 uppercase ml-1">{label}</span>
    <div className="flex items-center gap-1.5">
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-8 bg-transparent text-[11px] text-center font-black text-slate-700 outline-none placeholder:text-slate-300 appearance-none"
      />
      <div className="flex flex-col">
        <button onClick={(e) => { e.stopPropagation(); onChange(value + 1); }} className="text-slate-300 hover:text-[#FF7575] leading-none"><ChevronUp size={10} /></button>
        <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                const newValue = value - 1;
                if (!allowNegative && newValue < 0) return;
                onChange(newValue); 
            }} 
            className="text-slate-300 hover:text-[#FF7575] leading-none"
        >
            <ChevronDown size={10} />
        </button>
      </div>
    </div>
  </div>
);

const ContextualModal: React.FC = () => {
  const { 
    selectedBlockId, blocks, headerBlocks, footerBlocks, offCanvasBlocks,
    updateBlock, deleteBlock, 
    duplicateBlock, selectBlock, persistToSupabase, 
    viewport, setViewport, reorderBlocks, editingMode
  } = useStore();

  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content');
  const [position, setPosition] = useState({ top: 0, left: 0, width: 266 });
  
  // Linking states
  const [radiusLinked, setRadiusLinked] = useState(true);
  const [paddingLinked, setPaddingLinked] = useState(true); // For internal padding (Button)
  const [layoutPaddingLinked, setLayoutPaddingLinked] = useState(true); // For wrapper padding
  const [marginLinked, setMarginLinked] = useState(true);
  
  // Device Dropdown State
  const [activeDeviceDropdown, setActiveDeviceDropdown] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  
  const currentList = useMemo(() => {
    if (editingMode === 'header') return headerBlocks;
    if (editingMode === 'footer') return footerBlocks;
    if (editingMode === 'offcanvas') return offCanvasBlocks;
    return blocks;
  }, [blocks, headerBlocks, footerBlocks, offCanvasBlocks, editingMode]);

  const block = useMemo(() => currentList.find(b => b.id === selectedBlockId), [currentList, selectedBlockId]);
  
  const currentIndex = currentList.findIndex(b => b?.id === block?.id);
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < currentList.length - 1;

  useEffect(() => {
    const updatePosition = () => {
      if (selectedBlockId) {
        const element = document.getElementById(selectedBlockId);
        if (element && modalRef.current) {
          const rect = element.getBoundingClientRect();
          const modalEl = modalRef.current;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          const preferredWidth = Math.min(Math.max(viewportWidth * 0.49, 238), 280);
          const modalHeight = modalEl.offsetHeight || 450;
          
          let top = rect.bottom + 12;
          let left = rect.left + (rect.width / 2) - (preferredWidth / 2);

          if (top + modalHeight > viewportHeight - 16) {
            const topAbove = rect.top - modalHeight - 12;
            if (topAbove > 16) {
              top = topAbove;
            } else {
              top = Math.max(16, viewportHeight - modalHeight - 16);
            }
          }

          left = Math.max(16, Math.min(viewportWidth - preferredWidth - 16, left));
          
          setPosition({ top, left, width: preferredWidth });
        }
      }
    };

    updatePosition();
    const timeoutId = setTimeout(updatePosition, 10);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [selectedBlockId, activeTab, block?.type, block?.styles, viewport]);

  if (!block) return null;

  // --- Helpers for Responsive Logic ---

  // Update styles for the CURRENT viewport
  const handleUpdateStyle = (key: string, value: any) => {
    if (viewport === 'mobile') {
      updateBlock(block.id, { styles: { ...block.styles, [key]: value } });
    } else {
      const currentOverride = (block.styles as any)[viewport] || {};
      const newOverride = { ...currentOverride, [key]: value };
      updateBlock(block.id, { 
        styles: { 
          ...block.styles, 
          [viewport]: newOverride 
        } 
      });
    }
  };

  const getStyleValue = (key: string, fallback: any) => {
    if (viewport === 'mobile') return (block.styles as any)[key] ?? fallback;
    const override = (block.styles as any)[viewport]?.[key];
    return override ?? (block.styles as any)[key] ?? fallback;
  };
  
  // Nested style updater (e.g. padding.top)
  const handleUpdateStyleNested = (parent: string, key: string, value: any) => {
    const currentParent = getStyleValue(parent, {});
    const newValue = { ...currentParent, [key]: value };
    handleUpdateStyle(parent, newValue);
  };

  const getStyleValueNested = (parent: string, key: string, fallback: any) => {
     const parentObj = getStyleValue(parent, {});
     return parentObj[key] ?? fallback;
  }

  // Content Updates
  const handleUpdateContent = (key: string, value: any) => {
    updateBlock(block.id, { content: { ...block.content, [key]: value } });
  };
  
  const handleUpdateContentNested = (parent: string, key: string, value: any) => {
    const parentObj = block.content[parent] || {};
    updateBlock(block.id, { 
      content: { 
        ...block.content, 
        [parent]: { ...parentObj, [key]: value } 
      } 
    });
  };

  // Visibility
  const handleUpdateVisibility = (key: keyof typeof block.visibility, val: boolean) => {
    updateBlock(block.id, { visibility: { ...block.visibility, [key]: val } });
  };

  // --- Linked Handlers ---

  const handlePadding = (side: string, val: number, isLayoutWrapper: boolean = false) => {
    const linkedState = isLayoutWrapper ? layoutPaddingLinked : paddingLinked;
    const current = getStyleValue('padding', { top: 0, right: 0, bottom: 0, left: 0 });
    let newValue;
    if (linkedState) {
      newValue = { top: val, right: val, bottom: val, left: val };
    } else {
      newValue = { ...current, [side]: val };
    }
    handleUpdateStyle('padding', newValue);
  };

  const handleMargin = (side: string, val: number) => {
    const current = getStyleValue('margin', { top: 0, right: 0, bottom: 0, left: 0 });
    let newValue;
    if (marginLinked) {
      newValue = { top: val, right: val, bottom: val, left: val };
    } else {
      newValue = { ...current, [side]: val };
    }
    handleUpdateStyle('margin', newValue);
  };

  const handleCornerRadius = (corner: string, val: number) => {
    const current = getStyleValue('cornerRadii', { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 });
    let newValue;
    if (radiusLinked) {
      newValue = { topLeft: val, topRight: val, bottomRight: val, bottomLeft: val };
    } else {
      newValue = { ...current, [corner]: val };
    }
    handleUpdateStyle('cornerRadii', newValue);
  };

  const handleMoveUp = (e: React.MouseEvent) => { e.stopPropagation(); if (canMoveUp) reorderBlocks(currentIndex, currentIndex - 1); };
  const handleMoveDown = (e: React.MouseEvent) => { e.stopPropagation(); if (canMoveDown) reorderBlocks(currentIndex, currentIndex + 1); };
  const handleSave = (e: React.MouseEvent) => { e.stopPropagation(); persistToSupabase(); selectBlock(null); };

  const getIcon = () => {
    switch (block.type) {
      case 'text': return <TypeIcon size={14} />;
      case 'heading': return <BoxSelect size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'header': return <LayoutIcon size={14} />;
      case 'button': return <Smartphone size={14} />;
      case 'navigation': return <Menu size={14} />;
      case 'booking': return <CalendarIcon size={14} />;
      default: return <Layers size={14} />;
    }
  };
  
  const getNavLabel = () => {
     if (viewport === 'desktop') return 'Desktop Menu';
     const showOnTablet = block.content.showHamburgerOnTablet !== false;
     if (viewport === 'tablet' && !showOnTablet) return 'Tablet Menu Links';
     return 'Mobile Icon';
  };
  const isHamburgerMode = block.type === 'navigation' && getNavLabel().includes('Icon');

  // --- Responsive Toggle Components ---
  
  const DeviceSelector = ({ id }: { id: string }) => {
    const Icon = viewport === 'mobile' ? Smartphone : viewport === 'tablet' ? Tablet : Monitor;
    return (
        <div className="relative">
             <button 
                onClick={(e) => { e.stopPropagation(); setActiveDeviceDropdown(activeDeviceDropdown === id ? null : id); }}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-[#FF7575] hover:bg-[#FF7575]/10 transition-all flex items-center gap-1"
            >
                <Icon size={12} />
            </button>
            {activeDeviceDropdown === id && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 flex flex-col gap-1 min-w-[100px] animate-in fade-in zoom-in-95">
                    {[
                        { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
                        { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                        { mode: 'desktop', icon: Monitor, label: 'Desktop' }
                    ].map((d) => (
                        <button
                            key={d.mode}
                            onClick={(e) => {
                                e.stopPropagation();
                                setViewport(d.mode as ViewportMode);
                                setActiveDeviceDropdown(null);
                            }}
                            className={`flex items-center gap-2 p-2 rounded-lg text-[10px] font-bold uppercase tracking-wide ${viewport === d.mode ? 'bg-[#FF7575] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <d.icon size={12} /> {d.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const ResponsiveToggle = ({ id, isLinked, onLinkToggle }: { id: string, isLinked: boolean, onLinkToggle: () => void }) => {
    return (
        <div className="flex items-center gap-1">
            <DeviceSelector id={id} />
            <button 
                onClick={(e) => { e.stopPropagation(); onLinkToggle(); }}
                className={`p-1.5 rounded-lg transition-all ${isLinked ? 'bg-[#FF7575] text-white shadow-lg shadow-[#FF7575]/20' : 'bg-slate-100 text-slate-400'}`}
            >
                {isLinked ? <Link size={12} /> : <Unlink size={12} />}
            </button>
        </div>
    );
  };

  return (
    <div 
      ref={modalRef}
      style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }}
      className="fixed z-[1000] glass-effect rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-white/60 flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out max-h-[70vh] pointer-events-auto overflow-visible"
      onClick={(e) => {
         e.stopPropagation();
         if (activeDeviceDropdown) setActiveDeviceDropdown(null);
      }}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100/50 bg-white/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#FF7575] text-white rounded-lg shadow-lg shadow-[#FF7575]/20">
            {getIcon()}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black text-slate-800 capitalize tracking-tight truncate block">{block.type}</span>
            <div className="text-[7px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Edit</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={handleMoveUp} disabled={!canMoveUp} className={`p-1.5 rounded-lg transition-all ${canMoveUp ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-200'}`}><ArrowUp size={14} /></button>
          <button onClick={handleMoveDown} disabled={!canMoveDown} className={`p-1.5 rounded-lg transition-all ${canMoveDown ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-200'}`}><ArrowDown size={14} /></button>
          <div className="w-px h-3 bg-slate-100 mx-0.5" />
          <button onClick={() => duplicateBlock(block.id)} className="p-1.5 text-slate-400 hover:text-[#FF7575] hover:bg-slate-50 rounded-lg transition-all"><Copy size={14} /></button>
          <button onClick={() => deleteBlock(block.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
          <button onClick={() => selectBlock(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all ml-0.5"><X size={16} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 gap-1 bg-slate-50/80 mx-4 mt-4 rounded-xl">
        {(['content', 'style', 'layout'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#FF7575]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Body */}
      <div className="p-5 flex-1 overflow-y-auto no-scrollbar overscroll-contain">
        
        {/* Helper to show viewport context inside tabs */}
        {activeTab === 'style' && block.type === 'navigation' && (
          <div className="mb-4 flex justify-center pb-2 border-b border-slate-100/50">
             <div className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
               Editing: <span className="text-[#FF7575] ml-1">{getNavLabel()}</span>
             </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* TEXT / HEADING */}
            {(block.type === 'text' || block.type === 'heading') && (
              <div className="space-y-4">
                <div>
                  <InputLabel>Content</InputLabel>
                  <textarea 
                    value={block.content.text || ''}
                    onChange={(e) => handleUpdateContent('text', e.target.value)}
                    placeholder={block.content.placeholder || 'Type here...'}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-base text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#FF7575] transition-all min-h-[120px] resize-none outline-none shadow-inner"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Palette size={10} /> Text Color</span>
                   <input 
                    type="color" 
                    value={getStyleValue('color', '#000000')} 
                    onChange={(e) => handleUpdateStyle('color', e.target.value)}
                    className="w-6 h-6 rounded-full cursor-pointer border-2 border-white shadow-md appearance-none bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* BUTTON CONTENT */}
            {block.type === 'button' && (
              <div className="space-y-4">
                  <div>
                      <InputLabel>Label</InputLabel>
                      <input 
                        type="text"
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateContent('text', e.target.value)}
                        placeholder="Button Text"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF7575]"
                      />
                  </div>
                  <div>
                      <InputLabel>Destination URL</InputLabel>
                      <input 
                        type="text"
                        value={block.content.link || ''}
                        onChange={(e) => handleUpdateContent('link', e.target.value)}
                        placeholder="https://"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF7575]"
                      />
                  </div>
              </div>
            )}

            {/* LAYOUT CONTENT */}
            {block.type === 'layout' && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <InputLabel>Columns</InputLabel>
                     <span className="text-[10px] font-black text-[#FF7575]">{block.content.columns || 2}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <input 
                        type="range" min="1" max="6"
                        value={block.content.columns || 2}
                        onChange={(e) => handleUpdateContent('columns', parseInt(e.target.value))}
                        className="w-full accent-[#FF7575]"
                     />
                     <div className="flex justify-between mt-2 px-1">
                        <span className="text-[8px] font-bold text-slate-300">1</span>
                        <span className="text-[8px] font-bold text-slate-300">6</span>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <InputLabel>Gap (px)</InputLabel>
                    <SpacingInput label="Gap" value={getStyleValue('gap', 20)} onChange={(v:any) => handleUpdateStyle('gap', v)} />
                  </div>
              </div>
            )}

            {/* IMAGE URL */}
            {block.type === 'image' && (
              <div className="space-y-4">
                <InputLabel>Source Image</InputLabel>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                   <input 
                      type="text"
                      value={block.content.url || ''}
                      onChange={(e) => handleUpdateContent('url', e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF7575]"
                      placeholder="Paste image URL here"
                    />
                </div>
              </div>
            )}
            
            {/* BOOKING */}
            {block.type === 'booking' && (
               <div className="space-y-4">
                  <div>
                    <InputLabel>Heading</InputLabel>
                    <input 
                      type="text"
                      value={block.content.heading || ''}
                      placeholder="Schedule a Call"
                      onChange={(e) => handleUpdateContent('heading', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#FF7575]"
                    />
                  </div>
               </div>
            )}

            {/* NAVIGATION */}
            {block.type === 'navigation' && (
              <div className="space-y-6">
                 <div>
                    <InputLabel>Menu Behavior</InputLabel>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-600">Hamburger on Tablet</span>
                       <button 
                         onClick={() => handleUpdateContent('showHamburgerOnTablet', !(block.content.showHamburgerOnTablet !== false))}
                         className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${block.content.showHamburgerOnTablet !== false ? 'bg-[#FF7575]' : 'bg-slate-200'}`}
                       >
                         <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${block.content.showHamburgerOnTablet !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                       </button>
                    </div>
                 </div>

                 {isHamburgerMode ? (
                   <div>
                      <InputLabel>Hamburger Icon</InputLabel>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                          {['Menu', 'Grid', 'AlignRight', 'MoreHorizontal', 'MoreVertical', 'CircleDot'].map((icon) => (
                              <button 
                              key={icon}
                              onClick={() => handleUpdateContentNested('hamburger', 'icon', icon)}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${block.content.hamburger?.icon === icon ? 'bg-white border-[#FF7575] text-[#FF7575] shadow-sm' : 'border-slate-200 text-slate-400 hover:bg-white'}`}
                              >
                              <span className="text-[8px] font-black uppercase">{icon.replace(/([A-Z])/g, ' $1').trim()}</span>
                              </button>
                          ))}
                          </div>
                      </div>
                   </div>
                 ) : (
                   <div>
                      <InputLabel>Navigation Links</InputLabel>
                      <div className="space-y-2">
                          {block.content.links?.map((link: any, i: number) => (
                              <div key={i} className="flex gap-2">
                                  <input 
                                      value={link.label}
                                      onChange={(e) => {
                                          const newLinks = [...block.content.links];
                                          newLinks[i] = { ...newLinks[i], label: e.target.value };
                                          handleUpdateContent('links', newLinks);
                                      }}
                                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-base"
                                      placeholder="Label"
                                  />
                                  <input 
                                      value={link.url}
                                      onChange={(e) => {
                                          const newLinks = [...block.content.links];
                                          newLinks[i] = { ...newLinks[i], url: e.target.value };
                                          handleUpdateContent('links', newLinks);
                                      }}
                                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-base"
                                      placeholder="#"
                                  />
                              </div>
                          ))}
                          <button 
                              onClick={() => {
                                  const newLinks = [...(block.content.links || []), { label: 'New Link', url: '#' }];
                                  handleUpdateContent('links', newLinks);
                              }}
                              className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200"
                          >
                              + Add Link
                          </button>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-8">
            
            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase mb-3">
                        {block.type === 'navigation' ? (isHamburgerMode ? 'Icon Color' : 'Link Color') : 'Color'}
                    </span>
                    <input 
                    type="color" 
                    value={getStyleValue('color', '#000000')} 
                    onChange={(e) => handleUpdateStyle('color', e.target.value)}
                    className="w-12 h-12 rounded-full cursor-pointer border-4 border-white shadow-xl appearance-none bg-transparent"
                    />
                </div>
                
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-black uppercase mb-3">BG Color</span>
                    <input 
                    type="color" 
                    value={getStyleValue('backgroundColor', 'transparent')} 
                    onChange={(e) => handleUpdateStyle('backgroundColor', e.target.value)}
                    className="w-12 h-12 rounded-full cursor-pointer border-4 border-white shadow-xl appearance-none bg-transparent"
                    />
                </div>
            </div>

            {/* Size / Alignment / Button Padding */}
            {!['booking', 'form', 'ecommerce', 'carousel'].includes(block.type) && (
                <div className="space-y-4">
                    
                    {/* Size Control (Text, Headings, Icons) - Numeric Input + Device Selector */}
                    {block.type !== 'button' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <InputLabel>
                                    {block.type === 'navigation' ? (isHamburgerMode ? 'Icon Size' : 'Link Size') : 'Size'}
                                </InputLabel>
                                <DeviceSelector id="fontSize" />
                            </div>
                            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <div className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-xl group hover:border-[#FF7575]/30 transition-colors">
                                    <span className="text-[9px] font-black text-slate-300 uppercase ml-1">Pixels</span>
                                    <div className="flex items-center gap-1.5">
                                        <input 
                                            type="number" 
                                            value={getStyleValue('fontSize', 16)}
                                            onChange={(e) => handleUpdateStyle('fontSize', parseInt(e.target.value) || 0)}
                                            className="w-12 bg-transparent text-[11px] text-center font-black text-slate-700 outline-none placeholder:text-slate-300 appearance-none"
                                        />
                                        <div className="flex flex-col">
                                            <button onClick={() => handleUpdateStyle('fontSize', (getStyleValue('fontSize', 16) as number) + 1)} className="text-slate-300 hover:text-[#FF7575] leading-none"><ChevronUp size={10} /></button>
                                            <button onClick={() => handleUpdateStyle('fontSize', Math.max(0, (getStyleValue('fontSize', 16) as number) - 1))} className="text-slate-300 hover:text-[#FF7575] leading-none"><ChevronDown size={10} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alignment (Available for Button too) */}
                    {block.type !== 'navigation' && (
                        <div className="flex bg-white rounded-xl p-1 shadow-sm gap-1 border border-slate-100">
                        {['left', 'center', 'right'].map((align) => (
                            <button 
                            key={align}
                            onClick={() => handleUpdateStyle('textAlign', align)}
                            className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${getStyleValue('textAlign', 'left') === align ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                            {align}
                            </button>
                        ))}
                        </div>
                    )}
                    
                    {/* Internal Padding for Button (Controls Size) */}
                    {block.type === 'button' && (
                        <div className="space-y-4 pt-4 border-t border-slate-100/50">
                            <div className="flex items-center justify-between">
                                <InputLabel>Button Size (Padding)</InputLabel>
                                <ResponsiveToggle id="btnPadding" isLinked={paddingLinked} onLinkToggle={() => setPaddingLinked(!paddingLinked)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <SpacingInput label="Top" value={getStyleValueNested('padding', 'top', 12)} onChange={(v:any) => handlePadding('top', v, false)} />
                                <SpacingInput label="Bottom" value={getStyleValueNested('padding', 'bottom', 12)} onChange={(v:any) => handlePadding('bottom', v, false)} />
                                <SpacingInput label="Left" value={getStyleValueNested('padding', 'left', 24)} onChange={(v:any) => handlePadding('left', v, false)} />
                                <SpacingInput label="Right" value={getStyleValueNested('padding', 'right', 24)} onChange={(v:any) => handlePadding('right', v, false)} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Corner Radius */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <InputLabel>Corner Radius</InputLabel>
                <ResponsiveToggle id="radius" isLinked={radiusLinked} onLinkToggle={() => setRadiusLinked(!radiusLinked)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SpacingInput label="TL" value={getStyleValueNested('cornerRadii', 'topLeft', 0)} onChange={(v:any) => handleCornerRadius('topLeft', v)} />
                <SpacingInput label="TR" value={getStyleValueNested('cornerRadii', 'topRight', 0)} onChange={(v:any) => handleCornerRadius('topRight', v)} />
                <SpacingInput label="BR" value={getStyleValueNested('cornerRadii', 'bottomRight', 0)} onChange={(v:any) => handleCornerRadius('bottomRight', v)} />
                <SpacingInput label="BL" value={getStyleValueNested('cornerRadii', 'bottomLeft', 0)} onChange={(v:any) => handleCornerRadius('bottomLeft', v)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-8">
             <div className="space-y-4">
              <InputLabel>Device Visibility</InputLabel>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'mobile', icon: Smartphone, label: 'Mob' },
                  { key: 'tablet', icon: Tablet, label: 'Tab' },
                  { key: 'desktop', icon: Monitor, label: 'Desk' }
                ].map(({ key, icon: Icon, label }) => (
                  <button 
                    key={key}
                    onClick={() => handleUpdateVisibility(key as any, !block.visibility?.[key as keyof typeof block.visibility])}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${block.visibility?.[key as keyof typeof block.visibility] ? 'bg-[#FF7575]/10 border-[#FF7575] text-[#FF7575] shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                  >
                    <Icon size={16} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Padding - Only for non-button blocks, or as wrapper padding if needed. 
                For Buttons, we used internal padding in Style tab. 
                We'll hide this for buttons to avoid confusion between "wrapper padding" and "button padding".
            */}
            {block.type !== 'button' && (
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <InputLabel>Padding</InputLabel>
                    <ResponsiveToggle id="layoutPadding" isLinked={layoutPaddingLinked} onLinkToggle={() => setLayoutPaddingLinked(!layoutPaddingLinked)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <SpacingInput label="Top" value={getStyleValueNested('padding', 'top', 0)} onChange={(v:any) => handlePadding('top', v, true)} />
                    <SpacingInput label="Bottom" value={getStyleValueNested('padding', 'bottom', 0)} onChange={(v:any) => handlePadding('bottom', v, true)} />
                    <SpacingInput label="Left" value={getStyleValueNested('padding', 'left', 0)} onChange={(v:any) => handlePadding('left', v, true)} />
                    <SpacingInput label="Right" value={getStyleValueNested('padding', 'right', 0)} onChange={(v:any) => handlePadding('right', v, true)} />
                </div>
                </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <InputLabel>Margin</InputLabel>
                <ResponsiveToggle id="margin" isLinked={marginLinked} onLinkToggle={() => setMarginLinked(!marginLinked)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Allow Negative margins */}
                <SpacingInput label="Top" value={getStyleValueNested('margin', 'top', 0)} onChange={(v:any) => handleMargin('top', v)} allowNegative />
                <SpacingInput label="Bottom" value={getStyleValueNested('margin', 'bottom', 0)} onChange={(v:any) => handleMargin('bottom', v)} allowNegative />
                <SpacingInput label="Left" value={getStyleValueNested('margin', 'left', 0)} onChange={(v:any) => handleMargin('left', v)} allowNegative />
                <SpacingInput label="Right" value={getStyleValueNested('margin', 'right', 0)} onChange={(v:any) => handleMargin('right', v)} allowNegative />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/60 border-t border-slate-100/50">
        <button 
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[2px] shadow-xl shadow-slate-200 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check size={16} strokeWidth={3} /> Save
        </button>
      </div>
    </div>
  );
};

export default ContextualModal;
