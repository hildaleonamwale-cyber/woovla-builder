
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';

const PatternBackground: React.FC = () => {
  const { pageSettings } = useStore();
  const pattern = pageSettings.backgroundPattern || 'none';

  if (pattern === 'none') return null;

  // Generate random particles for 'polka' or 'stars'
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -20}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${8 + Math.random() * 12}s`,
      opacity: 0.15 + Math.random() * 0.35,
      size: pattern === 'stars' ? 2 + Math.random() * 3 : 4 + Math.random() * 10,
      floatOffset: `${Math.random() * 40 - 20}px`
    }));
  }, [pattern]);

  return (
    <div className="absolute inset-x-0 top-0 h-[320px] overflow-hidden pointer-events-none select-none z-0">
       <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 via-white/40 to-white z-10" />
       
       {pattern === 'polka' && (
         <div className="w-full h-full relative">
            {particles.map((p, i) => (
                <div 
                    key={i}
                    className="absolute rounded-full bg-[#FF7575] animate-float-down"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        opacity: p.opacity,
                        animationDelay: p.animationDelay,
                        animationDuration: p.animationDuration,
                        // @ts-ignore
                        '--float-offset': p.floatOffset
                    }}
                />
            ))}
         </div>
       )}

       {pattern === 'stars' && (
          <div className="w-full h-full relative">
              {particles.map((p, i) => (
                  <div 
                      key={i}
                      className="absolute rounded-full bg-slate-800 animate-twinkle"
                      style={{
                          left: p.left,
                          top: `${Math.random() * 60}%`, // Stars are static distributed
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          opacity: p.opacity
                      }}
                  />
              ))}
          </div>
       )}
       
       {pattern === 'grid' && (
           <div 
             className="w-full h-full opacity-[0.05]"
             style={{
                 backgroundImage: `linear-gradient(#FF7575 1px, transparent 1px), linear-gradient(90deg, #FF7575 1px, transparent 1px)`,
                 backgroundSize: '40px 40px',
                 transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
                 transformOrigin: 'top center'
             }}
           />
       )}

      {pattern === 'waves' && (
           <div className="w-full h-full opacity-[0.08] relative">
              <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                 <path d="M0,50 Q250,100 500,50 T1000,50" fill="none" stroke="#FF7575" strokeWidth="2" className="animate-wave" />
                 <path d="M0,150 Q250,200 500,150 T1000,150" fill="none" stroke="#FF7575" strokeWidth="2" className="animate-wave" style={{ animationDelay: '-2s' }} />
                 <path d="M0,250 Q250,300 500,250 T1000,250" fill="none" stroke="#FF7575" strokeWidth="2" className="animate-wave" style={{ animationDelay: '-4s' }} />
              </svg>
           </div>
       )}
       
       {/* CSS Animations */}
       <style>{`
         @keyframes floatDown {
           0% { transform: translateY(0) translateX(0); }
           50% { transform: translateY(150px) translateX(var(--float-offset)); }
           100% { transform: translateY(350px) translateX(0); }
         }
         .animate-float-down {
            animation-name: floatDown;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
         }

         @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
         }
         .animate-twinkle {
             animation: twinkle 3s ease-in-out infinite;
             animation-delay: var(--delay);
         }

         @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
         }
         .animate-wave {
             /* Placeholder for simple wave movement if needed, mainly static SVG lines for airy feel */
         }
       `}</style>
    </div>
  );
};

export default PatternBackground;
