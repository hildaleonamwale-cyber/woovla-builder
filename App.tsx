import React from 'react';
import { useStore } from './store/useStore';
import ProfileView from './components/ProfileView';
import ProfileEditor from './components/ProfileEditor';
import StoryViewer from './components/StoryViewer';
import ActionModal from './components/ActionModal';
import Dashboard from './components/Dashboard/Dashboard';
import Onboarding from './components/Onboarding/Onboarding';
import { Eye, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  const { view, setView, activeStoryIndex, activeHighlightId, hasCompletedOnboarding } = useStore();

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  const renderContent = () => {
    switch (view) {
      case 'public': return <ProfileView />;
      case 'preview': return <ProfileView />;
      case 'admin': return <ProfileEditor />;
      case 'dashboard': return <Dashboard />;
      default: return <ProfileView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-poppins relative">
      {renderContent()}
      
      {/* Global Overlays */}
      {activeStoryIndex !== null && <StoryViewer />}
      {activeHighlightId !== null && <ActionModal />}
      
      {/* Navigation Switcher Button (Float) */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end">
        
        {/* Preview Toggle */}
        {(view === 'public' || view === 'preview') && (
             <button 
                onClick={() => setView(view === 'preview' ? 'public' : 'preview')}
                className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${view === 'preview' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-100'}`}
                title={view === 'preview' ? "Exit Preview" : "Preview as Visitor"}
            >
                {view === 'preview' ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        )}

        {/* Main Navigation - Hide in Preview Mode */}
        {view !== 'preview' && (
            <button 
              onClick={() => useStore.getState().setView(view === 'public' ? 'admin' : (view === 'admin' ? 'dashboard' : 'public'))}
              className="bg-black text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
            >
              {view === 'public' ? 'Edit Profile' : 
               view === 'admin' ? 'Dashboard' : 'View Live'}
            </button>
        )}
      </div>
    </div>
  );
};

export default App;