
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { Plus, Map, TrendingUp, Shield, Wallet, ChevronRight, Calendar, Bell, Zap, Info } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    { label: 'Total Saved', value: '$3,892', icon: <Wallet size={24} className="text-blue-600" />, sub: 'Top 5% of users' },
    { label: 'Safety Rating', value: 'Elite', icon: <Shield size={24} className="text-indigo-600" />, sub: 'All zones cleared' },
    { label: 'Eco Rewards', value: user.points, icon: <Zap size={24} className="text-amber-600" />, sub: 'Next: Gold Tier' },
  ];

  const recentTrips = [
    { id: '1', name: 'Coastal Bliss - Goa', date: '20 Oct 2024', budget: '$1,200', status: 'Upcoming', progress: 0 },
    { id: '2', name: 'Himalayan Retreat', date: '05 Sep 2024', budget: '$850', status: 'Completed', progress: 100 },
    { id: '3', name: 'Tokyo Neon Route', date: '12 Aug 2024', budget: '$2,100', status: 'Draft', progress: 45 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Hello, {user.name}!</h1>
          <p className="text-white/70 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400" /> Your Travel Brain is Synced
          </p>
        </div>
        <div className="flex gap-4">
          <button className="glass text-black p-4 rounded-2xl border-none shadow-xl hover:scale-105 transition-all">
            <Bell size={24} />
          </button>
          <button 
            onClick={() => window.location.hash = 'planner'}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 border-b-4 border-gray-300"
          >
            <Plus size={24} /> GENERATE NEW PLAN
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2rem] text-black shadow-xl hover:shadow-2xl transition-shadow border-2 border-white/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 bg-white rounded-2xl shadow-inner border border-black/5">
                {stat.icon}
              </div>
              <Info size={18} className="text-gray-300 cursor-help" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter mb-1 text-black">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.sub}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass rounded-[2.5rem] p-10 text-black border-2 border-white/50"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3"><Map className="text-blue-600" /> Active Itineraries</h2>
            <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">View Archive</button>
          </div>
          
          <div className="space-y-5">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="bg-white/80 border-2 border-black/5 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group cursor-pointer hover:border-black transition-all shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-1 group-hover:text-blue-700 transition-colors">{trip.name}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{trip.date} • {trip.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="flex-1 md:w-32">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                      <span>Progress</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-black" style={{ width: `${trip.progress}%` }}></div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${trip.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : trip.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {trip.status}
                  </span>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-[2.5rem] p-10 text-black border-2 border-white/50 overflow-hidden relative"
        >
          <h2 className="text-3xl font-black mb-8 tracking-tight">AI Insights</h2>
          
          <div className="space-y-6">
            <div className="bg-black p-8 rounded-[2rem] text-white shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-3">Optimization Alert</p>
              <h3 className="text-2xl font-black mb-3 leading-tight">Flight costs to London dropping soon</h3>
              <p className="text-sm font-bold text-gray-400 mb-6 leading-relaxed">Our predictive engine suggests waiting 48 hours to save approx. $215 per person.</p>
              <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">Set Notification</button>
            </div>
            
            <div className="p-6 bg-white rounded-3xl border-2 border-black/5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Task</p>
                <h4 className="font-black text-sm">Update Safety Bio</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                +25
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-black/5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Referral</p>
                <h4 className="font-black text-sm">Invite a Fellow Yaatri</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-black text-xs border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                +500
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Internal icon helper
const Sparkles = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

export default Dashboard;
