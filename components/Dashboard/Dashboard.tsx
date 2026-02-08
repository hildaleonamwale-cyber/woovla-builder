
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  LayoutDashboard, Calendar, FileText, Mail, ShoppingBag, CreditCard, 
  Settings, TrendingUp, Users, DollarSign, Clock, MoreHorizontal,
  Plus, Check, X, Search, Filter, Edit2, ArrowRight, Menu
} from 'lucide-react';
import { DashboardSection } from '../../types';

const Dashboard: React.FC = () => {
  const { dashboardSection, setDashboardSection, dashboardData, setView, viewport } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMobile = viewport === 'mobile';

  const sections: { id: DashboardSection; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'cards', label: 'Cards', icon: CreditCard },
  ];

  const renderSectionContent = () => {
    switch (dashboardSection) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="glass-effect p-6 rounded-3xl border border-white/60 w-full">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                   <div className="p-2 bg-slate-100 rounded-full"><DollarSign size={14} /></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Revenue</span>
                </div>
                <h3 className="text-3xl font-black text-slate-800">$12,405</h3>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1 mt-1"><TrendingUp size={12} /> +15% this week</span>
              </div>
              <div className="glass-effect p-6 rounded-3xl border border-white/60 w-full">
                <div className="flex items-center gap-3 mb-2 text-slate-500">
                   <div className="p-2 bg-slate-100 rounded-full"><Users size={14} /></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Visitors</span>
                </div>
                <h3 className="text-3xl font-black text-slate-800">8.2k</h3>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1 mt-1"><TrendingUp size={12} /> +5% this week</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect p-6 rounded-3xl border border-white/60 w-full">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h3>
               <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Add Product', icon: Plus, color: 'bg-blue-100 text-blue-600' },
                    { label: 'New Post', icon: Edit2, color: 'bg-purple-100 text-purple-600' },
                    { label: 'Check Forms', icon: FileText, color: 'bg-orange-100 text-orange-600' },
                    { label: 'Settings', icon: Settings, color: 'bg-slate-100 text-slate-600' },
                  ].map((action, i) => (
                      <button key={i} className="flex flex-col items-center gap-2 group w-full">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                             <action.icon size={20} />
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase text-center leading-tight">{action.label}</span>
                      </button>
                  ))}
               </div>
            </div>
            
             {/* Recent Activity */}
             <div className="space-y-3 w-full">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest px-2">Recent Activity</h3>
                {dashboardData.bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                {booking.customerName.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">{booking.customerName}</h4>
                                <p className="text-[10px] text-slate-400 font-medium">Booked {booking.service}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{booking.date}</span>
                    </div>
                ))}
             </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Bookings</h3>
                <button className="bg-[#FF7575] text-white p-2 rounded-xl shadow-lg shadow-[#FF7575]/20 hover:scale-105 transition-transform"><Plus size={20} /></button>
            </div>
            
            <div className="space-y-3 w-full">
                {dashboardData.bookings.map((booking) => (
                    <div key={booking.id} className="glass-effect p-5 rounded-3xl border border-white/60 flex flex-col gap-4 w-full">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[#FF7575]">
                                    {booking.customerName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800">{booking.customerName}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{booking.service}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                                booking.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Calendar size={12} />
                                <span className="text-[10px] font-bold">{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold">{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
                                <DollarSign size={12} />
                                <span className="text-[10px] font-bold">{booking.price}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <button className="py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100">Reschedule</button>
                             <button className="py-2 rounded-xl bg-slate-800 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-900">Details</button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        );

      case 'forms':
        return (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Submissions</h3>
                <div className="flex gap-2">
                    <button className="bg-white p-2 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm"><Filter size={18} /></button>
                    <button className="bg-white p-2 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm"><Search size={18} /></button>
                </div>
            </div>

            <div className="space-y-3 w-full">
                {dashboardData.submissions.map((sub) => (
                    <div key={sub.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 group hover:border-[#FF7575]/30 transition-colors cursor-pointer w-full">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wide">{sub.formName}</span>
                                {sub.status === 'new' && <div className="w-2 h-2 rounded-full bg-[#FF7575]" />}
                             </div>
                             <span className="text-[10px] text-slate-300 font-bold">{sub.date}</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-1">{sub.email}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{sub.message}</p>
                        </div>
                    </div>
                ))}
            </div>
           </div>
        );

      case 'store':
         return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
               <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-800">Products</h3>
                    <button className="bg-[#FF7575] text-white px-4 py-2 rounded-xl shadow-lg shadow-[#FF7575]/20 hover:scale-105 transition-transform flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Plus size={14} strokeWidth={3} /> Add Product
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                    {dashboardData.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col gap-3 group w-full">
                             <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black shadow-sm">
                                    {product.price}
                                </div>
                                {product.status === 'draft' && (
                                    <div className="absolute top-2 left-2 bg-slate-800 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide">
                                        Draft
                                    </div>
                                )}
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-slate-800 leading-tight mb-1">{product.name}</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-400">{product.stock} in stock</span>
                                    <button className="text-slate-300 hover:text-[#FF7575]"><Edit2 size={12} /></button>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
         );
      
      case 'newsletter':
         return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
                <div className="glass-effect p-6 rounded-3xl border border-white/60 text-center space-y-4 w-full">
                    <div className="w-16 h-16 bg-[#FF7575]/10 text-[#FF7575] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Mail size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Grow your audience</h3>
                    <p className="text-xs text-slate-500 leading-relaxed px-4">Create beautiful email campaigns and manage your subscribers directly from here.</p>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Create Campaign</button>
                </div>

                <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between px-2">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Subscribers</h4>
                         <span className="text-xs font-bold text-slate-800">{dashboardData.subscribers.length} total</span>
                    </div>
                    {dashboardData.subscribers.map((sub) => (
                        <div key={sub.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-50 w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Users size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{sub.email}</span>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${sub.status === 'subscribed' ? 'text-green-500' : 'text-slate-300'}`}>{sub.status}</span>
                        </div>
                    ))}
                </div>
            </div>
         );

      case 'cards':
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-none">
                <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden h-48 flex flex-col justify-between group w-full">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                     <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#FF7575] rounded-full blur-3xl opacity-20" />
                     
                     <div className="flex justify-between items-start relative z-10">
                        <span className="text-lg font-black tracking-widest">Woovla</span>
                        <CreditCard size={24} className="opacity-80" />
                     </div>

                     <div className="relative z-10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Balance</span>
                        <span className="text-3xl font-black tracking-tight">$4,250.00</span>
                     </div>

                     <div className="flex justify-between items-end relative z-10">
                        <div className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-400" />
                             <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Active</span>
                        </div>
                        <span className="text-xs font-mono opacity-60">•••• 4242</span>
                     </div>
                </div>

                <div className="space-y-2 w-full">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Saved Cards</h3>
                    {['Visa ending in 4242', 'Mastercard ending in 8899'].map((card, i) => (
                         <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 w-full">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl">
                                    <CreditCard size={16} className="text-slate-400" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{card}</span>
                            </div>
                            <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={16} /></button>
                         </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-[#FF7575] hover:text-[#FF7575] transition-colors flex items-center justify-center gap-2">
                        <Plus size={14} /> Add Payment Method
                    </button>
                </div>
            </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="h-full w-full bg-[#F3F4F6] flex flex-col relative overflow-hidden">
      {/* Dashboard Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-white/50 w-full">
        <div className="flex items-center gap-4">
            {isMobile && (
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>
            )}
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h1>
        </div>
        <button 
          onClick={() => setView('canvas')}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          Edit Site <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* Mobile Backdrop */}
        {isMobile && isMenuOpen && (
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-20 animate-in fade-in"
                onClick={() => setIsMenuOpen(false)}
            />
        )}

        {/* Navigation Sidebar */}
        <div className={`
            w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 gap-6 shrink-0 z-30 overflow-y-auto no-scrollbar
            ${isMobile ? 'absolute inset-y-0 left-0 shadow-2xl transition-transform duration-300 ease-out' : 'relative'}
            ${isMobile && !isMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        `}>
           {sections.map((section) => (
             <button
                key={section.id}
                onClick={() => {
                    setDashboardSection(section.id);
                    if (isMobile) setIsMenuOpen(false);
                }}
                className={`flex flex-col items-center gap-1.5 w-full relative group`}
             >
                <div className={`p-3 rounded-2xl transition-all ${dashboardSection === section.id ? 'bg-[#FF7575] text-white shadow-lg shadow-[#FF7575]/30' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                    <section.icon size={20} strokeWidth={2.5} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${dashboardSection === section.id ? 'text-[#FF7575]' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    {section.label}
                </span>
                {dashboardSection === section.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF7575] rounded-l-full" />
                )}
             </button>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24 no-scrollbar w-full">
           <div className="w-full max-w-none">
              {renderSectionContent()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
