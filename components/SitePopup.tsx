
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

const SitePopup: React.FC = () => {
  const { profile, isPopupEditorOpen } = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const popup = profile.popup;

  // Re-open if editor is toggled on (so user can see changes)
  useEffect(() => {
      if (isPopupEditorOpen) setIsOpen(true);
  }, [isPopupEditorOpen]);

  if (!popup?.isEnabled || !isOpen) return null;

  const borderRadius = popup.style.cornerRadius === 'large' ? '32px' : popup.style.cornerRadius === 'small' ? '12px' : '0px';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div 
            className="relative w-full max-w-[340px] shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col" 
            style={{ 
                 borderRadius: borderRadius,
                 backgroundColor: popup.style.backgroundColor,
                 overflow: 'hidden'
            }}
        >
             <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }} 
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10"
             >
                <X size={16} />
             </button>
             
             {/* Poster Image (Clickable) */}
             <a 
                href={popup.buttonLink || '#'}
                target="_blank"
                rel="noreferrer"
                className={`block w-full ${!popup.buttonLink ? 'pointer-events-none' : 'cursor-pointer active:opacity-95 transition-opacity'}`}
             >
                 <img 
                    src={popup.image} 
                    className="w-full h-auto object-contain block" 
                    alt="Special Offer"
                 />
             </a>
        </div>
    </div>
  );
};

export default SitePopup;
