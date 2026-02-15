
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryViewer: React.FC = () => {
  const { profile, activeStoryIndex, setStoryIndex } = useStore();
  const [index, setIndex] = useState(activeStoryIndex || 0);
  const slide = profile.stories[index];

  const next = () => {
    if (index < profile.stories.length - 1) setIndex(index + 1);
    else setStoryIndex(null);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  useEffect(() => {
    const timer = setTimeout(next, 5000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative w-full max-w-[480px] h-full overflow-hidden bg-slate-900">
        {/* Progress Bars */}
        <div className="absolute top-4 left-0 right-0 px-4 z-20 flex gap-1">
          {profile.stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${i < index ? 'w-full' : i === index ? 'w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 px-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile.avatar} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
            <span className="text-white text-xs font-black uppercase tracking-widest">{profile.name}</span>
          </div>
          <button onClick={() => setStoryIndex(null)} className="text-white p-2">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="h-full w-full flex items-center justify-center">
          {slide.type === 'image' ? (
            <img src={slide.content} className="w-full h-full object-cover" />
          ) : (
            <div className="px-12 text-center">
               <h2 className="text-4xl font-black text-white leading-tight mb-4">{slide.title}</h2>
               <p className="text-xl text-white/80 font-medium">{slide.content}</p>
            </div>
          )}
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={next} />
        
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-0 hover:opacity-100">
          <ChevronLeft className="text-white" size={40} />
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 hover:opacity-100">
          <ChevronRight className="text-white" size={40} />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
