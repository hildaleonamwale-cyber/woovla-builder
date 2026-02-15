
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  LayoutDashboard, Calendar, FileText, Mail, ShoppingBag, CreditCard, 
  Settings, TrendingUp, Users, DollarSign, Clock, MoreHorizontal,
  Plus, Check, X, Search, Filter, Edit2, ArrowRight, Menu as MenuIcon, Home,
  MapPin, ClipboardList, PartyPopper, Copy, BarChart3, ChevronRight,
  Download, Bell, Wallet, PieChart, Activity
} from 'lucide-react';
import { DashboardSection } from '../../types';
import DashboardEntityModal from './DashboardEntityModal';

// --- VISUALIZATION COMPONENTS ---

const MiniLineChart = ({ color = "#FF7575", data = [30, 45, 35, 60, 50, 75, 65, 85] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / (max - min)) * 80 - 10; // keep padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`M0,100 L0,${100 - ((data[0] - min) / (max - min)) * 80 - 10} ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`} fill={`url(#gradient-${color})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

const MiniBarChart = ({ color = "#3b82f6", data = [40, 70, 45, 90, 60] }) => (
    <div className="flex items-end justify-between gap-1 h-full w-full pt-4">
        {data.map((h, i) => (
            <div key={i} className="w-full bg-slate-50 rounded-t-sm relative group overflow-hidden">
                <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500" 
                    style={{ height: `${h}%`, backgroundColor: color, opacity: 0.8 }} 
                />
            </div>
        ))}
    </div>
);

const MiniDonut = ({ percentage = 75, color = "#8b5cf6" }) => {
    const circumference = 2 * Math.PI * 40; // r=40
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle 
                    cx="50" cy="50" r="40" 
                    stroke={color} 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-700">{percentage}%</span>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { 
    dashboardSection, setDashboardSection, setView, viewport,
    services, products, events, properties, forms, payouts
  } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Entity Management State
  const [editingEntity, setEditingEntity] = useState<{ id: string | null; type: 'service' | 'product' | 'event' | 'property' | 'form' } | null>(null);

  const sections: { id: DashboardSection; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Services', icon: Clock },
    { id: 'store', label: 'Products', icon: ShoppingBag },
    { id: 'events', label: 'Events', icon: PartyPopper },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'newsletter', label: 'Audience', icon: Users },
    { id: 'cards', label: 'Payouts', icon: CreditCard },
  ];

  // --- REUSABLE COMPONENTS ---

  const BentoCard = ({ title, value, subtext, chart, className = "", action }: any) => (
      <div className={`bg-slate-50 border border-slate-100 rounded-[28px] p-5 relative overflow-hidden group hover:border-slate-200 transition-all ${className}`}>
          <div className="flex justify-between items-start mb-2 relative z-10">
              <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">{title}</span>
                  <h3 className="text-xl font-[900] text-slate-800 tracking-tight">{value}</h3>
              </div>
              {action}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-60 z-0 px-4 pb-3">
              {chart}
          </div>
          
          {subtext && (
              <div className="relative z-10 mt-auto pt-4">
                  <span className="text-[9px] font-bold text-slate-500 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                      {subtext}
                  </span>
              </div>
          )}
      </div>
  );

  const EntityCard = ({ title, subtitle, image, stats, type, onEdit }: any) => (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex p-5 gap-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden shrink-0 relative border border-slate-100">
                {image ? (
                    <img src={image} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag size={24} />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 truncate pr-4 text-lg">{title}</h4>
                    <button 
                        onClick={onEdit}
                        className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-[#FF7575] hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>
                <p className="text-xs font-medium text-slate-400 truncate mt-1">{subtitle}</p>
                <div className="flex items-center gap-2 mt-3">
                     <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
                        {type}
                     </span>
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     <span className="text-[10px] font-bold text-green-600">Active</span>
                </div>
            </div>
        </div>
        
        {/* Stats Footer */}
        <div className="px-5 py-4 bg-[#FAFAFA] border-t border-slate-100 flex items-center justify-between">
            {stats.map((stat: any, i: number) => (
                <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</span>
                    <span className="text-xs font-bold text-slate-700">{stat.value}</span>
                </div>
            ))}
            <button onClick={onEdit} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FF7575] hover:border-[#FF7575] transition-all shadow-sm">
                <ArrowRight size={14} />
            </button>
        </div>
    </div>
  );

  const SectionHeader = ({ title, description, action }: { title: string, description?: string, action?: any }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h2 className="text-3xl font-[900] text-slate-900 tracking-tighter mb-1">{title}</h2>
            {description && <p className="text-sm font-medium text-slate-400">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
             <div className="relative group hidden sm:block">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF7575]" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF7575]/20 w-[220px] transition-all"
                />
             </div>
             {action}
        </div>
    </div>
  );

  // --- SECTIONS ---

  const renderOverview = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* BENTO GRID - Compact 2-column layout on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Main Revenue Card - Spans full width on mobile (2 cols) */}
              <BentoCard 
                  title="Total Revenue" 
                  value="$12,405" 
                  subtext="+12% vs last week"
                  className="col-span-2 min-h-[180px] bg-gradient-to-br from-slate-50 to-white"
                  chart={<MiniLineChart color="#10b981" data={[30, 45, 60, 50, 70, 65, 80, 95]} />}
                  action={<div className="p-2 bg-green-100 text-green-600 rounded-xl"><TrendingUp size={16} /></div>}
              />
              
              {/* Visitors - Spans 1 col */}
              <BentoCard 
                  title="Visitors" 
                  value="8.2k" 
                  subtext="Daily"
                  className="col-span-1 min-h-[150px]"
                  chart={<MiniBarChart color="#3b82f6" data={[20, 40, 60, 80, 50, 70, 90]} />}
              />

              {/* Conversion - Spans 1 col */}
              <BentoCard 
                  title="Conversion" 
                  value="4.8%" 
                  className="col-span-1 min-h-[150px]"
                  chart={
                      <div className="w-16 h-16 mx-auto mt-3">
                          <MiniDonut percentage={65} color="#f59e0b" />
                      </div>
                  }
              />
          </div>

          {/* Recent Activity List */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-800">Recent Activity</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-[#FF7575]">View All</button>
              </div>
              <div className="space-y-2">
                  {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-default">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                                  {i === 1 ? <ShoppingBag size={18} /> : i === 2 ? <Calendar size={18} /> : <Mail size={18} />}
                              </div>
                              <div>
                                  <p className="text-xs md:text-sm font-bold text-slate-800">
                                      {i === 1 ? 'New order from Sarah' : i === 2 ? 'Booking confirmed with Mike' : 'New subscriber joined'}
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 md:mt-1">2 mins ago</p>
                              </div>
                          </div>
                          <span className="text-xs md:text-sm font-black text-slate-800">{i === 1 ? '+$49.00' : ''}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderEntitySection = (
      title: string, 
      desc: string, 
      type: 'service' | 'product' | 'event' | 'property' | 'form', 
      data: any[],
      renderStats: (item: any) => any[]
  ) => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader 
             title={title} 
             description={desc}
             action={
                <button 
                    onClick={() => setEditingEntity({ id: null, type })}
                    className="bg-black text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus size={16} /> New {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
             } 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map(item => (
                  <EntityCard 
                    key={item.id}
                    title={item.title}
                    subtitle={type === 'product' ? item.price : item.description}
                    image={item.image || (item.images && item.images[0])}
                    type={type.charAt(0).toUpperCase() + type.slice(1)}
                    onEdit={() => setEditingEntity({ id: item.id, type })}
                    stats={renderStats(item)}
                  />
              ))}
              {data.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[32px]">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                          <Plus size={24} className="opacity-20" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">No items yet</span>
                  </div>
              )}
          </div>
      </div>
  );

  const renderPayouts = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 rounded-[32px] p-10 text-white flex flex-col items-start gap-8 relative overflow-hidden">
                <div className="relative z-10 w-full">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md"><Wallet size={20} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Balance</span>
                        </div>
                        <button className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Withdraw Funds</button>
                     </div>
                     <h2 className="text-6xl font-[900] tracking-tighter mb-2">$4,250.00</h2>
                     <p className="text-sm text-slate-400 font-medium">Available for payout</p>
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7575] rounded-full blur-[150px] opacity-20 pointer-events-none" />
           </div>

           <div>
               <SectionHeader title="Payout History" description="Recent transactions and withdrawals" />
               <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                   <table className="w-full">
                       <thead className="bg-slate-50/50 border-b border-slate-100">
                           <tr>
                               <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                               <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                               <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                               <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                           {payouts.map((p) => (
                               <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                   <td className="py-5 px-8 text-sm font-black text-slate-800">{p.amount}</td>
                                   <td className="py-5 px-8">
                                       <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                           p.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 
                                           p.status === 'processing' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                       }`}>
                                           <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'paid' ? 'bg-green-500' : p.status === 'processing' ? 'bg-orange-500' : 'bg-slate-400'}`} /> {p.status}
                                       </span>
                                   </td>
                                   <td className="py-5 px-8 text-xs font-medium text-slate-500">{p.date}</td>
                                   <td className="py-5 px-8 text-xs font-bold text-slate-600 flex items-center gap-2">
                                       <CreditCard size={14} className="text-slate-300" /> {p.method}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
      </div>
  );

  const renderNewsletter = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 rounded-[32px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="relative z-10 max-w-md">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md"><Mail size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Audience Growth</span>
                     </div>
                     <h2 className="text-4xl font-[900] tracking-tighter mb-4 leading-tight">Grow your Ecosystem.</h2>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed">
                         Collect emails directly from your profile. Enable the popup to start building your list today.
                     </p>
                </div>
                <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto min-w-[280px]">
                    <div className="flex items-center justify-between bg-white/10 p-5 rounded-2xl border border-white/5 gap-8 backdrop-blur-sm">
                        <span className="text-xs font-bold">Enable Signup Popup</span>
                        <div className="w-12 h-7 bg-[#FF7575] rounded-full relative cursor-pointer shadow-inner">
                            <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
                {/* Decor */}
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#FF7575] rounded-full blur-[120px] opacity-20 pointer-events-none" />
           </div>

           <div>
               <SectionHeader title="Recent Subscribers" description="Manage your email list" />
               <div className="bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm">
                   <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0 border border-slate-100">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">user{i}@example.com</p>
                                        <p className="text-[10px] font-medium text-slate-400">Oct {20 + i}, 2024</p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest border border-green-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                                    </span>
                                </div>
                            </div>
                        ))}
                   </div>
               </div>
           </div>
      </div>
  );

  // --- MAIN LAYOUT ---

  const renderContent = () => {
    switch(dashboardSection) {
        case 'overview': return renderOverview();
        case 'bookings': return renderEntitySection('Services & Bookings', 'Manage availability and appointments', 'service', services, (s) => [{ label: 'Bookings', value: 12 }, { label: 'Revenue', value: '$1.2k' }]);
        case 'store': return renderEntitySection('Product Store', 'Digital and physical products', 'product', products, (p) => [{ label: 'Sales', value: 24 }, { label: 'Revenue', value: '$450' }]);
        case 'events': return renderEntitySection('Events & RSVPs', 'Workshops and meetups', 'event', events, (e) => [{ label: 'RSVPs', value: 85 }, { label: 'Capacity', value: '80%' }]);
        case 'properties': return renderEntitySection('Properties', 'Real estate listings', 'property', properties, (p) => [{ label: 'Views', value: 340 }, { label: 'Leads', value: 5 }]);
        case 'forms': return renderEntitySection('Custom Forms', 'Inquiries and custom orders', 'form', forms, (f) => [{ label: 'Entries', value: 14 }, { label: 'Rate', value: '12%' }]);
        case 'cards': return renderPayouts();
        case 'newsletter': return renderNewsletter();
        default: return <div />;
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col relative overflow-hidden font-inter text-slate-900">
      
      {/* Entity Editor Modal */}
      {editingEntity && (
          <DashboardEntityModal 
             entityId={editingEntity.id} 
             entityType={editingEntity.type} 
             onClose={() => setEditingEntity(null)} 
          />
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden px-6 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2.5 -ml-2 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                  {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
              <span className="text-xl font-[900] text-slate-900 tracking-tighter">Woovla</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white shadow-sm">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100" className="w-full h-full object-cover" />
          </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <aside 
            className={`
                fixed md:relative z-40 inset-y-0 left-0 w-[260px] bg-white border-r border-slate-100 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isMenuOpen ? 'translate-x-0 shadow-2xl rounded-r-[40px]' : '-translate-x-full md:translate-x-0'}
            `}
        >
            <div className="p-10 hidden md:block">
                <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-[#FF7575] rounded-full shadow-[0_0_15px_rgba(255,117,117,0.5)]" /> Woovla
                </h1>
            </div>

            <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto no-scrollbar py-8 md:py-0">
                {sections.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setDashboardSection(item.id);
                            setIsMenuOpen(false);
                        }}
                        className={`
                            w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                            ${dashboardSection === item.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <item.icon size={18} strokeWidth={2.5} className={dashboardSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                        {dashboardSection === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF7575] shadow-[0_0_10px_#FF7575]" />}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <div className="bg-[#F8FAFC] rounded-3xl p-5 flex items-center gap-4 border border-slate-100 cursor-pointer hover:border-slate-200 transition-colors group">
                    <div className="w-10 h-10 rounded-2xl bg-white overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                         <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate group-hover:text-[#FF7575] transition-colors">Woovla HQ</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pro Plan</p>
                    </div>
                </div>
            </div>
        </aside>

        {/* Overlay for mobile */}
        {isMenuOpen && (
            <div className="fixed inset-0 bg-slate-900/10 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar w-full relative bg-white">
             <header className="hidden md:flex items-center justify-between px-10 py-6 bg-white/90 backdrop-blur-xl sticky top-0 z-20 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.03)] border-b border-slate-50">
                 <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight capitalize">{dashboardSection}</h2>
                    <span className="text-xs font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-lg">Pro</span>
                 </div>
                 <div className="flex items-center gap-4">
                     <button className="w-11 h-11 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors relative group">
                        <Bell size={18} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF7575] rounded-full ring-2 ring-white" />
                     </button>
                     <button 
                        onClick={() => setView('admin')}
                        className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                     >
                        Edit Profile <ArrowRight size={14} />
                     </button>
                 </div>
             </header>

             <div className="p-6 md:p-10 pb-32 max-w-[1400px] mx-auto">
                 {renderContent()}
             </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
