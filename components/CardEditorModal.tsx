
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  X, Check, Trash2, Palette, RotateCcw, Eye, Type, 
  Image as ImageIcon, List, AlignLeft, Star, Plus, Database, RefreshCw, Layers, Droplet,
  Layout, Smartphone
} from 'lucide-react';

const CardEditorModal: React.FC = () => {
  const { 
      profile, services, products, events, properties, forms,
      editingHighlightId, setEditingHighlightId, updateHighlight, removeHighlight, activeHighlightId 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  
  const highlight = profile.highlights.find(h => h.id === editingHighlightId);
  if (!highlight) return null;

  const styles = highlight.styles || {};
  const modalData = highlight.modalData || {};
  const modalStyles = modalData.styles || {};
  
  const isEditingOpenModal = activeHighlightId === editingHighlightId;

  // Generic updaters
  const handleCardStyleUpdate = (updates: any) => {
    updateHighlight(highlight.id, { styles: { ...styles, ...updates } });
  };
  
  const handleMainUpdate = (updates: any) => {
    updateHighlight(highlight.id, updates);
  };

  const handleModalDataUpdate = (updates: any) => {
      updateHighlight(highlight.id, {
          modalData: { ...modalData, ...updates }
      });
  };

  const handleModalStyleUpdate = (updates: any) => {
      handleModalDataUpdate({
          styles: { ...modalStyles, ...updates }
      });
  };

  // Determine Entity Linking Logic
  const entityType = highlight.type; 
  const isLinkable = ['product', 'service', 'event', 'property', 'form'].includes(entityType);
  const isNative = modalData.useExternalLink !== true;

  // Resolve Linked Entity Data
  let linkedEntity: any = null;
  if (entityType === 'service' && modalData.serviceId) linkedEntity = services.find(s => s.id === modalData.serviceId);
  if (entityType === 'product' && modalData.productId) linkedEntity = products.find(p => p.id === modalData.productId);
  if (entityType === 'event' && modalData.eventId) linkedEntity = events.find(e => e.id === modalData.eventId);
  if (entityType === 'property' && modalData.propertyId) linkedEntity = properties.find(p => p.id === modalData.propertyId);
  if (entityType === 'form' && modalData.formId) linkedEntity = forms.find(f => f.id === modalData.formId);

  // Helper to handle entity selection and Auto-Fill
  const handleEntitySelection = (id: string) => {
      const updates: any = {};
      const mainUpdates: any = {};
      
      // Clear all ID fields first
      updates.serviceId = undefined;
      updates.productId = undefined;
      updates.eventId = undefined;
      updates.propertyId = undefined;
      updates.formId = undefined;

      let selected: any = null;

      if (entityType === 'service') { updates.serviceId = id; selected = services.find(s => s.id === id); }
      if (entityType === 'product') { updates.productId = id; selected = products.find(p => p.id === id); }
      if (entityType === 'event') { updates.eventId = id; selected = events.find(e => e.id === id); }
      if (entityType === 'property') { updates.propertyId = id; selected = properties.find(p => p.id === id); }
      if (entityType === 'form') { updates.formId = id; selected = forms.find(f => f.id === id); }

      // Auto-Fill / Sync Data if entity found
      if (selected) {
          mainUpdates.title = selected.title;
          mainUpdates.subtitle = selected.description || highlight.subtitle;
          mainUpdates.price = selected.price || highlight.price;
          
          if (selected.image) mainUpdates.image = selected.image;
          if (selected.images && selected.images.length > 0) {
              mainUpdates.image = selected.images[0];
              updates.slides = selected.images;
          }

          if (selected.features) updates.features = selected.features;
          if (selected.buttonText) updates.buttonText = selected.buttonText;
          if (selected.location) updates.location = selected.location; // For events/props
          if (selected.date) updates.date = selected.date;
          if (selected.time) updates.time = selected.time;
      }

      handleModalDataUpdate(updates);
      handleMainUpdate(mainUpdates);
  };

  // UI Components
  const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between border border-slate-100">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-300 uppercase">{value}</span>
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer relative overflow-hidden ring-1 ring-slate-100"
              style={{ backgroundColor: value || '#000000' }}
              onClick={(e) => e.stopPropagation()} // Prevent bubble up closing modal
            >
              <input 
                  type="color" 
                  value={value || '#000000'} 
                  onClick={(e) => e.stopPropagation()} // Critical for stopping picker auto-close
                  onChange={(e) => onChange(e.target.value)} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
            </div>
        </div>
    </div>
  );

  const Toggle = ({ label, icon: Icon, value, onChange }: any) => (
    <button 
        onClick={() => onChange(!value)}
        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${value ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
    >
        <div className="flex items-center gap-3">
            <Icon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${value ? 'bg-white/20' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${value ? 'right-1' : 'left-1'}`} />
        </div>
    </button>
  );

  // --- RENDER MODAL EDITOR (When Editing from Modal) ---
  const renderModalEditor = () => (
      <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1 overscroll-contain">
          {activeTab === 'content' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  
                  {isLinkable && (
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <Database size={12} /> Data Source
                        </label>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleModalDataUpdate({ useExternalLink: false })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isNative ? 'bg-white shadow-md text-slate-900 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Native Item
                                </button>
                                <button
                                    onClick={() => handleModalDataUpdate({ useExternalLink: true })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isNative ? 'bg-white shadow-md text-slate-900 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    External Link
                                </button>
                            </div>

                            {isNative && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Link to {entityType}</span>
                                        {linkedEntity && (
                                            <button 
                                                onClick={() => handleEntitySelection(linkedEntity.id)}
                                                className="text-[9px] font-bold text-[#FF7575] uppercase hover:underline flex items-center gap-1"
                                            >
                                                <RefreshCw size={10} /> Re-Sync
                                            </button>
                                        )}
                                    </div>
                                    <select 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#FF7575]/20"
                                        onChange={(e) => handleEntitySelection(e.target.value)}
                                        value={
                                            (entityType === 'service' ? modalData.serviceId : 
                                            entityType === 'product' ? modalData.productId :
                                            entityType === 'event' ? modalData.eventId :
                                            entityType === 'property' ? modalData.propertyId :
                                            entityType === 'form' ? modalData.formId : '') || ''
                                        }
                                    >
                                        <option value="">-- No Link (Custom) --</option>
                                        {entityType === 'service' && services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        {entityType === 'product' && products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                        {entityType === 'event' && events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                                        {entityType === 'property' && properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                        {entityType === 'form' && forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                    </select>
                                </div>
                            )}

                            {!isNative && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Redirect URL</span>
                                    <input 
                                        value={modalData.redirectUrl || ''}
                                        onChange={(e) => handleModalDataUpdate({ redirectUrl: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 outline-none focus:border-[#FF7575]"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                  )}

                  <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <ImageIcon size={12} /> Gallery Slides
                        </label>
                        <div className="space-y-2">
                            {(modalData.slides || [highlight.image]).map((slide, idx) => (
                                <div key={idx} className="flex gap-2 group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                        <img src={slide} className="w-full h-full object-cover" />
                                    </div>
                                    <input 
                                        value={slide}
                                        placeholder="https://..."
                                        onChange={(e) => {
                                            const newSlides = [...(modalData.slides || [highlight.image])];
                                            newSlides[idx] = e.target.value;
                                            handleModalDataUpdate({ slides: newSlides });
                                        }}
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-mono text-slate-600 outline-none focus:bg-white focus:border-[#FF7575] transition-all"
                                    />
                                    <button 
                                        onClick={() => {
                                            const newSlides = (modalData.slides || [highlight.image]).filter((_, i) => i !== idx);
                                            handleModalDataUpdate({ slides: newSlides });
                                        }}
                                        className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => handleModalDataUpdate({ slides: [...(modalData.slides || [highlight.image]), ''] })}
                                className="w-full py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#FF7575] hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={12} /> Add Slide
                            </button>
                        </div>
                  </div>

                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                              <Type size={12} /> Headlines
                      </label>
                      <div className="space-y-3">
                          <input 
                                  type="text"
                                  value={modalData.tagline || ''}
                                  placeholder="Top Tagline"
                                  onChange={(e) => handleModalDataUpdate({ tagline: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold text-slate-500 outline-none focus:bg-white focus:border-[#FF7575] transition-all"
                              />
                          <input 
                                  type="text"
                                  value={highlight.title}
                                  placeholder="Main Title"
                                  onChange={(e) => handleMainUpdate({ title: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 outline-none focus:bg-white focus:border-[#FF7575] transition-all"
                              />
                          <textarea 
                                  value={modalData.description !== undefined ? modalData.description : highlight.subtitle}
                                  placeholder="Detailed Description (Modal Only)"
                                  onChange={(e) => handleModalDataUpdate({ description: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-[#FF7575] transition-all min-h-[120px]"
                              />
                      </div>
                  </div>

                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                              <List size={12} /> Feature Pills
                      </label>
                      <textarea 
                              value={(modalData.features || []).join(', ')}
                              placeholder="Feature 1, Feature 2, Feature 3"
                              onChange={(e) => {
                                  const features = e.target.value.split(',').map(s => s.trim());
                                  handleModalDataUpdate({ features });
                              }}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF7575] transition-all min-h-[80px]"
                      />
                  </div>
              </div>
          )}

          {activeTab === 'design' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <Palette size={12} /> Modal Colors
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <ColorInput label="Background" value={modalStyles.backgroundColor || '#ffffff'} onChange={(v) => handleModalStyleUpdate({ backgroundColor: v })} />
                            <ColorInput label="Text" value={modalStyles.textColor || '#000000'} onChange={(v) => handleModalStyleUpdate({ textColor: v })} />
                            <ColorInput label="Button" value={modalStyles.buttonColor || '#000000'} onChange={(v) => handleModalStyleUpdate({ buttonColor: v })} />
                            <ColorInput label="Button Text" value={modalStyles.buttonTextColor || '#ffffff'} onChange={(v) => handleModalStyleUpdate({ buttonTextColor: v })} />
                        </div>
                   </div>
              </div>
          )}
      </div>
  );

  // --- RENDER CARD EDITOR (When Editing from Grid) ---
  const renderCardEditor = () => (
      <div className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1 overscroll-contain">
           {activeTab === 'content' && (
               <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <AlignLeft size={12} /> Primary Info
                        </label>
                        {linkedEntity && (
                             <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[10px] font-bold text-blue-600 flex items-center gap-2">
                                <Database size={12} />
                                Info synced with {entityType}: {linkedEntity.title}
                             </div>
                        )}
                        <div className="space-y-3">
                            <input 
                                type="text"
                                value={highlight.title}
                                placeholder="Card Title"
                                onChange={(e) => handleMainUpdate({ title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-[#FF7575] transition-all"
                            />
                            <div className="relative">
                                <textarea 
                                    value={highlight.subtitle}
                                    placeholder="Description / Subtitle"
                                    maxLength={300}
                                    onChange={(e) => handleMainUpdate({ subtitle: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-[#FF7575] transition-all min-h-[140px] resize-none"
                                />
                                <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-300 bg-slate-50/80 px-1 rounded">
                                    {(highlight.subtitle || '').length}/300
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <ImageIcon size={12} /> Card Media
                        </label>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={highlight.image}
                                    placeholder="Image URL"
                                    onChange={(e) => handleMainUpdate({ image: e.target.value })}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[11px] font-mono text-slate-500 outline-none focus:bg-white transition-all"
                                />
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                                    <img src={highlight.image} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                        <Toggle 
                            label="Mark as Featured" 
                            icon={Star} 
                            value={highlight.isFeatured} 
                            onChange={(v: boolean) => handleMainUpdate({ isFeatured: v })} 
                        />
                    </div>
               </div>
           )}

           {activeTab === 'design' && (
               <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                   
                   {/* BACKGROUND SETTINGS */}
                   <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <Layers size={12} /> Background
                        </label>
                        
                        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            {['solid', 'gradient', 'image'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => handleCardStyleUpdate({ backgroundType: t })}
                                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                                        (styles.backgroundType || 'solid') === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Solid & Gradient: Start Color */}
                        {((styles.backgroundType || 'solid') === 'solid' || styles.backgroundType === 'gradient') && (
                            <ColorInput 
                                label={styles.backgroundType === 'gradient' ? "Start Color" : "Card Background"} 
                                value={styles.backgroundColor || '#ffffff'} 
                                onChange={(v) => handleCardStyleUpdate({ backgroundColor: v })} 
                            />
                        )}

                        {/* Gradient: End Color */}
                        {styles.backgroundType === 'gradient' && (
                            <ColorInput 
                                label="End Color" 
                                value={styles.gradientColor || '#f0f0f0'} 
                                onChange={(v) => handleCardStyleUpdate({ gradientColor: v })} 
                            />
                        )}

                        {/* Image Input */}
                        {styles.backgroundType === 'image' && (
                            <input 
                                type="text"
                                value={styles.backgroundImage || ''}
                                placeholder="Background Image URL"
                                onChange={(e) => handleCardStyleUpdate({ backgroundImage: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-mono text-slate-600 outline-none focus:bg-white"
                            />
                        )}

                        {/* Blur Toggle/Slider */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                                    <Droplet size={12} /> Background Blur
                                </span>
                                <span className="text-[10px] font-bold text-slate-900">{styles.backgroundBlur || 0}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="20" 
                                value={styles.backgroundBlur || 0} 
                                onChange={(e) => handleCardStyleUpdate({ backgroundBlur: parseInt(e.target.value) })}
                                className="w-full accent-slate-900 bg-slate-200 h-1.5 rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                   </div>

                   {/* VISIBILITY TOGGLES */}
                   <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <Eye size={12} /> Elements
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <Toggle label="Show Image" icon={ImageIcon} value={styles.showImage !== false} onChange={(v: boolean) => handleCardStyleUpdate({ showImage: v })} />
                            <Toggle label="Show Tags" icon={List} value={styles.showTags !== false} onChange={(v: boolean) => handleCardStyleUpdate({ showTags: v })} />
                            <Toggle label="Card Rotation" icon={RotateCcw} value={styles.rotation !== 0} onChange={(v: boolean) => handleCardStyleUpdate({ rotation: v ? -1.5 : 0 })} />
                        </div>
                   </div>

                   {/* COLORS */}
                   <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                            <Palette size={12} /> Colors & Theme
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <ColorInput label="Text Color" value={styles.textColor || '#000000'} onChange={(v) => handleCardStyleUpdate({ textColor: v })} />
                            <ColorInput label="Accent Color" value={styles.accentColor || '#FF7575'} onChange={(v) => handleCardStyleUpdate({ accentColor: v })} />
                            <div className="h-px bg-slate-100 my-2" />
                            <ColorInput label="Button Color" value={styles.buttonColor || '#000000'} onChange={(v) => handleCardStyleUpdate({ buttonColor: v })} />
                            <ColorInput label="Button Text" value={styles.buttonTextColor || '#ffffff'} onChange={(v) => handleCardStyleUpdate({ buttonTextColor: v })} />
                            <div className="h-px bg-slate-100 my-2" />
                            <ColorInput label="Tag Background" value={styles.tagBackgroundColor || ''} onChange={(v) => handleCardStyleUpdate({ tagBackgroundColor: v })} />
                            <ColorInput label="Tag Text" value={styles.tagTextColor || ''} onChange={(v) => handleCardStyleUpdate({ tagTextColor: v })} />
                        </div>
                   </div>
               </div>
           )}
      </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 animate-in fade-in duration-300 font-inter">
      <div 
        className="bg-white w-full max-w-sm rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 h-[85vh] sm:h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pt-6 border-b border-slate-50 flex items-center bg-white shrink-0 relative min-h-[70px]">
          <button 
              onClick={() => setEditingHighlightId(null)} 
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
          >
            <X size={18} />
          </button>
            
          <div className="flex items-center gap-4 w-full">
             <div className="w-10 h-10 bg-[#FF7575] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF7575]/20 shrink-0">
                {isEditingOpenModal ? <Layout size={20} /> : <Smartphone size={20} />}
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">{isEditingOpenModal ? 'Edit Modal' : 'Edit Card'}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 inline-block">{highlight.type}</span>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 gap-1 bg-slate-50 mx-6 mt-6 rounded-2xl border border-slate-100 shrink-0">
            <button 
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Content
            </button>
            <button 
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Style
            </button>
        </div>

        {/* Dynamic Body */}
        {isEditingOpenModal ? renderModalEditor() : renderCardEditor()}

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
           <button 
             onClick={() => {
                if (window.confirm('Delete this card?')) {
                    removeHighlight(highlight.id);
                    setEditingHighlightId(null);
                }
             }}
             className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors"
           >
              <Trash2 size={20} />
           </button>
           <button 
             onClick={() => setEditingHighlightId(null)}
             className="flex-1 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-[0.98]"
           >
              <Check size={20} strokeWidth={3} /> Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditorModal;