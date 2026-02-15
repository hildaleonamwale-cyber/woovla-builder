
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Check, Image as ImageIcon, Link, Palette, Power, Square } from 'lucide-react';

const PopupEditorModal: React.FC = () => {
  const { profile, updatePopup, setPopupEditorOpen } = useStore();
  const popup = profile.popup!;
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  const updateStyle = (key: string, value: any) => {
      updatePopup({ style: { ...popup.style, [key]: value } });
  };

  const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between border border-slate-100">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer relative overflow-hidden ring-1 ring-slate-100"
              style={{ backgroundColor: value || '#000000' }}
            >
              <input 
                  type="color" 
                  value={value || '#000000'} 
                  onChange={(e) => onChange(e.target.value)} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 animate-in fade-in duration-300 font-inter pointer-events-auto">
        <div 
            className="bg-white w-full max-w-sm rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 h-[60vh] sm:h-[500px] relative"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF7575] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF7575]/20">
                        <Power size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">Popup Poster</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 inline-block">Site-wide Ad</span>
                    </div>
                </div>
                <button 
                    onClick={() => setPopupEditorOpen(false)} 
                    className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Enable Toggle */}
            <div className="px-6 pt-6 pb-2">
                <button 
                    onClick={() => updatePopup({ isEnabled: !popup.isEnabled })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${popup.isEnabled ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${popup.isEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${popup.isEnabled ? 'text-green-700' : 'text-slate-500'}`}>
                            {popup.isEnabled ? 'Popup Active' : 'Popup Disabled'}
                        </span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${popup.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${popup.isEnabled ? 'right-1' : 'left-1'}`} />
                    </div>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 gap-1 bg-slate-50 mx-6 mt-4 rounded-2xl border border-slate-100 shrink-0">
                <button 
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Image
                </button>
                <button 
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'style' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Style
                </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {activeTab === 'content' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                <ImageIcon size={12} /> Poster Image
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={popup.image}
                                    placeholder="Image URL"
                                    onChange={(e) => updatePopup({ image: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[11px] font-mono text-slate-500 outline-none focus:bg-white transition-all"
                                />
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                                    <img src={popup.image} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium px-2">
                                Recommended: Portrait aspect ratio (3:4 or 9:16) for best mobile appearance.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                <Link size={12} /> Destination Link
                            </label>
                            <input 
                                type="text"
                                value={popup.buttonLink}
                                placeholder="https://"
                                onChange={(e) => updatePopup({ buttonLink: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[11px] font-mono text-slate-500 outline-none focus:bg-white transition-all"
                            />
                            <p className="text-[9px] text-slate-400 font-medium px-2">
                                The entire poster will be clickable if a link is provided.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'style' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                <Palette size={12} /> Colors
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                <ColorInput label="Background" value={popup.style.backgroundColor} onChange={(v) => updateStyle('backgroundColor', v)} />
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium px-2">
                                Background color is visible behind transparent images.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                                <Square size={12} /> Corner Radius
                            </label>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                {['none', 'small', 'large'].map((r) => (
                                    <button 
                                        key={r}
                                        onClick={() => updateStyle('cornerRadius', r)}
                                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${popup.style.cornerRadius === r ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
               <button 
                 onClick={() => setPopupEditorOpen(false)}
                 className="w-full h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-[0.98]"
               >
                  <Check size={20} strokeWidth={3} /> Done
               </button>
            </div>
        </div>
    </div>
  );
};

export default PopupEditorModal;
