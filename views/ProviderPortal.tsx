
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Currency } from '../types';
import { BarChart3, Users, MessageCircle, Package, Search, Bell, Settings, ArrowUpRight, DollarSign, Plus, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface ProviderPortalProps {
  user: User;
  settings: {
    currency: Currency;
  }
}

const ProviderPortal: React.FC<ProviderPortalProps> = ({ user, settings }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PACKAGES'>('DASHBOARD');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Mock Data
  const leads = [
    { id: '1', name: 'Arjun K.', location: 'Ooty (Hills)', budget: '800', date: 'Dec 12', type: 'Couple' },
    { id: '2', name: 'Sarah M.', location: 'Chennai (Coastal)', budget: '1,200', date: 'Jan 05', type: 'Solo' },
    { id: '3', name: 'Ravi Teja', location: 'Custom: Bangalore', budget: '400', date: 'Dec 28', type: 'Biker' },
  ];

  const packages = [
    { id: 'p1', title: 'Ooty Honeymoon Special', price: '450', duration: '3D/2N', status: 'Active' },
    { id: 'p2', title: 'Temple Run Madurai', price: '200', duration: '2D/1N', status: 'Draft' },
  ];

  const CreatePackageModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 text-white shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black">Create New Package</h3>
          <button onClick={() => setShowCreateModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Package Title</label>
            <input type="text" placeholder="e.g. Summer Hills Escape" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Price ({settings.currency})</label>
               <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" />
             </div>
             <div>
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Duration</label>
               <input type="text" placeholder="3D/2N" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" />
             </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Upload Cover</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500/50 transition-colors cursor-pointer">
               <ImageIcon className="mb-2" />
               <span className="text-xs font-bold">Drop Image Here</span>
            </div>
          </div>
          <button onClick={() => setShowCreateModal(false)} className="w-full bg-emerald-600 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 mt-4">Publish Package</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-10 relative">
      {showCreateModal && <CreatePackageModal />}
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Workspace</h1>
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <BarChart3 size={16} /> Business Health: Optimal
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <Bell size={24} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-emerald-500 transition-all flex items-center gap-3"
          >
            <Plus size={24} /> CREATE PACKAGE
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-1">
        <button onClick={() => setActiveTab('DASHBOARD')} className={`pb-3 font-black text-xs uppercase tracking-widest transition-colors ${activeTab === 'DASHBOARD' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('PACKAGES')} className={`pb-3 font-black text-xs uppercase tracking-widest transition-colors ${activeTab === 'PACKAGES' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>My Packages</button>
      </div>

      {activeTab === 'DASHBOARD' && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Leads', value: '24', sub: '+12 this week', icon: <Users className="text-emerald-500" /> },
              { label: 'Total Revenue', value: '$12.4k', sub: '22% growth', icon: <DollarSign className="text-emerald-500" /> },
              { label: 'Success Rate', value: '94%', sub: 'Elite Status', icon: <BarChart3 className="text-emerald-500" /> },
              { label: 'Chat Requests', value: '8', sub: '2 Urgent', icon: <MessageCircle className="text-emerald-500" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] text-white border border-white/10 shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest">{stat.sub}</p>
              </motion.div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">Marketplace Leads</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="text" placeholder="Search leads..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 font-black">
                        {lead.name[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-white mb-1">{lead.name}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lead.location} • {lead.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-lg font-black text-white">{settings.currency} {lead.budget}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">{lead.date}</p>
                      </div>
                      <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2">
                        BID <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10">
              <h2 className="text-3xl font-black mb-8 tracking-tight text-white">Ad Optimizer</h2>
              <div className="space-y-6">
                <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Settings size={120} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3">AI Recommendation</p>
                  <h3 className="text-2xl font-black mb-3">Biker Routes Trending</h3>
                  <p className="text-sm font-bold text-emerald-100 mb-6 leading-relaxed">High demand for Coimbatore to Munnar bike packages detected. Run promo?</p>
                  <button className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">START CAMPAIGN</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'PACKAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
              <div className="h-40 bg-black/40 rounded-2xl mb-4 flex items-center justify-center text-emerald-500/50">
                 <Package size={40} />
              </div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-black text-xl text-white">{pkg.title}</h3>
                 <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${pkg.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>{pkg.status}</span>
              </div>
              <p className="text-2xl font-black text-white mb-4">{settings.currency} {pkg.price} <span className="text-sm text-gray-500 font-bold">/ person</span></p>
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold">Edit</button>
                <button className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">Promote</button>
              </div>
            </div>
          ))}
          <button onClick={() => setShowCreateModal(true)} className="border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-10 hover:border-emerald-500/50 hover:bg-white/5 transition-all group cursor-pointer">
             <div className="bg-white/5 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform"><Plus className="text-emerald-500"/></div>
             <span className="font-black text-white">Create New Package</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProviderPortal;
