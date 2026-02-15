
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
    ArrowRight, Check, ShoppingBag, Clock, Calendar, FileText, 
    Play, Home, Sparkles, Upload, Mail, Lock, 
    User, Link as LinkIcon, Layout, ArrowLeft, Loader2, Star, Zap
} from 'lucide-react';
import { HighlightType, Highlight } from '../../types';

// --- SUB-COMPONENTS ---

const OnboardingInput = ({ value, onChange, placeholder, type = "text", autoFocus = false, prefix, onEnter }: any) => (
  <div className="relative group transition-all duration-300 w-full max-w-sm mx-auto">
      {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg select-none">
              {prefix}
          </span>
      )}
      <input 
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnter && value) onEnter();
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-slate-50 border-2 border-transparent focus:border-[#FF7575] focus:bg-white rounded-2xl ${prefix ? 'pl-10' : 'pl-6'} pr-6 py-5 text-xl font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 shadow-sm focus:shadow-xl focus:shadow-[#FF7575]/10`}
      />
  </div>
);

const StepContainer = ({ children, title, subtitle }: any) => (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-500 w-full px-6">
        <h2 className="text-3xl md:text-4xl font-[900] text-slate-900 tracking-tighter mb-3 leading-tight max-w-md mx-auto">
            {title}
        </h2>
        {subtitle && (
            <p className="text-slate-400 font-medium text-base mb-10 max-w-sm mx-auto leading-relaxed">
                {subtitle}
            </p>
        )}
        <div className="w-full max-w-md mx-auto">
            {children}
        </div>
    </div>
);

const PrimaryButton = ({ onClick, disabled, children, variant = 'primary', className = '' }: any) => (
  <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-sm mx-auto py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform shadow-xl active:scale-[0.98] ${className} ${
          disabled 
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none scale-100' 
          : variant === 'primary' 
            ? 'bg-[#FF7575] text-white hover:bg-[#ff6161] shadow-[#FF7575]/30 hover:-translate-y-1'
            : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20 hover:-translate-y-1'
      }`}
  >
      {children}
  </button>
);

// --- MAIN COMPONENT ---

const Onboarding: React.FC = () => {
  const { setHasCompletedOnboarding, updateProfile, addHighlight } = useStore();
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop');
  
  const [selectedType, setSelectedType] = useState<HighlightType | null>(null);
  
  // Card Details
  const [cardTitle, setCardTitle] = useState('');
  const [cardPrice, setCardPrice] = useState('');
  const [isExternal, setIsExternal] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const CARD_TYPES: { type: HighlightType; label: string; icon: any; description: string }[] = [
    { type: 'product', label: 'Product', icon: ShoppingBag, description: 'Sell goods' },
    { type: 'service', label: 'Service', icon: Clock, description: 'Bookings' },
    { type: 'event', label: 'Event', icon: Calendar, description: 'Tickets' },
    { type: 'form', label: 'Form', icon: FileText, description: 'Leads' },
    { type: 'media', label: 'Media', icon: Play, description: 'Content' },
    { type: 'property', label: 'Property', icon: Home, description: 'Listings' },
  ];

  const finishOnboarding = () => {
      setLoading(true);
      
      // Simulate API delay for effect
      setTimeout(() => {
        updateProfile({ name, handle, bio: `Welcome to my official ${name} page.`, avatar });

        if (selectedType && cardTitle) {
            const newCard: Highlight = {
                id: `h_${Date.now()}`,
                type: selectedType,
                title: cardTitle,
                subtitle: selectedType === 'product' ? 'Best Seller' : 'New Offering',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
                price: cardPrice,
                isFeatured: true,
                buttonText: isExternal ? 'Visit Link' : (selectedType === 'service' ? 'Book Now' : 'Buy Now'),
                styles: {
                    backgroundColor: '#ffffff',
                    rotation: 0,
                    showTags: true,
                    buttonColor: '#FF7575',
                    buttonTextColor: '#ffffff'
                },
                modalData: {
                    useExternalLink: isExternal,
                    redirectUrl: isExternal ? externalUrl : undefined,
                    features: ['New Item', 'Featured'],
                    slides: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop']
                }
            };
            addHighlight(newCard);
        }

        setHasCompletedOnboarding(true);
      }, 1500);
  };

  const devSkipOnboarding = () => {
      setLoading(true);
      setTimeout(() => {
          updateProfile({ 
              name: "Demo Creator", 
              handle: "demo", 
              bio: "This is a demo profile generated for development purposes.", 
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" 
          });

          const newCard: Highlight = {
            id: `h_${Date.now()}`,
            type: 'product',
            title: 'Demo Product',
            subtitle: 'Best Seller',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
            price: '$49.00',
            isFeatured: true,
            buttonText: 'Buy Now',
            styles: {
                backgroundColor: '#ffffff',
                rotation: 0,
                showTags: true,
                buttonColor: '#FF7575',
                buttonTextColor: '#ffffff'
            },
            modalData: {
                useExternalLink: false,
                features: ['Instant Access', 'High Quality'],
                slides: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop']
            }
        };
        addHighlight(newCard);

        setHasCompletedOnboarding(true);
      }, 500);
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(0, s - 1));

  // --- INTRO CAROUSEL ---

  const IntroSlide = ({ title, desc, icon: Icon, index }: any) => (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#FF7575] to-[#ff9eb5] rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-[#FF7575]/30 text-white transform hover:scale-105 transition-transform">
              <Icon size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tighter mb-4 leading-tight">{title}</h2>
          <p className="text-slate-400 font-medium leading-relaxed max-w-xs text-lg">{desc}</p>
          
          <div className="flex gap-2 mt-12">
              {[0, 1, 2].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-[#FF7575]' : 'w-2 bg-slate-200'}`} />
              ))}
          </div>
      </div>
  );

  if (step < 3) {
      return (
        <div className="fixed inset-0 z-[999] bg-white flex flex-col font-inter">
            <div className="flex-1 relative">
                {step === 0 && <IntroSlide index={0} title="Build Visually" desc="Create a stunning mobile website in minutes. No coding required." icon={Layout} />}
                {step === 1 && <IntroSlide index={1} title="Monetize Everything" desc="Sell products, services, and bookings directly from your bio." icon={ShoppingBag} />}
                {step === 2 && <IntroSlide index={2} title="Own Your Audience" desc="Collect emails and grow your community without limits." icon={Zap} />}
            </div>
            <div className="p-8 pb-12 w-full max-w-md mx-auto">
                <PrimaryButton onClick={handleNext}>
                    {step === 2 ? 'Get Started' : 'Next'} <ArrowRight size={16} />
                </PrimaryButton>
                {step < 2 && (
                    <button onClick={() => setStep(3)} className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-800 transition-colors">
                        Skip Intro
                    </button>
                )}
                
                {/* Developer Skip */}
                <button 
                    onClick={devSkipOnboarding}
                    className="w-full mt-4 py-3 rounded-xl border border-dashed border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#FF7575] hover:border-[#FF7575] hover:bg-[#FF7575]/5 transition-all"
                >
                    [Dev] Skip All
                </button>
            </div>
        </div>
      );
  }

  // --- LOADING STATE ---
  if (loading) {
      return (
          <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center font-inter">
              <div className="w-16 h-16 border-4 border-[#FF7575]/20 border-t-[#FF7575] rounded-full animate-spin mb-8" />
              <h2 className="text-2xl font-[900] text-slate-900 tracking-tight mb-2">Setting up your profile...</h2>
              <p className="text-slate-400 font-medium">Getting everything ready for you.</p>
          </div>
      );
  }

  // --- FORM STEPS ---

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center font-inter p-4 overflow-y-auto">
        
        {/* Progress Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm">
            <button onClick={handleBack} className="p-2 -ml-2 text-slate-300 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex gap-1.5">
                {[3, 4, 5, 6, 7, 8, 9].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-4 bg-[#FF7575]' : 'w-1.5 bg-slate-100'}`} />
                ))}
            </div>
        </div>

        <div className="w-full h-full flex flex-col pt-16 pb-8">

            {/* Step 3: Email */}
            {step === 3 && (
                <StepContainer title="Let's get started." subtitle="What is your best email address?">
                    <OnboardingInput 
                        icon={Mail} 
                        value={email} 
                        onChange={(e: any) => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        type="email" 
                        autoFocus
                        onEnter={handleNext}
                    />
                    <div className="mt-8">
                        <PrimaryButton onClick={handleNext} disabled={!email || !email.includes('@')}>
                            Next <ArrowRight size={16} />
                        </PrimaryButton>
                    </div>
                </StepContainer>
            )}

            {/* Step 4: Password */}
            {step === 4 && (
                <StepContainer title="Secure your account." subtitle="Pick a strong password.">
                    <OnboardingInput 
                        icon={Lock} 
                        value={password} 
                        onChange={(e: any) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        type="password" 
                        autoFocus
                        onEnter={handleNext}
                    />
                    <div className="mt-8">
                        <PrimaryButton onClick={handleNext} disabled={!password || password.length < 6}>
                            Create Account <ArrowRight size={16} />
                        </PrimaryButton>
                    </div>
                </StepContainer>
            )}

            {/* Step 5: Handle */}
            {step === 5 && (
                <StepContainer title="Claim your link." subtitle="This will be your unique URL on Woovla.">
                    <OnboardingInput 
                        prefix="@"
                        value={handle} 
                        onChange={(e: any) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
                        placeholder="username" 
                        autoFocus
                        onEnter={handleNext}
                    />
                    <div className="mt-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-mono text-slate-400 border border-slate-100">
                            woovla.com/{handle || 'username'}
                        </span>
                    </div>
                    <div className="mt-8">
                        <PrimaryButton onClick={handleNext} disabled={!handle}>
                            Claim Link <Sparkles size={16} />
                        </PrimaryButton>
                    </div>
                </StepContainer>
            )}

            {/* Step 6: Brand Name */}
            {step === 6 && (
                <StepContainer title="What do people call you?" subtitle="This is the main name displayed on your profile.">
                    <div className="flex justify-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-100">
                                <img src={avatar} className="w-full h-full object-cover" />
                            </div>
                            <button 
                                onClick={() => setAvatar(`https://images.unsplash.com/photo-${Math.floor(Math.random()*1000)}?q=80&w=500&auto=format&fit=crop`)}
                                className="absolute bottom-0 right-0 bg-white text-slate-900 p-2.5 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform"
                            >
                                <Upload size={14} />
                            </button>
                        </div>
                    </div>
                    
                    <OnboardingInput 
                        value={name} 
                        onChange={(e: any) => setName(e.target.value)} 
                        placeholder="e.g. Sarah Design" 
                        autoFocus
                        onEnter={handleNext}
                    />
                    <div className="mt-8">
                        <PrimaryButton onClick={handleNext} disabled={!name}>
                            Looks Good <Check size={16} />
                        </PrimaryButton>
                    </div>
                </StepContainer>
            )}

            {/* Step 7: Selection (Grid) */}
            {step === 7 && (
                 <StepContainer title="What is your focus?" subtitle="Choose what you want to add first. You can add more later.">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        {CARD_TYPES.map((t) => (
                            <button
                                key={t.type}
                                onClick={() => setSelectedType(t.type)}
                                className={`p-5 rounded-[24px] border-2 transition-all flex flex-col justify-between h-[140px] ${
                                    selectedType === t.type 
                                    ? 'border-[#FF7575] bg-[#FF7575]/5 shadow-xl shadow-[#FF7575]/10' 
                                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    selectedType === t.type ? 'bg-[#FF7575] text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <t.icon size={20} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-black uppercase tracking-wide mb-1 ${selectedType === t.type ? 'text-[#FF7575]' : 'text-slate-800'}`}>{t.label}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold leading-tight opacity-70">{t.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="mt-8">
                         <PrimaryButton onClick={handleNext} disabled={!selectedType}>
                            Continue <ArrowRight size={16} />
                        </PrimaryButton>
                    </div>
                 </StepContainer>
            )}

            {/* Step 8: Card Creation */}
            {step === 8 && (
                <StepContainer 
                    title={selectedType === 'product' ? "What are you selling?" : selectedType === 'service' ? "What do you offer?" : "Let's add the details."}
                    subtitle={`Create your first ${selectedType}.`}
                >
                    <div className="bg-slate-50 p-1.5 rounded-xl flex mb-6 mx-auto max-w-sm">
                        <button 
                            onClick={() => setIsExternal(false)}
                            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isExternal ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >
                            Native Item
                        </button>
                        <button 
                            onClick={() => setIsExternal(true)}
                            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isExternal ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >
                            External Link
                        </button>
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto">
                        <input 
                            value={cardTitle} 
                            onChange={(e: any) => setCardTitle(e.target.value)} 
                            placeholder={selectedType === 'service' ? 'e.g. 1 Hour Strategy' : selectedType === 'product' ? 'e.g. Lightroom Presets' : 'Item Title'} 
                            autoFocus
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FF7575] focus:bg-white rounded-2xl px-6 py-4 text-base font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                        />
                         
                         {isExternal ? (
                            <div className="relative">
                                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    value={externalUrl} 
                                    onChange={(e: any) => setExternalUrl(e.target.value)} 
                                    placeholder="https://..." 
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FF7575] focus:bg-white rounded-2xl pl-12 pr-6 py-4 text-base font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input 
                                    value={cardPrice} 
                                    onChange={(e: any) => setCardPrice(e.target.value)} 
                                    placeholder="0.00" 
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FF7575] focus:bg-white rounded-2xl pl-8 pr-6 py-4 text-base font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <PrimaryButton onClick={handleNext} disabled={!cardTitle || (isExternal && !externalUrl)}>
                            Next <ArrowRight size={16} />
                        </PrimaryButton>
                    </div>
                </StepContainer>
            )}

            {/* Step 9: Final Review / Integrations */}
            {step === 9 && (
                 <StepContainer title="Power Ups." subtitle="Connect your tools to automate everything. (Optional)">
                    <div className="space-y-3 mb-8 max-w-sm mx-auto">
                        {[
                            { id: 'stripe', name: 'Stripe', desc: 'Payments' },
                            { id: 'cal', name: 'Calendly', desc: 'Bookings' },
                            { id: 'mail', name: 'Mailchimp', desc: 'Email List' },
                        ].map((tool) => {
                             const isSelected = selectedIntegrations.includes(tool.id);
                             return (
                                <button 
                                    key={tool.id}
                                    onClick={() => isSelected ? setSelectedIntegrations(selectedIntegrations.filter(x => x !== tool.id)) : setSelectedIntegrations([...selectedIntegrations, tool.id])}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-[#FF7575] bg-[#FF7575]/5' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#FF7575] text-white' : 'bg-white text-slate-400'}`}>
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`text-base font-black ${isSelected ? 'text-[#FF7575]' : 'text-slate-800'}`}>{tool.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#FF7575] bg-[#FF7575]' : 'border-slate-200 bg-white'}`}>
                                        {isSelected && <Check size={16} className="text-white" strokeWidth={3} />}
                                    </div>
                                </button>
                             );
                        })}
                    </div>

                    <PrimaryButton onClick={finishOnboarding} variant="primary">
                        Launch Woovla <Sparkles size={16} />
                    </PrimaryButton>
                 </StepContainer>
            )}

        </div>
    </div>
  );
};

export default Onboarding;
