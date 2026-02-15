
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Settings, 
  Plus, 
  Undo2, 
  Redo2,
  Type,
  Heading,
  Image as ImageIcon,
  Layout,
  MousePointer2,
  X,
  FileText,
  Calendar,
  ShoppingBag,
  Box,
  Hash,
  Smartphone,
  Menu,
  LayoutGrid,
  Layers,
  Trash2,
  Check,
  Edit2,
  GalleryHorizontal
} from 'lucide-react';

const FloatingToolbar: React.FC = () => {
  const { 
    undo, redo, addBlock, toggleSettings, historyIndex, history, selectedBlockId, editingMode, setView,
    pages, activePageId, setActivePage, addPage, deletePage, updatePageTitle,
    isAddMenuOpen, setAddMenuOpen, addMenuParentId
  } = useStore();
  
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Filter available blocks based on mode
  const blockTemplates = [
    // Only show Header block if in page mode
    ...(editingMode === 'page' ? [{ type: 'header', icon: <Layout className="w-4 h-4" />, label: 'Head' }] : []),
    { type: 'heading', icon: <Heading className="w-4 h-4" />, label: 'Title' },
    { type: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
    { type: 'button', icon: <MousePointer2 className="w-4 h-4" />, label: 'Btn' },
    { type: 'image', icon: <ImageIcon className="w-4 h-4" />, label: 'Img' },
    // Navigation is useful in Header mainly
    { type: 'navigation', icon: <Menu className="w-4 h-4" />, label: 'Nav' },
    { type: 'layout', icon: <Box className="w-4 h-4" />, label: 'Grid' },
    { type: 'carousel', icon: <Smartphone className="w-4 h-4" />, label: 'Slider' },
    { type: 'cover', icon: <GalleryHorizontal className="w-4 h-4" />, label: 'Cover' },
    { type: 'form', icon: <FileText className="w-4 h-4" />, label: 'Form' },
    { type: 'booking', icon: <Calendar className="w-4 h-4" />, label: 'Bookings' },
    { type: 'ecommerce', icon: <ShoppingBag className="w-4 h-4" />, label: 'Store' },
    // Only show Footer block if in page mode
    ...(editingMode === 'page' ? [{ type: 'footer', icon: <Hash className="w-4 h-4" />, label: 'Foot' }] : []),
  ];

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 w-full px-4 sm:px-0 sm:w-auto"
      onClick={(e) => { e.stopPropagation(); }}
    >
      {/* ADD BLOCK MENU */}
      {isAddMenuOpen && (
        <div className="bg-white/95 p-2 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] border border-slate-200 max-w-[95vw] overflow-x-auto no-scrollbar mb-2">
          {addMenuParentId && (
            <div className="flex items-center justify-center px-3 border-r border-slate-200/50 mr-1">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                 Adding Slide
               </span>
            </div>
          )}
          {blockTemplates.map((item) => (
            <button
              key={item.type}
              onClick={(e) => {
                e.stopPropagation();
                // If adding to a parent (like carousel), we ignore selectedBlockId for positioning "after"
                const afterId = addMenuParentId ? undefined : (selectedBlockId || undefined);
                addBlock(item.type as any, afterId, addMenuParentId);
                setAddMenuOpen(false);
              }}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#FF7575]/10 transition-all active:scale-90"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500 group-hover:text-[#FF7575] transition-colors">
                {item.icon}
              </div>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#FF7575]">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={(e) => { e.stopPropagation(); setAddMenuOpen(false); }}
            className="flex items-center justify-center p-2 text-slate-300 hover:text-slate-500 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* PAGE LIST MENU */}
      {isPagesMenuOpen && (
        <div className="bg-white w-[280px] p-3 rounded-[24px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col gap-3 mb-2">
           <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pages</span>
              <button onClick={() => setIsPagesMenuOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
           </div>
           
           <div className="max-h-[180px] overflow-y-auto no-scrollbar space-y-1">
             {pages.map((page) => (
                <div 
                   key={page.id} 
                   className={`p-2.5 rounded-xl flex items-center justify-between group transition-colors ${activePageId === page.id ? 'bg-[#FF7575]/10 border border-[#FF7575]/20' : 'hover:bg-slate-50 border border-transparent'}`}
                   onClick={() => setActivePage(page.id)}
                >
                   {editingTitleId === page.id ? (
                      <input 
                        autoFocus
                        value={page.title}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updatePageTitle(page.id, e.target.value)}
                        onBlur={() => setEditingTitleId(null)}
                        onKeyDown={(e) => { if(e.key === 'Enter') setEditingTitleId(null) }}
                        className="bg-white border border-[#FF7575] rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none w-full mr-2"
                      />
                   ) : (
                      <div className="flex items-center gap-2.5">
                         <div className={`w-1.5 h-1.5 rounded-full ${activePageId === page.id ? 'bg-[#FF7575]' : 'bg-slate-200'}`} />
                         <div className="flex flex-col">
                            <span className={`text-xs font-bold ${activePageId === page.id ? 'text-[#FF7575]' : 'text-slate-700'}`}>{page.title}</span>
                         </div>
                      </div>
                   )}
                   
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingTitleId === page.id ? (
                          <button onClick={(e) => { e.stopPropagation(); setEditingTitleId(null); }} className="p-1 text-[#FF7575] hover:bg-[#FF7575]/10 rounded-lg"><Check size={12} /></button>
                      ) : (
                          <button onClick={(e) => { e.stopPropagation(); setEditingTitleId(page.id); }} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><Edit2 size={12} /></button>
                      )}
                      
                      {pages.length > 1 && (
                         <button onClick={(e) => { e.stopPropagation(); deletePage(page.id); }} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={12} /></button>
                      )}
                   </div>
                </div>
             ))}
           </div>

           <button 
              onClick={addPage}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[9px] font-black uppercase tracking-widest hover:border-[#FF7575] hover:text-[#FF7575] transition-colors flex items-center justify-center gap-1.5"
           >
              <Plus size={12} /> Add New Page
           </button>
        </div>
      )}

      {/* MAIN TOOLBAR (COMPACT) */}
      <div className="bg-white/95 h-12 px-4 rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center gap-3 animate-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Group: Dashboard & Pages */}
        <div className="flex items-center gap-1 border-r border-slate-200/50 pr-3 mr-0">
             <button 
                onClick={(e) => { e.stopPropagation(); setView('dashboard'); }}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                title="Go to Dashboard"
            >
                <LayoutGrid size={18} />
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); setIsPagesMenuOpen(!isPagesMenuOpen); setAddMenuOpen(false); }}
                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${isPagesMenuOpen ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-[#FF7575]'}`}
                title="Manage Pages"
            >
                <Layers size={18} />
                <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest">Pages</span>
            </button>
        </div>

        {/* Center: Add Block Button */}
        <div className="flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setAddMenuOpen(!isAddMenuOpen); setIsPagesMenuOpen(false); }}
            className={`w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center ${isAddMenuOpen ? 'bg-slate-800 text-white shadow-inner' : 'bg-[#FF7575] text-white hover:scale-110 active:scale-95 shadow-md shadow-[#FF7575]/30'}`}
            title="Add Block"
          >
            <Plus size={20} strokeWidth={3} className={`transition-transform duration-300 ${isAddMenuOpen ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {/* Right Group: Actions */}
        <div className="flex items-center gap-1 border-l border-slate-200/50 pl-3">
          <button 
            onClick={(e) => { e.stopPropagation(); undo(); }}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-all ${canUndo ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'text-slate-200 cursor-not-allowed'}`}
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); redo(); }}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-all ${canRedo ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'text-slate-200 cursor-not-allowed'}`}
          >
            <Redo2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleSettings(); }}
            className="p-2 text-slate-400 hover:text-[#FF7575] hover:bg-slate-100 rounded-lg transition-all ml-1"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;
