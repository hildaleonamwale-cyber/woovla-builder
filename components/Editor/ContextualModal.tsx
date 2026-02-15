
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, Trash2, Copy, Layers, Layout as LayoutIcon, Type as TypeIcon, 
  ChevronUp, ChevronDown, Check, Image as ImageIcon, ShoppingBag, 
  Calendar as CalendarIcon, BoxSelect, Monitor, Smartphone, Tablet, 
  Menu, Link, Unlink, ArrowUp, ArrowDown, GalleryHorizontal, Grid
} from 'lucide-react';
import { ViewportMode } from '../../types';

interface InputLabelProps {
  children?: React.ReactNode;
}

const InputLabel = ({ children }: InputLabelProps) => (
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">{children}</label>
);

const DecimalInput = ({ value, onChange, className, ...props }: any) => {
  const [localVal, setLocalVal] = useState<string>(value?.toString() || '');
  
  useEffect(() => {
    const parsedLocal = parseFloat(localVal);
    if (parsedLocal !== value && !(isNaN(parsedLocal) && (value === undefined || value === null))) {
        setLocalVal(value?.toString() || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return <input type="number" step="0.1" className={className} value={localVal} onChange={handleChange} {...props} />;
};

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
  const [position, setPosition] = useState({ top: 0, left: 0, width: 340 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [radiusLinked, setRadiusLinked] = useState(true);
  const [paddingLinked, setPaddingLinked] = useState(true); 
  const [marginLinked, setMarginLinked] = useState(true);
  
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
      setIsMobile(window.innerWidth < 768);
      
      if (selectedBlockId) {
        const element = document.getElementById(selectedBlockId);
        if (element && modalRef.current) {
          const viewportWidth = window.innerWidth;
          
          if (viewportWidth < 768) {
              // Mobile: Handled via CSS classes (fixed positioning)
              setPosition({ top: 0, left: 0, width: viewportWidth });
          } else {
              // Desktop: Floating positioning
              const preferredWidth = Math.min(Math.max(viewportWidth * 0.85, 340), 400); 
              const top = element.offsetTop + element.offsetHeight + 12;
              let left = element.offsetLeft + (element.offsetWidth / 2) - (preferredWidth / 2);
              const canvas = element.offsetParent as HTMLElement;
              if (canvas) {
                   const maxLeft = canvas.offsetWidth - preferredWidth - 16;
                   left = Math.max(16, Math.min(maxLeft, left));
              }
              setPosition({ top, left, width: preferredWidth });
          }
        }
      }
    };

    const rAF = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('resize', updatePosition);
    };
  }, [selectedBlockId, activeTab, block?.type, block?.styles, viewport]);

  if (!block) return null;

  const handleUpdateStyle = (key: string, value: any) => {
    if (viewport === 'mobile') {
      updateBlock(block.id, { styles: { ...block.styles, [key]: value } });
    } else {
      const currentOverride = (block.styles as any)[viewport] || {};
      updateBlock(block.id, { 
        styles: { 
          ...block.styles, 
          [viewport]: { ...currentOverride, [key]: value } 
        } 
      });
    }
  };

  const getStyleValue = (key: string, fallback: any) => {
    if (viewport === 'mobile') return (block.styles as any)[key] ?? fallback;
    const override = (block.styles as any)[viewport]?.[key];
    return override ?? (block.styles as any)[key] ?? fallback;
  };

  const getStyleValueNested = (parent: string, key: string, fallback: any) => {
    const parentObj = getStyleValue(parent, {});
    return parentObj[key] ?? fallback;
  };
  
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

  const handleUpdateVisibility = (key: keyof typeof block.visibility, val: boolean) => {
    updateBlock(block.id, { visibility: { ...block.visibility, [key]: val } });
  };

  const handlePadding = (side: string, val: number) => {
    const current = getStyleValue('padding', { top: 0, right: 0, bottom: 0, left: 0 });
    let newValue;
    if (paddingLinked) {
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
      case 'carousel': return <GalleryHorizontal size={14} />;
      case 'cover': return <GalleryHorizontal size={14} />;
      case 'slot': return <Grid size={14} />;
      default: return <Layers size={14} />;
    }
  };
  
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
    <>
      {/* Mobile Backdrop */}
      {isMobile && <div className="fixed inset-0 bg-black/40 z-[999] backdrop-blur-sm" onClick={() => selectBlock(null)} />}
      
      <div 
        ref={modalRef}
        style={!isMobile ? { top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` } : {}}
        className={`
           z-[1000] bg-white border border-slate-200 flex flex-col animate-in fade-in duration-300 ease-out shadow-[0_40px_100px_rgba(0,0,0,0.25)] pointer-events-auto
           ${isMobile 
              ? 'fixed bottom-0 left-0 right-0 w-full rounded-t-[32px] max-h-[85vh] slide-in-from-bottom-full' 
              : 'absolute rounded-[32px] zoom-in-95 max-h-[70vh]'
           }
        `}
        onClick={(e) => {
          e.stopPropagation();
          if (activeDeviceDropdown) setActiveDeviceDropdown(null);
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF7575] text-white rounded-xl shadow-lg shadow-[#FF7575]/20">
              {getIcon()}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-slate-800 capitalize tracking-tight truncate block">{block.type}</span>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Settings</div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleMoveUp} disabled={!canMoveUp} className={`p-2 rounded-xl transition-all ${canMoveUp ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-200'}`}><ArrowUp size={16} /></button>
            <button onClick={handleMoveDown} disabled={!canMoveDown} className={`p-2 rounded-xl transition-all ${canMoveDown ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-200'}`}><ArrowDown size={16} /></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button onClick={() => duplicateBlock(block.id)} className="p-2 text-slate-400 hover:text-[#FF7575] hover:bg-slate-50 rounded-xl transition-all"><Copy size={16} /></button>
            <button onClick={() => deleteBlock(block.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
            <button onClick={() => selectBlock(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all ml-1"><X size={18} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 gap-1 bg-slate-50 mx-4 mt-4 rounded-xl border border-slate-100">
          {(['content', 'style', 'layout'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#FF7575]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="p-5 flex-1 overflow-y-auto no-scrollbar overscroll-contain">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {block.type === 'cover' && (
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                          <InputLabel>Slots Per View</InputLabel>
                          <DeviceSelector id="slidesPerView" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400">Cards Visible</span>
                            <DecimalInput 
                                min="0.1"
                                value={block.content.settings?.slidesPerView?.[viewport] || (viewport === 'mobile' ? 1.3 : viewport === 'tablet' ? 2.5 : 3.5)}
                                onChange={(val: number) => {
                                  handleUpdateContentNested('settings', 'slidesPerView', {
                                      ...(block.content.settings?.slidesPerView || {}),
                                      [viewport]: val
                                  });
                                }}
                                className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 text-center outline-none focus:border-[#FF7575]"
                            />
                          </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <InputLabel>Show Card Images</InputLabel>
                        <button 
                          onClick={() => handleUpdateContent('showCardImage', !(block.content.showCardImage))}
                          className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${block.content.showCardImage ? 'bg-[#FF7575]' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${block.content.showCardImage ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                  </div>
              )}
              
              {(block.type === 'text' || block.type === 'heading' || block.type === 'button') && (
                <div className="space-y-1">
                  <InputLabel>Text</InputLabel>
                  <textarea 
                    value={block.content.text || ''}
                    onChange={(e) => handleUpdateContent('text', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white min-h-[100px]"
                    placeholder="Enter text..."
                  />
                </div>
              )}

              {block.type === 'image' && (
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <InputLabel>Image URL</InputLabel>
                          <input 
                              value={block.content.url || ''}
                              onChange={(e) => handleUpdateContent('url', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 outline-none focus:border-[#FF7575]"
                              placeholder="https://..."
                          />
                      </div>
                      {block.content.url && (
                          <div className="rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                              <img src={block.content.url} className="w-full h-full object-cover" />
                          </div>
                      )}
                  </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 font-black uppercase mb-3">Color</span>
                      <input 
                        type="color" 
                        value={getStyleValue('color', '#000000')} 
                        onChange={(e) => handleUpdateStyle('color', e.target.value)}
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md appearance-none bg-transparent p-0 overflow-hidden"
                      />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 font-black uppercase mb-3">BG Color</span>
                      <input 
                        type="color" 
                        value={getStyleValue('backgroundColor', 'transparent')} 
                        onChange={(e) => handleUpdateStyle('backgroundColor', e.target.value)}
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md appearance-none bg-transparent p-0 overflow-hidden"
                      />
                  </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <InputLabel>Corner Radius</InputLabel>
                  <ResponsiveToggle id="radius" isLinked={radiusLinked} onLinkToggle={() => setRadiusLinked(!radiusLinked)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SpacingInput label="TL" value={getStyleValueNested('cornerRadii', 'topLeft', 0)} onChange={(v) => handleCornerRadius('topLeft', v)} />
                  <SpacingInput label="TR" value={getStyleValueNested('cornerRadii', 'topRight', 0)} onChange={(v) => handleCornerRadius('topRight', v)} />
                  <SpacingInput label="BR" value={getStyleValueNested('cornerRadii', 'bottomRight', 0)} onChange={(v) => handleCornerRadius('bottomRight', v)} />
                  <SpacingInput label="BL" value={getStyleValueNested('cornerRadii', 'bottomLeft', 0)} onChange={(v) => handleCornerRadius('bottomLeft', v)} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <InputLabel>Margin</InputLabel>
                  <ResponsiveToggle id="margin" isLinked={marginLinked} onLinkToggle={() => setMarginLinked(!marginLinked)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SpacingInput label="Top" value={getStyleValueNested('margin', 'top', 0)} onChange={(v) => handleMargin('top', v)} allowNegative />
                  <SpacingInput label="Bottom" value={getStyleValueNested('margin', 'bottom', 0)} onChange={(v) => handleMargin('bottom', v)} allowNegative />
                  <SpacingInput label="Left" value={getStyleValueNested('margin', 'left', 0)} onChange={(v) => handleMargin('left', v)} allowNegative />
                  <SpacingInput label="Right" value={getStyleValueNested('margin', 'right', 0)} onChange={(v) => handleMargin('right', v)} allowNegative />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
             <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <InputLabel>Padding</InputLabel>
                      <ResponsiveToggle id="padding" isLinked={paddingLinked} onLinkToggle={() => setPaddingLinked(!paddingLinked)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <SpacingInput label="Top" value={getStyleValueNested('padding', 'top', 0)} onChange={(v) => handlePadding('top', v)} />
                      <SpacingInput label="Bottom" value={getStyleValueNested('padding', 'bottom', 0)} onChange={(v) => handlePadding('bottom', v)} />
                      <SpacingInput label="Left" value={getStyleValueNested('padding', 'left', 0)} onChange={(v) => handlePadding('left', v)} />
                      <SpacingInput label="Right" value={getStyleValueNested('padding', 'right', 0)} onChange={(v) => handlePadding('right', v)} />
                  </div>
                </div>
                
                <div className="space-y-4">
                   <InputLabel>Visibility</InputLabel>
                   <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 divide-y divide-slate-100">
                      {[
                        { key: 'mobile', icon: Smartphone, label: 'Mobile' },
                        { key: 'tablet', icon: Tablet, label: 'Tablet' },
                        { key: 'desktop', icon: Monitor, label: 'Desktop' }
                      ].map((v) => (
                        <div key={v.key} className="flex items-center justify-between p-3">
                           <div className="flex items-center gap-3">
                              <v.icon size={14} className="text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">{v.label}</span>
                           </div>
                           <button 
                             onClick={() => handleUpdateVisibility(v.key as any, !block.visibility?.[v.key as keyof typeof block.visibility])}
                             className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${block.visibility?.[v.key as keyof typeof block.visibility] !== false ? 'bg-[#FF7575]' : 'bg-slate-200'}`}
                           >
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${block.visibility?.[v.key as keyof typeof block.visibility] !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 rounded-b-[32px]">
            <button 
            onClick={handleSave}
            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[2px] shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
            <Check size={16} strokeWidth={3} /> Save
            </button>
        </div>
      </div>
    </>
  );
};

export default ContextualModal;
