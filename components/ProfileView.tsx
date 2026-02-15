
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Instagram, Globe, MapPin, Linkedin, Feather, Share2, 
  Edit2, Plus, ShoppingBag, Calendar, Clock, FileText, 
  Play, CheckCircle2, Mail, Users, ArrowRight, Verified, X, Sparkles, Tag, Bolt, Home, Scissors, Gift, Ticket, ClipboardList, Video,
  MessageCircle, Twitter, Map, Send, Link, Star, MessageSquare, Bell, History
} from 'lucide-react';
import CardEditorModal from './CardEditorModal';
import { HighlightType, Highlight } from '../types';
import PatternBackground from './PatternBackground';

const ICON_MAP: any = {
  instagram: <Instagram size={18} />,
  website: <Globe size={18} />,
  maps: <MapPin size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  whatsapp: <MessageCircle size={18} />
};

const LABEL_MAP: any = {
    instagram: 'Instagram',
    website: 'Website',
    maps: 'Location',
    linkedin: 'LinkedIn',
    twitter: 'X / Twitter',
    whatsapp: 'WhatsApp'
};

const CARD_TYPES: { type: HighlightType; label: string; icon: any; description: string }[] = [
  { type: 'product', label: 'Product', icon: ShoppingBag, description: 'Sell a digital or physical item' },
  { type: 'service', label: 'Service', icon: Clock, description: 'Book appointments or consults' },
  { type: 'event', label: 'Event', icon: Calendar, description: 'Promote a workshop or meetup' },
  { type: 'form', label: 'Order Form', icon: FileText, description: 'Collect custom orders or leads' },
  { type: 'media', label: 'Media', icon: Play, description: 'Link to video, gallery or content' },
  { type: 'property', label: 'Property', icon: Home, description: 'List a property for sale or rent' },
];

const CARD_STYLES = `
/* ===== DO NOT TOUCH: GUTTER / TRACK LOGIC ===== */
.agency-portfolio-section {
  padding: 0 0 30px;
  font-family: 'Poppins', sans-serif !important;
  overflow: visible;
  --gutter: 35px;
  background: transparent !important;
}
@media (min-width: 768px){ .agency-portfolio-section{ --gutter: 60px; } }
@media (min-width: 1024px){ .agency-portfolio-section{ --gutter: 120px; } }

.portfolio-container {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 22px 35px 40px 35px;
  background: transparent !important;
}
.portfolio-container::-webkit-scrollbar{ display:none; }

/* ===================== WOOVLA CARD BASE ===================== */
:root {
  --line: rgba(18,18,18,.10);
  --soft: rgba(18,18,18,.04);
}

.woovla-card {
  flex: 0 0 72vw;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  background: transparent;
  border-radius: 30px;
  padding: 18px 18px 16px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(18,18,18,.06), 0 3px 10px rgba(18,18,18,.03);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
  transform-style: preserve-3d;
}

@media (min-width: 768px) {
  .woovla-card {
    flex: 0 0 300px;
  }
}

.woovla-card:hover {
  transform: translateY(-5px);
}

/* --- BACKGROUND LAYER --- */
.woovla-card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
}

/* --- HEADER --- */
.w-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.w-icon {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex: 0 0 auto;
}

.w-type {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: .35px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* --- CONTENT --- */
.w-content {
  position: relative;
  z-index: 2;
}

.w-title {
  font-family: 'Poppins', sans-serif !important;
  font-weight: 700;
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.4px;
  margin: 10px 0 8px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.w-desc {
  font-family: 'Poppins', sans-serif !important;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Increased to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.w-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0;
  position: relative;
  z-index: 2;
}

.w-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: .15px;
  white-space: nowrap;
}

.w-pill svg {
  width: 11px;
  height: 11px;
  opacity: .95;
}

/* --- CTA BUTTONS --- */
.w-cta {
  margin-top: auto;
  position: relative;
  z-index: 2;
}
.w-btn-full {
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .55px;
  text-transform: uppercase;
  transition: transform .18s ease, opacity .18s ease;
  cursor: pointer;
}
.woovla-card:hover .w-btn-full { transform: translateY(-1px); opacity: .96; }
`;

const NewsletterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    if (!isOpen) return null;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => {
                onClose();
                setIsSubscribed(false);
                setEmail('');
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden p-10 relative animate-in zoom-in-95 duration-500">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-black">
                    <X size={20} />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#FDF1F1] text-[#FF7575] rounded-3xl flex items-center justify-center mb-6">
                        <Mail size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-[900] text-slate-900 tracking-tighter mb-2 uppercase">Join the Ecosystem</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose mb-8">
                        Get direct access to secret drops, updates, and ecosystem insights.
                    </p>

                    {isSubscribed ? (
                        <div className="w-full py-5 bg-green-50 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} /> Subscribed Successfully
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="w-full space-y-3">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your best email"
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#FF7575]/20 transition-all shadow-sm"
                            />
                            <button 
                                type="submit"
                                className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-xl shadow-black/20 hover:bg-slate-800 transition-all"
                            >
                                Secure Access <ArrowRight size={14} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// Dummy Data for Updates
const PROFILE_UPDATES = [
    { 
        id: 1, 
        title: "Fall Collection Drop", 
        date: "2 days ago", 
        content: "Our highly anticipated Fall collection is finally here. We've added 15 new presets and 3 masterclasses designed to elevate your creative workflow.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop"
    },
    { 
        id: 2, 
        title: "Community Milestone", 
        date: "1 week ago", 
        content: "We just hit 10,000 members in our creative community! Thank you all for the incredible support. We are planning a special event to celebrate.",
        image: null 
    },
    { 
        id: 3, 
        title: "Studio Relocation", 
        date: "2 weeks ago", 
        content: "Exciting news! We are moving our main studio to a larger space in downtown. Expect better content and faster production times.",
        image: null 
    }
];

const ProfileView: React.FC = () => {
  const { profile, setStoryIndex, setHighlightId, setEditingHighlightId, editingHighlightId, addHighlight, view } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  
  // Updated Tab State
  const [activeTab, setActiveTab] = useState<'offers' | 'updates' | 'info'>('offers');
  
  const isPreview = view === 'preview';
  const shouldCenter = isPreview && profile.highlights.length === 1;

  const handleCreateCard = (type: HighlightType) => {
    const newId = `h_${Date.now()}`;
    const newCard: Highlight = {
        id: newId,
        type,
        title: type === 'form' ? 'Custom Order' : 'New ' + type.charAt(0).toUpperCase() + type.slice(1),
        subtitle: 'Tap to edit description',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
        isFeatured: false,
        buttonText: 'View Details',
        styles: {
            variant: 'default',
            backgroundColor: '#ffffff',
            rotation: 0,
            showTags: true,
            buttonColor: '#FF7575',
            buttonTextColor: '#ffffff',
            accentColor: '#FF7575',
            showAccent: true,
            backgroundType: 'solid',
        },
        modalData: {
            features: ['New Item', 'Featured'],
            slides: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop']
        }
    };
    addHighlight(newCard);
    setIsAdding(false);
    
    setTimeout(() => setEditingHighlightId(newId), 100);
  };

  const getCardIcon = (type: HighlightType) => {
     switch(type) {
         case 'product': return <ShoppingBag size={18} />;
         case 'service': return <Scissors size={18} />;
         case 'event': return <Calendar size={18} />;
         case 'form': return <ClipboardList size={18} />;
         case 'media': return <Video size={18} />;
         case 'property': return <Home size={18} />;
         default: return <Bolt size={18} />;
     }
  };

  const getTypeLabel = (type: HighlightType) => {
      switch(type) {
          case 'product': return 'Product';
          case 'service': return 'Service';
          case 'event': return 'RSVP';
          case 'form': return 'Order Form';
          case 'media': return 'Video';
          case 'property': return 'Property';
          default: return 'Link';
      }
  };

  const getCtaLabel = (highlight: Highlight) => {
      if (highlight.buttonText) return highlight.buttonText;
      switch(highlight.type) {
          case 'product': return 'View Product';
          case 'service': return 'Book Now';
          case 'event': return 'RSVP';
          case 'form': return 'Start Order';
          case 'media': return 'Play';
          case 'property': return 'View Details';
          default: return 'Open';
      }
  }

  return (
    <div className="max-w-[500px] mx-auto bg-white min-h-screen relative pb-32 overflow-x-hidden font-poppins">
      <style>{CARD_STYLES}</style>
      
      {/* Background Pattern */}
      <PatternBackground />
      
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />

      {/* Action Buttons (Top Right) */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
          <button 
            onClick={() => setIsNewsletterOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#FF7575] shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
             <Mail size={18} />
          </button>
          <button 
             onClick={() => {
                if (navigator.share) {
                    navigator.share({ title: profile.name, url: window.location.href });
                } else {
                    alert('Link copied to clipboard');
                }
             }}
             className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-lg hover:text-slate-900 hover:scale-110 active:scale-95 transition-all"
          >
             <Share2 size={18} />
          </button>
      </div>

      {/* 2. PROFILE SECTION (Simple, Clean, No Card, No Hero) */}
      <div className="px-6 pt-16 pb-8 flex flex-col items-center text-center relative z-10">
            
            {/* Avatar Ring */}
            <div className="mb-6 group cursor-pointer relative" onClick={() => setStoryIndex(0)}>
                <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#FF7575] to-[#ffaeb6] shadow-xl">
                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white">
                        <img src={profile.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={profile.name} />
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-white text-slate-900 rounded-full p-1.5 shadow-md border border-slate-100">
                    {profile.badges.some(b => b.label === 'Verified') ? <Verified size={14} className="text-blue-500" fill="currentColor" /> : <Sparkles size={14} className="text-[#FF7575]" />}
                </div>
            </div>

            {/* Identity */}
            <h1 className="text-3xl font-[900] text-slate-900 tracking-tighter mb-2 font-poppins leading-none">
                {profile.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7575]">@{profile.handle}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Creator</span>
            </div>
            
            {profile.bio && (
                 <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{profile.bio}</p>
            )}
      </div>

      {/* TABS */}
      <div className="flex items-center justify-center mb-8 relative z-20 px-6">
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full max-w-[320px]">
                {['Offers', 'Updates', 'Info'].map((tab) => {
                    const key = tab.toLowerCase();
                    const isActive = activeTab === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                isActive 
                                ? 'bg-white text-[#FF7575] shadow-md ring-1 ring-slate-100' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>
      </div>

      {/* OFFERS TAB */}
      {activeTab === 'offers' && (
        <section className="agency-portfolio-section relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`portfolio-container ${shouldCenter ? 'justify-center' : ''}`}>
                {profile.highlights.map((highlight) => {
                    const tags = highlight.modalData?.features || [];
                    const styles = highlight.styles || {};
                    const variant = styles.variant || 'default';
                    
                    const txtColor = styles.textColor || '#121212';
                    const accentColor = styles.accentColor || '#FF7575';
                    const btnColor = styles.buttonColor || '#FF7575';
                    const btnTxtColor = styles.buttonTextColor || '#ffffff';
                    
                    // Tag Styles
                    const tagBg = styles.tagBackgroundColor || 'rgba(18,18,18,0.04)';
                    const tagTxt = styles.tagTextColor || 'rgba(18,18,18,0.68)';

                    // Blur Logic
                    const blurValue = styles.backgroundBlur || 0;

                    return (
                        <div 
                            className="woovla-card group" 
                            key={highlight.id} 
                            onClick={() => setHighlightId(highlight.id)}
                            style={{
                                color: txtColor,
                                border: '1px solid rgba(18,18,18,0.06)',
                                transform: styles.rotation ? `rotate(${styles.rotation}deg)` : 'none'
                            }}
                        >
                            {/* Layered Background for Independent Blur */}
                            <div 
                                className="woovla-card-bg"
                                style={{
                                    backgroundColor: styles.backgroundColor || '#ffffff',
                                    backgroundImage: (styles.backgroundType === 'image' && styles.backgroundImage) 
                                        ? `url("${styles.backgroundImage}")` 
                                        : (styles.backgroundType === 'gradient' 
                                            ? `linear-gradient(135deg, ${styles.backgroundColor || '#ffffff'} 0%, ${styles.gradientColor || '#f0f0f0'} 100%)`
                                            : 'none'),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    filter: blurValue > 0 ? `blur(${blurValue}px)` : 'none',
                                    transform: blurValue > 0 ? 'scale(1.1)' : 'none'
                                }}
                            />
                            
                            {/* Card Header */}
                            <div className="w-top">
                                {styles.showImage !== false && (
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-icon" 
                                            style={{ 
                                                backgroundColor: `${accentColor}15`,
                                                borderColor: `${accentColor}25`,
                                                color: accentColor
                                            }}
                                        >
                                            {getCardIcon(highlight.type)}
                                        </div>
                                        {highlight.price && styles.showPrice !== false && (
                                            <div 
                                                className="px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1"
                                                style={{ 
                                                    backgroundColor: '#f1f5f9',
                                                    color: '#475569',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                <Tag size={10} style={{ color: accentColor }} />
                                                {highlight.price}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="w-type" style={{ color: txtColor, opacity: 0.6 }}>
                                    {getTypeLabel(highlight.type)}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="w-content">
                                {styles.showTitle !== false && (
                                    <div className="w-title" style={{ color: txtColor }}>{highlight.title}</div>
                                )}
                                {highlight.subtitle && styles.showSubtitle !== false && (
                                    <p className="w-desc" style={{ color: txtColor, opacity: 0.7 }}>
                                        {highlight.subtitle}
                                    </p>
                                )}
                                
                                {/* Pills */}
                                {styles.showTags !== false && (
                                    <div className="w-pills">
                                        <span className="w-pill" style={{ backgroundColor: tagBg, color: tagTxt, border: '1px solid rgba(18,18,18,0.06)' }}>
                                            <Tag size={11} style={{ color: accentColor }} />
                                            {highlight.type}
                                        </span>
                                        {tags.slice(0, 2).map((t, i) => (
                                            <span key={i} className="w-pill" style={{ backgroundColor: tagBg, color: tagTxt, border: '1px solid rgba(18,18,18,0.06)' }}>
                                                <CheckCircle2 size={11} style={{ color: accentColor }} />
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <div className="w-cta flex gap-2">
                                {!isPreview && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setEditingHighlightId(highlight.id); }}
                                        className="w-12 h-[46px] rounded-xl flex items-center justify-center transition-colors"
                                        style={{ 
                                            backgroundColor: '#f8fafc', 
                                            color: '#94a3b8' 
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                                <button 
                                    className="w-btn-full"
                                    style={{ backgroundColor: btnColor, color: btnTxtColor }}
                                >
                                    {getCtaLabel(highlight)} <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Add Card Button */}
                {!isPreview && (
                    <div className="woovla-card flex items-center justify-center bg-slate-50 border-dashed border-2 border-slate-200 shadow-none hover:shadow-none hover:translate-y-0 min-h-[280px]">
                        <button onClick={() => setIsAdding(true)} className="flex flex-col items-center gap-4 group/add">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-300 group-hover/add:text-[#FF7575] group-hover/add:scale-110 transition-all">
                                <Plus size={32} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/add:text-[#FF7575]">Add Card</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
      )}

      {/* UPDATES TAB */}
      {activeTab === 'updates' && (
        <div className="px-6 pb-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            {PROFILE_UPDATES.map(update => (
                <div key={update.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7575] border border-[#FFE4E4]">
                                <Bell size={18} />
                            </div>
                            <div>
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide block">{update.title}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{update.date}</span>
                            </div>
                        </div>
                    </div>
                    {update.image && (
                        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 aspect-video">
                            <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{update.content}</p>
                </div>
            ))}
        </div>
      )}

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="px-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            {/* About / History */}
            <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                        <History size={20} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Our Story</h3>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-loose">
                    Founded in 2023, {profile.name} began with a simple mission: to create digital experiences that matter. 
                    What started in a small studio has grown into a vibrant community of creators and innovators.
                    We believe in the power of simplicity, the beauty of function, and the importance of connection.
                    Every product we launch is a testament to our dedication to quality and design.
                </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">Connect</h3>
                <div className="grid grid-cols-1 gap-3">
                    {profile.links.map(link => (
                        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-[#FF7575] hover:shadow-sm transition-all group">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#FF7575] group-hover:text-white transition-colors border border-slate-100">
                                {/* Icon logic based on platform */}
                                {ICON_MAP[link.platform] || <Globe size={18} />}
                            </div>
                            <span className="text-xs font-bold text-slate-700 capitalize">{link.platform === 'twitter' ? 'X / Twitter' : link.platform}</span>
                            <div className="ml-auto p-2 rounded-full bg-slate-50 text-slate-300 group-hover:text-[#FF7575] group-hover:bg-white transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
      )}
      
      {isAdding && (
          <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase font-poppins">Select Action Type</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimized for Conversion</p>
                      </div>
                      <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300"><Plus size={20} className="rotate-45" /></button>
                  </div>
                  <div className="p-6 grid gap-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                      {CARD_TYPES.map((t) => (
                          <button key={t.type} onClick={() => handleCreateCard(t.type)} className="flex items-center gap-5 p-5 rounded-3xl border border-slate-100 hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all group text-left">
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#FF7575] group-hover:text-white transition-colors">
                                  <t.icon size={24} />
                              </div>
                              <div>
                                  <h4 className="text-sm font-black text-slate-800 group-hover:text-[#FF7575] uppercase">{t.label}</h4>
                                  <p className="text-[10px] text-slate-400 font-medium">{t.description}</p>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {editingHighlightId && <CardEditorModal />}

      <div className="mt-8 flex flex-col items-center">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-8" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-200">WOOVLA ACTION HUB</span>
      </div>
    </div>
  );
};

export default ProfileView;