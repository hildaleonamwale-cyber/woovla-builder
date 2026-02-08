
import React, { useState } from 'react';
import { Block } from '../../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';

const BookingBlock: React.FC<{ block: Block }> = ({ block }) => {
  const { content, styles } = block;
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  // Mock data for display purposes - in a real app this comes from the Service ID
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthName = "October 2024";
  const availableSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

  // Palette Extraction
  const bgColor = styles.backgroundColor || '#ffffff';
  const primaryColor = styles.color || '#1e293b';
  const accentColor = styles.accentColor || '#FF7575';
  const mutedColor = styles.mutedColor || '#94a3b8';
  const sectionColor = styles.sectionColor || '#F8FAFC';

  const containerStyle: React.CSSProperties = {
    paddingTop: styles.padding?.top !== undefined ? `${styles.padding.top}px` : '0px',
    paddingBottom: styles.padding?.bottom !== undefined ? `${styles.padding.bottom}px` : '0px',
    paddingLeft: styles.padding?.left !== undefined ? `${styles.padding.left}px` : '0px',
    paddingRight: styles.padding?.right !== undefined ? `${styles.padding.right}px` : '0px',
    marginTop: styles.margin?.top !== undefined ? `${styles.margin.top}px` : '0px',
    marginBottom: styles.margin?.bottom !== undefined ? `${styles.margin.bottom}px` : '0px',
    marginLeft: styles.margin?.left !== undefined ? `${styles.margin.left}px` : '0px',
    marginRight: styles.margin?.right !== undefined ? `${styles.margin.right}px` : '0px',
  };

  const widgetStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderTopLeftRadius: styles.cornerRadii?.topLeft !== undefined ? `${styles.cornerRadii.topLeft}px` : '24px',
    borderTopRightRadius: styles.cornerRadii?.topRight !== undefined ? `${styles.cornerRadii.topRight}px` : '24px',
    borderBottomRightRadius: styles.cornerRadii?.bottomRight !== undefined ? `${styles.cornerRadii.bottomRight}px` : '24px',
    borderBottomLeftRadius: styles.cornerRadii?.bottomLeft !== undefined ? `${styles.cornerRadii.bottomLeft}px` : '24px',
    boxShadow: styles.shadow === 'md' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
  };

  const handleBooking = () => {
    if (selectedDate && selectedSlot) {
      setIsBooked(true);
    }
  };

  if (isBooked) {
    return (
      <div style={containerStyle}>
        <div style={widgetStyle} className="p-12 w-full flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-500 border border-slate-100">
            <div 
                style={{ backgroundColor: accentColor, boxShadow: `0 10px 15px -3px ${accentColor}40` }}
                className="w-16 h-16 text-white rounded-full flex items-center justify-center"
            >
            <CheckCircle2 size={32} />
            </div>
            <div className="text-center">
            <h3 style={{ color: primaryColor }} className="text-xl font-black">Booking Confirmed!</h3>
            <p style={{ color: accentColor }} className="text-sm font-bold uppercase tracking-widest mt-1">Oct {selectedDate} at {selectedSlot}</p>
            </div>
            <button 
            onClick={() => setIsBooked(false)}
            style={{ color: accentColor }}
            className="mt-4 text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:opacity-80"
            >
            Book Another
            </button>
        </div>
      </div>
    );
  }

  // Fallback for legacy 'buttonLabel' if 'heading' not present
  const headingText = content.heading || content.buttonLabel || 'Schedule a Call';

  return (
    <div style={containerStyle} className="w-full">
      <div style={widgetStyle} className="p-6 md:p-8 w-full flex flex-col gap-8 border border-slate-100/50">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
            <h3 style={{ color: primaryColor }} className="text-2xl font-black tracking-tight">
                {headingText}
            </h3>
            <div className="flex items-center justify-center gap-2" style={{ color: mutedColor }}>
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{content.subtext || '30 min session'}</span>
            </div>
        </div>

        {/* Calendar Section */}
        <div 
            style={{ 
                backgroundColor: sectionColor,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)'
            }}
            className="rounded-2xl p-4 md:p-6"
        >
            <div className="flex items-center justify-between mb-6 px-1">
            <h4 style={{ color: primaryColor }} className="font-black tracking-tight">{monthName}</h4>
            <div className="flex gap-2">
                <button style={{ color: mutedColor }} className="p-2 hover:bg-slate-200/50 rounded-xl transition-all"><ChevronLeft size={16} /></button>
                <button style={{ color: mutedColor }} className="p-2 hover:bg-slate-200/50 rounded-xl transition-all"><ChevronRight size={16} /></button>
            </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} style={{ color: mutedColor }} className="text-[9px] font-black text-center py-2">{d}</div>
            ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {days.map(day => {
                const isSelected = selectedDate === day;
                return (
                    <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    style={{ 
                        backgroundColor: isSelected ? accentColor : 'transparent',
                        color: isSelected ? '#ffffff' : primaryColor,
                        boxShadow: isSelected ? `0 4px 10px -2px ${accentColor}60` : 'none'
                    }}
                    className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${!isSelected && 'hover:bg-black/5'}`}
                    >
                    {day}
                    </button>
                );
            })}
            </div>
        </div>

        {/* Slots Section */}
        {selectedDate && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-4 ml-1">
                <Clock size={14} style={{ color: accentColor }} />
                <span style={{ color: mutedColor }} className="text-[10px] font-black uppercase tracking-widest">Available Slots</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot: string) => {
                    const isSelected = selectedSlot === slot;
                    return (
                        <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                                backgroundColor: isSelected ? primaryColor : sectionColor, // Use sectionColor for unselected state box
                                color: isSelected ? '#ffffff' : primaryColor,
                                borderColor: isSelected ? primaryColor : 'transparent', // Remove border for clean look if using background box
                                boxShadow: isSelected ? '0 4px 10px -2px rgba(0,0,0,0.2)' : 'none'
                            }}
                            className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSelected && 'hover:bg-slate-200/50'}`}
                        >
                            {slot}
                        </button>
                    );
                })}
            </div>
            </div>
        )}

        {/* Action Button */}
        <button 
            disabled={!selectedDate || !selectedSlot}
            onClick={handleBooking}
            style={{
                backgroundColor: selectedDate && selectedSlot ? accentColor : '#f1f5f9',
                color: selectedDate && selectedSlot ? '#ffffff' : '#cbd5e1',
                boxShadow: selectedDate && selectedSlot ? `0 10px 20px -5px ${accentColor}60` : 'none',
                cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed'
            }}
            className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95"
        >
            <CalendarIcon size={16} /> {content.buttonText || 'Confirm Reservation'}
        </button>
      </div>
    </div>
  );
};

export default BookingBlock;
