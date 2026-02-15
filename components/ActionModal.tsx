
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
    X, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, ExternalLink,
    Edit2, CreditCard, Truck, Calendar, MapPin
} from 'lucide-react';
import { HighlightModalData } from '../types';

const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0'+m : m} ${suffix}`;
};

const DEMO_IMAGE = "https://i.pinimg.com/736x/a7/0d/bf/a70dbf345a201cbd0316a690c9a63bf1.jpg";

const ActionModal: React.FC = () => {
  const { 
      profile, activeHighlightId, setHighlightId,
      services, products, events, properties, forms,
      view, setEditingHighlightId
  } = useStore();
  
  const highlight = profile.highlights.find(h => h.id === activeHighlightId);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Booking Selection State
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!highlight) return null;

  const modalData: HighlightModalData = highlight.modalData || {};

  // RESOLVE LINKED ENTITY DATA
  let linkedEntity: any = null;
  if (highlight.type === 'service' && modalData.serviceId) linkedEntity = services.find(s => s.id === modalData.serviceId);
  if (highlight.type === 'product' && modalData.productId) linkedEntity = products.find(p => p.id === modalData.productId);
  if (highlight.type === 'event' && modalData.eventId) linkedEntity = events.find(e => e.id === modalData.eventId);
  if (highlight.type === 'property' && modalData.propertyId) linkedEntity = properties.find(p => p.id === modalData.propertyId);
  if (highlight.type === 'form' && modalData.formId) linkedEntity = forms.find(f => f.id === modalData.formId);

  // Unified Data Accessors
  const displayTitle = highlight.title || linkedEntity?.title;
  // Use specific modal description if available, otherwise fallback to card subtitle/description
  const displaySubtitle = modalData.description || highlight.subtitle || linkedEntity?.description;
  const displayPrice = highlight.price || linkedEntity?.price;
  
  // Use specific demo image if none present, or override for this specific request context if needed
  const isDefaultImage = highlight.image?.includes('unsplash') || !highlight.image;
  
  let rawSlides = (modalData.slides && modalData.slides.length > 0 && modalData.slides[0] !== '') 
        ? modalData.slides 
        : (linkedEntity?.images || (linkedEntity?.image ? [linkedEntity.image] : [highlight.image]));

  // Ensure we have valid slides, swapping defaults for the requested demo image
  const displaySlides = rawSlides.map(s => (s && s.includes('unsplash')) ? DEMO_IMAGE : s);
  // If explicitly empty, use demo image
  if (displaySlides.length === 0) displaySlides.push(DEMO_IMAGE);


  const displayFeatures = (modalData.features && modalData.features.length > 0) ? modalData.features : (linkedEntity?.features || []);
  const displayButtonText = modalData.buttonText || linkedEntity?.buttonText || highlight.buttonText;
  
  // Style overrides - prioritize modal specific styles, fallback to card styles
  const modalStyles = highlight.modalData?.styles || {};
  
  // Fallback chain for button color
  let btnColor = modalStyles.buttonColor;
  if (!btnColor) {
      // If no specific modal button color, use card button color, 
      // but ensure it's not white-on-white
      const cardBtnColor = highlight.styles?.buttonColor;
      if (cardBtnColor && (cardBtnColor.toLowerCase() === '#ffffff' || cardBtnColor.toLowerCase() === '#fff' || cardBtnColor.toLowerCase() === 'white')) {
          btnColor = '#000000'; // Default black for visibility
      } else {
          btnColor = cardBtnColor || '#000000';
      }
  }
  
  const btnTextColor = modalStyles.buttonTextColor || highlight.styles?.buttonTextColor || '#ffffff';
  
  // Modal Background
  const modalBg = modalStyles.backgroundColor || '#ffffff';
  const modalText = modalStyles.textColor || '#000000';

  // Auto-scroll logic
  useEffect(() => {
    if (!displaySlides || displaySlides.length <= 1) return;
    const interval = setInterval(() => {
        setActiveSlide(s => (s + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displaySlides]);

  // Helper to generate slots
  const getGeneratedSlots = () => {
      if (!selectedDate) return [];
      const startTime = linkedEntity?.availability?.startTime || '09:00';
      const endTime = linkedEntity?.availability?.endTime || '17:00';
      const duration = linkedEntity?.duration || 60;
      
      const slots = [];
      let current = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      
      while (current < end) {
          const timeString = current.toTimeString().substring(0, 5);
          slots.push(formatTime(timeString));
          current.setMinutes(current.getMinutes() + duration);
      }
      return slots;
  };
  const generatedSlots = getGeneratedSlots();

  const handleMainAction = () => {
      // 1. Media Type - Direct External Action
      if (highlight.type === 'media') {
          const url = modalData.redirectUrl || highlight.externalLink || (displaySlides[0] && displaySlides[0].startsWith('http') ? displaySlides[0] : null);
          if (url) {
              window.open(url, '_blank');
          } else {
              alert("No external video link configured.");
          }
          return;
      }

      // 2. Explicit External Link Override
      if (modalData.useExternalLink && modalData.redirectUrl) {
          window.open(modalData.redirectUrl, '_blank');
          return;
      }

      // 3. Open Internal Form Flow
      setIsFormOpen(true);
      setFormStep(1); // Reset step
  };

  const renderForm = () => {
      // SUCCESS STATE
      if (formSubmitted) {
          return (
              <div className="flex flex-col items-center justify-center text-center h-full py-10 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirmed</h3>
                  <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
                      We've received your request and will be in touch shortly.
                  </p>
                  <button onClick={() => setHighlightId(null)} className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800">
                      Close
                  </button>
              </div>
          );
      }

      // BOOKING FLOW (Service OR Property)
      if ((highlight.type === 'service' || highlight.type === 'property') && formStep === 1) {
          return (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {highlight.type === 'property' ? 'Schedule Viewing' : 'Select Time'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Choose a slot for your {highlight.type === 'property' ? 'visit' : 'session'}.</p>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                        {[24, 25, 26, 27, 28].map((d) => (
                            <button
                                key={d}
                                onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedDate === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
                            >
                                <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-60">Oct</span>
                                <span className="text-base font-black">{d}</span>
                            </button>
                        ))}
                   </div>
                   
                   {selectedDate && (
                       <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto no-scrollbar">
                           {generatedSlots.map((slot) => (
                               <button
                                  key={slot}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-3 px-1 rounded-xl text-[10px] font-bold border transition-all ${selectedSlot === slot ? 'bg-[#A8683E] text-white border-[#A8683E]' : 'bg-white border-slate-100 text-slate-600'}`}
                               >
                                   {slot}
                               </button>
                           ))}
                       </div>
                   )}

                   <div className="flex gap-3 mt-4">
                        <button onClick={() => setIsFormOpen(false)} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Back
                        </button>
                        <button 
                            disabled={!selectedDate || !selectedSlot}
                            onClick={() => setFormStep(2)}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all ${!selectedDate || !selectedSlot ? 'bg-slate-200 cursor-not-allowed' : 'bg-[#A8683E]'}`}
                        >
                            Next
                        </button>
                   </div>
              </div>
          )
      }

      // PRODUCT CHECKOUT FLOW
      if (highlight.type === 'product') {
          // Step 1: Shipping
          if (formStep === 1) {
              return (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck size={18} className="text-slate-900" />
                        <h3 className="text-xl font-bold text-slate-900">Shipping</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <input placeholder="Full Name" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                        <input placeholder="Street Address" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                        <div className="flex gap-3">
                            <input placeholder="City" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                            <input placeholder="Zip" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setIsFormOpen(false)} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Back
                        </button>
                        <button 
                            onClick={() => setFormStep(2)}
                            className="flex-1 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black"
                        >
                            To Payment
                        </button>
                    </div>
                </div>
              );
          }
          // Step 2: Payment
          if (formStep === 2) {
              return (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={18} className="text-slate-900" />
                        <h3 className="text-xl font-bold text-slate-900">Payment</h3>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl space-y-4 border border-slate-100">
                         <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                             <span className="text-xs font-bold text-slate-500">Total</span>
                             <span className="text-lg font-black text-slate-900">{displayPrice || '$0.00'}</span>
                         </div>
                         <div className="space-y-3">
                            <input placeholder="Card Number" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 outline-none focus:border-slate-900" />
                            <div className="flex gap-3">
                                <input placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 outline-none focus:border-slate-900" />
                                <input placeholder="CVC" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 outline-none focus:border-slate-900" />
                            </div>
                         </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setFormStep(1)} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Back
                        </button>
                        <button 
                            onClick={() => setFormSubmitted(true)}
                            className="flex-1 py-4 rounded-2xl bg-[#A8683E] text-white text-[10px] font-black uppercase tracking-widest shadow-xl"
                        >
                            Pay {displayPrice}
                        </button>
                    </div>
                </div>
              );
          }
      }

      // CUSTOM FORM FLOW (DYNAMIC FIELDS)
      if (highlight.type === 'form') {
           const formFields = linkedEntity?.fields || modalData.formFields || [];
           
           return (
              <div className="space-y-4 animate-in slide-in-from-right-4 text-left">
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {linkedEntity?.title || 'Get in Touch'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Please fill out the details below.</p>
                   </div>
                   
                   <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                       <input placeholder="Full Name" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                       <input placeholder="Email Address" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                       
                       {formFields.map((field: any, idx: number) => {
                           if (field.type === 'select') {
                               return (
                                   <div key={idx} className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                                        <div className="relative">
                                            <select className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 appearance-none">
                                                <option value="">Select an option...</option>
                                                {field.options?.map((opt: string, i: number) => (
                                                    <option key={i} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                   </div>
                               )
                           }
                           if (field.type === 'textarea') {
                               return (
                                   <div key={idx} className="space-y-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                                        <textarea 
                                            placeholder={field.placeholder} 
                                            className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 min-h-[80px] resize-none" 
                                        />
                                   </div>
                               )
                           }
                           return (
                                <div key={idx} className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                                    <input 
                                        type={field.type} 
                                        placeholder={field.placeholder} 
                                        className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" 
                                    />
                                </div>
                           )
                       })}
                   </div>

                   <div className="flex gap-3 mt-4">
                        <button onClick={() => { setIsFormOpen(false); }} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Back
                        </button>
                        <button 
                            onClick={() => setFormSubmitted(true)}
                            className="flex-1 py-4 rounded-2xl bg-[#A8683E] text-white text-[10px] font-black uppercase tracking-widest shadow-xl"
                        >
                            {linkedEntity?.buttonText || 'Submit'}
                        </button>
                   </div>
              </div>
           );
      }

      // GENERIC / FALLBACK FLOW
      return (
          <div className="space-y-4 animate-in slide-in-from-right-4">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {highlight.type === 'event' ? 'RSVP' : 'Get in Touch'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Finalize your request.</p>
               </div>
               
               <div className="space-y-3">
                   <input placeholder="Full Name" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                   <input placeholder="Email Address" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" />
                   <textarea placeholder="Message / Notes" className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 min-h-[80px] resize-none" />
               </div>

               <div className="flex gap-3 mt-4">
                    <button onClick={() => { setFormStep(1); setIsFormOpen(false); }} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Back
                    </button>
                    <button 
                        onClick={() => setFormSubmitted(true)}
                        className="flex-1 py-4 rounded-2xl bg-[#A8683E] text-white text-[10px] font-black uppercase tracking-widest shadow-xl"
                    >
                        Confirm
                    </button>
               </div>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300 font-poppins">
      <div 
        className="w-[90%] max-w-[360px] rounded-[40px] overflow-visible shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ backgroundColor: modalBg }}
      >
        
        {/* CLOSE BUTTON */}
        <button 
            onClick={() => setHighlightId(null)}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10"
        >
            <X size={16} strokeWidth={2.5} />
        </button>

        {/* EDIT BUTTON (Admin Only) */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                setEditingHighlightId(highlight.id);
            }}
            className="absolute top-4 left-4 z-50 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10"
            title="Edit this card"
        >
            <Edit2 size={14} />
        </button>

        {/* 1. IMAGE SECTION */}
        <div className="relative w-full aspect-[4/3] bg-slate-100 shrink-0 group rounded-t-[40px] overflow-hidden">
             {displaySlides.map((slide, i) => (
                 <div 
                    key={i} 
                    className={`absolute inset-0 transition-opacity duration-700 ${i === activeSlide ? 'opacity-100' : 'opacity-0'}`}
                 >
                     <img src={slide} className="w-full h-full object-cover" />
                 </div>
             ))}

             {/* Fade Overlay */}
             <div 
                className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none" 
                style={{ background: `linear-gradient(to top, ${modalBg}, ${modalBg}E6, transparent)` }}
             />

             {/* Navigation Arrows */}
             {displaySlides.length > 1 && (
                 <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveSlide(s => s === 0 ? displaySlides.length - 1 : s - 1); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 hover:scale-110 active:scale-90 transition-all shadow-md z-20"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveSlide(s => s === displaySlides.length - 1 ? 0 : s + 1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 hover:scale-110 active:scale-90 transition-all shadow-md z-20"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                 </>
             )}

             {/* Indicators */}
             {displaySlides.length > 1 ? (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                    {displaySlides.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm backdrop-blur-md ${
                                i === activeSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/60'
                            }`} 
                        />
                    ))}
                </div>
             ) : (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 backdrop-blur-md rounded-full z-20" />
             )}
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="flex-1 relative flex flex-col px-6 pt-5 pb-6 rounded-b-[40px] overflow-visible text-center" style={{ color: modalText }}>
            
            <div className="overflow-y-auto no-scrollbar -mx-2 px-2 flex-1">
                {isFormOpen ? (
                    renderForm()
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center h-full">
                        {/* Eyebrow */}
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 block opacity-60">
                            {modalData.tagline || highlight.type} Collection
                        </span>

                        {/* Title */}
                        <h2 className="text-4xl font-[900] mb-3 leading-[0.9] tracking-tighter w-full">
                            {displayTitle}
                        </h2>

                        {/* Description */}
                        <p className="text-sm font-medium opacity-60 leading-relaxed mb-6 w-full">
                            {displaySubtitle}
                        </p>

                        {/* Feature Grid */}
                        {displayFeatures.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-6 w-full">
                                {displayFeatures.slice(0, 6).map((f, i) => (
                                    <div key={i} className="border border-current opacity-60 rounded-full py-2 px-1 flex items-center justify-center text-center" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                        <span className="text-[8px] font-black uppercase tracking-wider truncate w-full opacity-80">{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Button */}
                        <div className="mt-auto w-full">
                            <button 
                                onClick={handleMainAction}
                                className="w-full py-4 rounded-full font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                style={{ backgroundColor: btnColor, color: btnTextColor }}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">{displayButtonText}</span>
                                <ExternalLink size={14} className="relative z-10" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ActionModal;