
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Globe, Palette, Search, Layout, ChevronUp, ChevronDown, Link, Unlink, Image as ImageIcon, Sparkles, Grid, Waves, CircleDot } from 'lucide-react';

const PRESET_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#fff1f2', '#fff7ed', '#f0fdf4', '#eff6ff', '#faf5ff'
];

const SpacingInput = ({ label, value, onChange }: any) => (
  <div 
    className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-xl group hover:border-[#FF7575]/30 transition-colors"
  >
    <span className="text-[9px] font-black text-slate-300 uppercase ml-1">{label}</span>
    <div className="flex items-center gap-1.5">
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-8 bg-transparent text-[11px] text-center font-black text-slate-700 outline-none placeholder:text-slate-300"
      />
      <div className="flex flex-col">
        <button onClick={() => onChange(value + 1)} className="text-slate-300 hover:text-[#FF7575] leading-none"><ChevronUp size={10} /></button>
        <button onClick={() => onChange(Math.max(0, value - 1))} className="text-slate-300 hover:text-[#FF7575] leading-none"><ChevronDown size={10} /></button>
      </div>
    </div>
  </div>
);

const PageSettingsModal: React.FC = () => {
  const { pageSettings, updatePageSettings, toggleSettings } = useStore();
  const [paddingLinked, setPaddingLinked] = useState(true);

  const handlePadding = (side: string, val: number) => {
    const current = pageSettings.padding || { top: 0, right: 0, bottom: 0, left: 0 };
    let newPadding;
    if (paddingLinked) {
      newPadding = { top: val, right: val, bottom: val, left: val };
    } else {
      newPadding = { ...current, [side]: val };
    }
    updatePageSettings({ padding: newPadding });
  };
  
  const PATTERNS: { id: 'none' | 'polka' | 'stars' | 'grid' | 'waves', label: string, icon: any }[] = [
      { id: 'none', label: 'None', icon: X },
      { id: 'polka', label: 'Polka', icon: CircleDot },
      { id: 'stars', label: 'Stars', icon: Sparkles },
      { id: 'grid', label: 'Grid', icon: Grid },
      { id: 'waves', label: 'Waves', icon: Waves },
  ];

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 animate-in fade-in duration-300"
      onClick={toggleSettings}
    >
      <div 
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[80vh] sm:max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
              <Globe size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight leading-tight">Page Settings</h2>
            </div>
          </div>
          <button 
            onClick={toggleSettings} 
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 overflow-y-auto overscroll-contain no-scrollbar flex-1">
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Search size={12} /> Page SEO & Metadata
                </span>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 ml-1">Page Title</label>
                   <input 
                      type="text"
                      value={pageSettings.title}
                      onChange={(e) => updatePageSettings({ title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white transition-all placeholder:text-slate-300 font-medium"
                   />
                </div>
             </div>
          </section>
          
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Palette size={12} /> Appearance & FX
                </span>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold text-slate-700">Canvas Color</label>
                   <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-100 cursor-pointer hover:scale-105 transition-transform">
                          <div className="absolute inset-0" style={{ backgroundColor: pageSettings.backgroundColor }} />
                          <input 
                            type="color" 
                            value={pageSettings.backgroundColor}
                            onChange={(e) => updatePageSettings({ backgroundColor: e.target.value })}
                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                          />
                      </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50">
                    <label className="text-xs font-bold text-slate-700 block mb-3">Background Pattern</label>
                    <div className="grid grid-cols-5 gap-2">
                        {PATTERNS.map((p) => {
                            const isSelected = (pageSettings.backgroundPattern || 'none') === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => updatePageSettings({ backgroundPattern: p.id })}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${isSelected ? 'bg-white shadow-md ring-1 ring-slate-200 text-[#FF7575]' : 'bg-transparent text-slate-400 hover:bg-white/50 hover:text-slate-600'}`}
                                >
                                    <p.icon size={18} />
                                    <span className="text-[9px] font-black uppercase tracking-wide">{p.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
             </div>
          </section>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
           <button 
             onClick={toggleSettings}
             className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};

export default PageSettingsModal;
