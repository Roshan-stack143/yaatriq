
import React, { useState, useEffect } from 'react';
import { User, UserRole, Language, Currency } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import TripPlanner from './views/TripPlanner';
import ProviderPortal from './views/ProviderPortal';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Celebration } from './components/Celebration';
import { LogOut, Home as HomeIcon, Map as MapIcon, Sparkles, Briefcase, Globe, Coins } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'LOGIN' | 'DASHBOARD' | 'PLANNER' | 'PROVIDER'>('LOGIN');
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Global Settings
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!user && hash !== '#login') {
        setCurrentPage('LOGIN');
        window.location.hash = 'login';
        return;
      }
      if (hash === '#dashboard') setCurrentPage('DASHBOARD');
      else if (hash === '#planner') setCurrentPage('PLANNER');
      else if (hash === '#provider') setCurrentPage('PROVIDER');
      else if (hash === '#login' && user) {
        window.location.hash = user.role === UserRole.PROVIDER ? 'provider' : 'dashboard';
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [user]);

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.role === UserRole.PROVIDER) {
      setCurrentPage('PROVIDER');
      window.location.hash = 'provider';
    } else {
      setCurrentPage('DASHBOARD');
      window.location.hash = 'dashboard';
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('LOGIN');
    window.location.hash = 'login';
  };

  const triggerCelebration = () => setShowCelebration(true);

  return (
    <div className={`min-h-screen flex flex-col relative text-white ${user?.role === UserRole.PROVIDER ? 'bg-[#001a1a]' : ''}`}>
      <Celebration active={showCelebration} onComplete={() => setShowCelebration(false)} />
      
      {user && (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-black shadow-lg gap-4">
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner ${user.role === UserRole.PROVIDER ? 'bg-emerald-700' : 'bg-gradient-to-br from-blue-700 to-indigo-900'}`}>
              Y
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter">YAATRIQ</span>
              <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">{user.role} PORTAL</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
            {/* Global Settings */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-black/5 px-2 py-1.5 rounded-lg">
                <Globe size={14} className="text-gray-500" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer"
                >
                  {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-black/5 px-2 py-1.5 rounded-lg">
                <Coins size={14} className="text-gray-500" />
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer"
                >
                  {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {user.role === UserRole.USER ? (
                <>
                  <button onClick={() => { window.location.hash = 'dashboard' }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold ${currentPage === 'DASHBOARD' ? 'bg-black text-white' : 'hover:bg-black/5'}`}><HomeIcon size={18} /> Dashboard</button>
                  <button onClick={() => { window.location.hash = 'planner' }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold ${currentPage === 'PLANNER' ? 'bg-black text-white' : 'hover:bg-black/5'}`}><Sparkles size={18} /> AI Planner</button>
                </>
              ) : (
                <button onClick={() => { window.location.hash = 'provider' }} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold ${currentPage === 'PROVIDER' ? 'bg-emerald-900 text-white' : 'hover:bg-black/5'}`}><Briefcase size={18} /> Lead Manager</button>
              )}
            </div>
            
            <div className="flex items-center gap-3 bg-black/5 px-4 py-2 rounded-2xl border border-black/10">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-gray-500 uppercase leading-none">{user.role === UserRole.PROVIDER ? 'BUSINESS XP' : 'YAATRIQ POINTS'}</span>
                <span className={`text-sm font-black leading-tight ${user.role === UserRole.PROVIDER ? 'text-emerald-700' : 'text-blue-800'}`}>
                  {user.role === UserRole.PROVIDER ? 'Lvl 12' : `💎 ${user.points}`}
                </span>
              </div>
              <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-black shadow-sm ${user.role === UserRole.PROVIDER ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {user.name[0].toUpperCase()}
              </div>
              <button onClick={handleLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={20} /></button>
            </div>
          </div>
        </nav>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
        {currentPage === 'LOGIN' && <Login onLogin={handleLogin} />}
        {user?.role === UserRole.USER && (
          <>
            {currentPage === 'DASHBOARD' && <Dashboard user={user} />}
            {currentPage === 'PLANNER' && <TripPlanner onCelebration={triggerCelebration} settings={{ language, currency }} />}
          </>
        )}
        {user?.role === UserRole.PROVIDER && currentPage === 'PROVIDER' && <ProviderPortal user={user} settings={{ currency }} />}
      </main>

      {user?.role === UserRole.USER && <VoiceAssistant />}

      <footer className="py-10 text-center text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
        YAATRIQ OS v4.0 — Unified Travel Intelligence • {language} Mode
      </footer>
    </div>
  );
};

export default App;
