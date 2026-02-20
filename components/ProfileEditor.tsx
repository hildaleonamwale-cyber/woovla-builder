
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Camera, Plus, Trash2, GripVertical, ChevronRight, 
  Instagram, Globe, Linkedin, Twitter, MessageCircle, MapPin, Link as LinkIcon,
  ArrowLeft
} from 'lucide-react';
import { HighlightType } from '../types';

// Icons for links
const LINK_ICONS: any = {
  instagram: Instagram,
  website: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  whatsapp: MessageCircle,
  maps: MapPin,
  default: LinkIcon
};

const ProfileEditor: React.FC = () => {
  const { profile, updateProfile, removeHighlight, addHighlight, setEditingHighlightId, setView, updateUpdate, removeUpdate, addUpdate } = useStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkPlatform, setNewLinkPlatform] = useState('website');
  
  const [activeEditorTab, setActiveEditorTab] = useState<'identity' | 'links' | 'cards' | 'updates' | 'info' | 'stories'>('identity');

  const handleIdentityUpdate = (key: string, value: string) => {
    updateProfile({ [key]: value });
  };

  const handleAddLink = () => {
    if(!newLinkUrl) return;
    const newLink = {
        id: Date.now().toString(),
        platform: newLinkPlatform as any,
        url: newLinkUrl
    };
    updateProfile({ links: [...profile.links, newLink] });
    setIsAddingLink(false);
    setNewLinkUrl('');
  };

  const removeLink = (id: string) => {
      updateProfile({ links: profile.links.filter(l => l.id !== id) });
  };

  const handleAddCard = () => {
      // Logic to add a card (can reuse the one from ProfileView or simple add)
      const newCard = {
          id: `h_${Date.now()}`,
          type: 'product' as HighlightType,
          title: 'New Product',
          subtitle: 'Description here',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
          isFeatured: false,
          buttonText: 'Buy Now',
          styles: { backgroundColor: '#ffffff', showTags: true },
          modalData: { features: ['Feature 1'] }
      };
      addHighlight(newCard);
      // setEditingHighlightId(newCard.id); // Optional: immediately open editor
  };

  return (
    <div className="max-w-[500px] mx-auto min-h-screen bg-slate-50 font-inter pb-40">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => setView('public')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest text-slate-800">Edit Profile</h1>
            </div>
            <button onClick={() => setView('public')} className="text-[10px] font-black uppercase tracking-widest text-[#FF7575]">Done</button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-6 flex gap-2 overflow-x-auto no-scrollbar">
            {[
                { id: 'identity', label: 'Identity' },
                { id: 'links', label: 'Links' },
                { id: 'cards', label: 'Cards' },
                { id: 'updates', label: 'Updates' },
                { id: 'info', label: 'Info' },
                { id: 'stories', label: 'Stories' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveEditorTab(tab.id as any)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeEditorTab === tab.id ? 'bg-black text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="p-6 space-y-8">
            
            {/* Identity Section */}
            {activeEditorTab === 'identity' && (
                <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2">
                    <div className="relative group cursor-pointer mb-6">
                        <div className="w-24 h-24 rounded-full p-1 bg-white shadow-xl ring-1 ring-slate-100">
                            <img src={profile.avatar} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={24} className="text-white" />
                        </div>
                        <input 
                            type="text" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleIdentityUpdate('avatar', e.target.value)} // Simple text input for URL for now, or mock upload
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Display Name</label>
                            <input 
                                value={profile.name}
                                onChange={(e) => handleIdentityUpdate('name', e.target.value)}
                                className="w-full text-center text-xl font-black text-slate-900 bg-transparent border-b border-slate-100 focus:border-[#FF7575] outline-none pb-2 transition-colors placeholder:text-slate-300"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Handle</label>
                            <div className="flex items-center justify-center">
                                <span className="text-slate-400 font-bold mr-0.5">@</span>
                                <input 
                                    value={profile.handle}
                                    onChange={(e) => handleIdentityUpdate('handle', e.target.value)}
                                    className="w-auto text-center text-sm font-bold text-slate-600 bg-transparent border-b border-slate-100 focus:border-[#FF7575] outline-none pb-1 transition-colors min-w-[100px]"
                                    placeholder="handle"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Bio</label>
                            <textarea 
                                value={profile.bio}
                                onChange={(e) => handleIdentityUpdate('bio', e.target.value)}
                                className="w-full text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#FF7575]/20 transition-all resize-none min-h-[80px]"
                                placeholder="Tell your story..."
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Links Section */}
            {activeEditorTab === 'links' && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Social Links</h3>
                        <button 
                            onClick={() => setIsAddingLink(true)} 
                            className="text-[10px] font-bold text-[#FF7575] hover:underline"
                        >
                            + Add Link
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {profile.links.map(link => {
                            const Icon = LINK_ICONS[link.platform] || LINK_ICONS.default;
                            return (
                                <div key={link.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group">
                                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 capitalize truncate">{link.platform}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                                    </div>
                                    <button onClick={() => removeLink(link.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )
                        })}
                        
                        {isAddingLink && (
                            <div className="bg-white p-4 rounded-2xl border border-[#FF7575] shadow-sm animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-2 mb-3">
                                    <select 
                                        value={newLinkPlatform}
                                        onChange={(e) => setNewLinkPlatform(e.target.value)}
                                        className="bg-slate-50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                                    >
                                        {Object.keys(LINK_ICONS).filter(k => k !== 'default').map(k => (
                                            <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
                                        ))}
                                    </select>
                                    <input 
                                        value={newLinkUrl}
                                        onChange={(e) => setNewLinkUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF7575]/20"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsAddingLink(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
                                    <button onClick={handleAddLink} className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase">Add</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Cards Section */}
            {activeEditorTab === 'cards' && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Action Cards</h3>
                    </div>

                    <div className="space-y-3">
                        {profile.highlights.map(h => (
                            <div key={h.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-[#FF7575]/30 transition-all group">
                                <div className="text-slate-300 cursor-grab active:cursor-grabbing p-2">
                                    <GripVertical size={16} />
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                    <img src={h.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-slate-800 truncate">{h.title}</h4>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider inline-block bg-slate-50 px-1.5 py-0.5 rounded mt-1">{h.type}</span>
                                </div>
                                <button 
                                    onClick={() => setEditingHighlightId(h.id)}
                                    className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => removeHighlight(h.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <button 
                            onClick={handleAddCard}
                            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-[#FF7575] hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:text-[#FF7575] transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Add New Card</span>
                        </button>
                    </div>
                </section>
            )}

            {/* Updates Section */}
            {activeEditorTab === 'updates' && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Updates Feed</h3>
                        <button 
                            onClick={() => {
                                addUpdate({
                                    id: `u_${Date.now()}`,
                                    title: 'New Update',
                                    date: 'Just now',
                                    content: 'New content here...',
                                    image: null
                                });
                            }} 
                            className="text-[10px] font-bold text-[#FF7575] hover:underline"
                        >
                            + New Update
                        </button>
                    </div>

                    <div className="space-y-4">
                        {profile.updates.map(update => (
                            <div key={update.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-3">
                                        <input 
                                            value={update.title}
                                            onChange={(e) => updateUpdate(update.id, { title: e.target.value })}
                                            className="w-full text-sm font-black text-slate-800 bg-transparent border-b border-slate-50 focus:border-[#FF7575] outline-none pb-1"
                                            placeholder="Update Title"
                                        />
                                        <input 
                                            value={update.date}
                                            onChange={(e) => updateUpdate(update.id, { date: e.target.value })}
                                            className="w-full text-[10px] font-bold text-slate-400 bg-transparent border-b border-slate-50 focus:border-[#FF7575] outline-none pb-1 uppercase tracking-widest"
                                            placeholder="Date (e.g. 2 days ago)"
                                        />
                                    </div>
                                    <button onClick={() => removeUpdate(update.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <textarea 
                                    value={update.content}
                                    onChange={(e) => updateUpdate(update.id, { content: e.target.value })}
                                    className="w-full text-xs font-medium text-slate-500 bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FF7575]/20 transition-all resize-none min-h-[100px]"
                                    placeholder="Update content..."
                                />
                                <input 
                                    value={update.image || ''}
                                    onChange={(e) => updateUpdate(update.id, { image: e.target.value })}
                                    className="w-full text-[10px] font-mono text-slate-300 bg-transparent border-b border-slate-50 focus:border-[#FF7575] outline-none pb-1"
                                    placeholder="Image URL (optional)"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Info Section */}
            {activeEditorTab === 'info' && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Info Section</h3>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Section Title</label>
                            <input 
                                value={profile.info.storyTitle}
                                onChange={(e) => updateProfile({ info: { ...profile.info, storyTitle: e.target.value } })}
                                className="w-full text-lg font-black text-slate-800 bg-transparent border-b border-slate-100 focus:border-[#FF7575] outline-none pb-2"
                                placeholder="Our Story"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Story Content</label>
                            <textarea 
                                value={profile.info.storyContent}
                                onChange={(e) => updateProfile({ info: { ...profile.info, storyContent: e.target.value } })}
                                className="w-full text-xs font-medium text-slate-600 bg-slate-50 rounded-[24px] p-6 outline-none focus:ring-2 focus:ring-[#FF7575]/20 transition-all min-h-[300px] leading-loose"
                                placeholder="Tell your story..."
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Stories Section */}
            {activeEditorTab === 'stories' && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Profile Stories</h3>
                        <button 
                            onClick={() => {
                                useStore.getState().addStory({
                                    id: `s_${Date.now()}`,
                                    type: 'image',
                                    content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
                                    title: 'New Story'
                                });
                            }} 
                            className="text-[10px] font-bold text-[#FF7575] hover:underline"
                        >
                            + Add Story
                        </button>
                    </div>

                    <div className="space-y-3">
                        {profile.stories.map(story => (
                            <div key={story.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    {story.type === 'image' ? (
                                        <img src={story.content} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400"><Type size={16} /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <input 
                                        value={story.title || ''}
                                        onChange={(e) => {
                                            const newStories = profile.stories.map(s => s.id === story.id ? { ...s, title: e.target.value } : s);
                                            updateProfile({ stories: newStories });
                                        }}
                                        className="w-full text-[11px] font-black text-slate-800 bg-transparent outline-none uppercase tracking-widest"
                                        placeholder="Story Title"
                                    />
                                    <input 
                                        value={story.content}
                                        onChange={(e) => {
                                            const newStories = profile.stories.map(s => s.id === story.id ? { ...s, content: e.target.value } : s);
                                            updateProfile({ stories: newStories });
                                        }}
                                        className="w-full text-[10px] text-slate-400 bg-transparent outline-none truncate"
                                        placeholder="Image URL or Text"
                                    />
                                </div>
                                <button 
                                    onClick={() => {
                                        const newStories = profile.stories.filter(s => s.id !== story.id);
                                        updateProfile({ stories: newStories });
                                    }}
                                    className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
  );
};

export default ProfileEditor;
