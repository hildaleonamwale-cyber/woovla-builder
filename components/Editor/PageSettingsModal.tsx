
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Globe, Palette, Search, Layout, ChevronUp, ChevronDown, Link, Unlink, Image as ImageIcon } from 'lucide-react';

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

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={toggleSettings}
    >
      <div 
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-white/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[80vh] sm:max-h-[600px]"
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
          
          {/* SEO Section (Renamed from Site Title stuff) */}
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
                      placeholder="e.g. Home"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white transition-all placeholder:text-slate-300 font-medium"
                   />
                </div>
                
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 ml-1">Meta Description</label>
                   <textarea 
                      value={pageSettings.description}
                      onChange={(e) => updatePageSettings({ description: e.target.value })}
                      placeholder="Describe this page for search engines..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base text-slate-800 outline-none focus:border-[#FF7575] focus:bg-white transition-all placeholder:text-slate-300 font-medium min-h-[80px] resize-none"
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 ml-1">Featured Image URL</label>
                   <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
                         {pageSettings.featuredImage ? (
                           <img src={pageSettings.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon size={16} />
                         )}
                      </div>
                      <input 
                          type="text"
                          value={pageSettings.featuredImage || ''}
                          onChange={(e) => updatePageSettings({ featuredImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#FF7575] focus:bg-white transition-all placeholder:text-slate-300"
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* Appearance Section */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Palette size={12} /> Appearance
                </span>
             </div>

             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold text-slate-700">Canvas Color</label>
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 mr-2">
                        {PRESET_COLORS.slice(0, 5).map(c => (
                            <button
                                key={c}
                                onClick={() => updatePageSettings({ backgroundColor: c })}
                                className={`w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 hover:z-10 ${pageSettings.backgroundColor === c ? 'ring-2 ring-[#FF7575] z-10 scale-110' : ''}`}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                      </div>
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
                </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Typography</label>
               <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Inter', label: 'Sans' },
                    { name: 'Georgia', label: 'Serif' },
                    { name: 'Monaco', label: 'Mono' },
                    { name: 'Playfair Display', label: 'Display' }
                  ].map(font => (
                    <button
                        key={font.name}
                        onClick={() => updatePageSettings({ fontFamily: font.name })}
                        className={`px-3 py-4 rounded-xl border text-xs text-left transition-all flex flex-col gap-1 ${pageSettings.fontFamily === font.name ? 'border-[#FF7575] bg-[#FF7575]/5 text-[#FF7575]' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-200'}`}
                    >
                        <span className="font-bold">{font.name}</span>
                        <span className="text-[9px] opacity-60 font-medium uppercase tracking-wider">{font.label}</span>
                    </button>
                  ))}
               </div>
             </div>
          </section>

          {/* Layout Section */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                   <Layout size={12} /> Layout & Spacing
                </span>
             </div>

             <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Page Padding</label>
                  <button 
                    onClick={() => setPaddingLinked(!paddingLinked)}
                    className={`p-1.5 rounded-lg transition-all ${paddingLinked ? 'bg-[#FF7575] text-white' : 'bg-slate-200 text-slate-400'}`}
                  >
                    {paddingLinked ? <Link size={12} /> : <Unlink size={12} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SpacingInput 
                    label="Top" 
                    value={pageSettings.padding?.top || 0} 
                    onChange={(v: number) => handlePadding('top', v)} 
                  />
                  <SpacingInput 
                    label="Bottom" 
                    value={pageSettings.padding?.bottom || 0} 
                    onChange={(v: number) => handlePadding('bottom', v)} 
                  />
                  <SpacingInput 
                    label="Left" 
                    value={pageSettings.padding?.left || 0} 
                    onChange={(v: number) => handlePadding('left', v)} 
                  />
                  <SpacingInput 
                    label="Right" 
                    value={pageSettings.padding?.right || 0} 
                    onChange={(v: number) => handlePadding('right', v)} 
                  />
                </div>
             </div>
          </section>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
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
