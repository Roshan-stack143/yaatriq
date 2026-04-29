
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Users, Calendar, Sparkles, AlertCircle, Shield, Plane, Home, Activity, Check, Share2, ArrowRight, Route, ChevronRight, Zap, TrendingUp, Bike, Edit3, Train, Bus, Car, Plus, Trash2, RefreshCw } from 'lucide-react';
import { TripCategory, TravelType, TripPlan, Language, Currency } from '../types';
import { generateTripPlan } from '../services/gemini';

interface TripPlannerProps {
  onCelebration: () => void;
  settings: {
    language: Language;
    currency: Currency;
  };
}

const CATEGORY_HOTSPOTS: Record<TripCategory, string[]> = {
  [TripCategory.CITY]: ['Coimbatore', 'Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad'],
  [TripCategory.PILGRIM]: ['Varanasi', 'Madurai', 'Tirupati', 'Rameshwaram', 'Rishikesh'],
  [TripCategory.COASTAL]: ['Goa', 'Pondicherry', 'Kochi', 'Vizag', 'Varkala', 'Gokarna'],
  [TripCategory.HILLS]: ['Ooty', 'Munnar', 'Manali', 'Kodai', 'Srinagar', 'Leh'],
  [TripCategory.CUSTOM]: []
};

const TripPlanner: React.FC<TripPlannerProps> = ({ onCelebration, settings }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BUDGET' | 'ROUTE' | 'STAY'>('OVERVIEW');
  
  // Form State
  const [origin, setOrigin] = useState('');
  const [budget, setBudget] = useState(2500);
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(1);
  const [type, setType] = useState<TravelType>(TravelType.SOLO);
  const [category, setCategory] = useState<TripCategory>(TripCategory.CITY);
  const [manualInput, setManualInput] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [toggles, setToggles] = useState<string[]>(['Low Budget Mode']);

  // Add/Remove Destinations
  const toggleDestination = (spot: string) => {
    if (selectedDestinations.includes(spot)) {
      setSelectedDestinations(prev => prev.filter(s => s !== spot));
    } else {
      setSelectedDestinations(prev => [...prev, spot]);
    }
  };

  const addManualDestination = () => {
    if (manualInput && !selectedDestinations.includes(manualInput)) {
      setSelectedDestinations(prev => [...prev, manualInput]);
      setManualInput('');
    }
  };

  const handleGenerate = async () => {
    if (!origin || selectedDestinations.length === 0) return;
    setLoading(true);
    try {
      const result = await generateTripPlan({ 
        origin, 
        destinations: selectedDestinations, 
        budget, 
        days, 
        people, 
        type, 
        category, 
        toggles,
        language: settings.language,
        currency: settings.currency
      });
      setPlan(result);
      onCelebration();
    } catch (err) {
      console.error(err);
      alert("AI brain is overloaded. Retrying sync...");
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (opt: string) => {
    setToggles(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const aiInsight = useMemo(() => {
    if (toggles.includes('Low Budget Mode')) return "AI will prioritize street food, shared transit, and hostel stays.";
    if (toggles.includes('Biker Mode')) return "Emphasizing scenic highways and pit-stop friendly cafes.";
    return "Optimizing for general safety and market efficiency.";
  }, [toggles]);

  const getTransportIcon = (mode: string) => {
    if (mode.toLowerCase().includes('flight')) return <Plane size={18} />;
    if (mode.toLowerCase().includes('train')) return <Train size={18} />;
    if (mode.toLowerCase().includes('bus')) return <Bus size={18} />;
    if (mode.toLowerCase().includes('car') || mode.toLowerCase().includes('cab')) return <Car size={18} />;
    if (mode.toLowerCase().includes('bike')) return <Bike size={18} />;
    return <Route size={18} />;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {!plan ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="glass rounded-[3rem] p-12 text-black shadow-2xl border-2 border-white/50"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
              <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-2xl shrink-0 rotate-3">
                <Sparkles size={40} className="text-blue-400" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-5xl font-black tracking-tighter mb-2">Configure Route</h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">AI TSP Algorithm • Cost Optimization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                {/* Vibe Selection */}
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4 ml-1">1. Context Category</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(TripCategory).map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${category === c ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-black/5'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Destination Logic */}
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4 ml-1">2. Build Your Route (Select Multiple)</label>
                  
                  {/* Selected Chips */}
                  {selectedDestinations.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        {selectedDestinations.map((spot, idx) => (
                           <div key={spot} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
                              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                              <span className="text-xs font-bold text-blue-900">{spot}</span>
                              <button onClick={() => toggleDestination(spot)} className="text-blue-400 hover:text-red-500"><Trash2 size={12}/></button>
                           </div>
                        ))}
                     </div>
                  )}

                  <div className="space-y-4">
                    {category !== TripCategory.CUSTOM && (
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_HOTSPOTS[category].map(spot => (
                          <button
                            key={spot}
                            onClick={() => toggleDestination(spot)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedDestinations.includes(spot) ? 'bg-blue-600 border-blue-600 text-white opacity-50' : 'bg-white border-black/5 text-gray-500 hover:border-black/20'}`}
                          >
                            {selectedDestinations.includes(spot) ? <Check size={14}/> : '+'} {spot}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="relative group flex-1">
                        <Edit3 className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" size={18} />
                        <input 
                          type="text" 
                          placeholder="Add Manual Stop (e.g. Hampi)"
                          className="w-full bg-white border-2 border-black/5 rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-black transition-all outline-none font-black text-black text-sm"
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addManualDestination()}
                        />
                      </div>
                      <button onClick={addManualDestination} className="px-6 rounded-[1.5rem] bg-black text-white hover:bg-gray-800 transition-colors"><Plus/></button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-3 ml-1">Starting Point</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={20} />
                    <input 
                      type="text" 
                      placeholder="Origin City"
                      className="w-full bg-white border-2 border-black/5 rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-black transition-all outline-none font-black text-black text-lg placeholder:text-gray-200"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4 ml-1">3. Travel Dynamic</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(TravelType).map(t => (
                      <button 
                        key={t}
                        onClick={() => setType(t as TravelType)}
                        className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${type === t ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-black/5 text-gray-400'}`}
                      >
                        {t === TravelType.BIKER && <Bike size={14} />}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2">Budget ({settings.currency})</label>
                    <input type="number" className="w-full bg-white border-2 border-black/5 rounded-xl py-4 px-4 font-black" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2">Days</label>
                    <input type="number" className="w-full bg-white border-2 border-black/5 rounded-xl py-4 px-4 font-black" value={days} onChange={(e) => setDays(Number(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4 ml-1">AI Logic Filters</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Low Budget Mode', 'Solo Female Safe', 'Eco Mode', 'Off-Beat Paths'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => toggleOption(opt)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${toggles.includes(opt) ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-black/5 text-gray-400'}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${toggles.includes(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200'}`}>
                          {toggles.includes(opt) && <Check size={14} />}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Insight Feedback */}
                <div className="p-6 bg-black rounded-[2rem] text-white flex flex-col gap-2 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
                   <div className="flex items-center gap-2 text-blue-400">
                    <AlertCircle size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Yaatriq Brain v4.0</span>
                   </div>
                   <p className="text-xs font-bold text-gray-300 italic">"{aiInsight}"</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !origin || selectedDestinations.length === 0}
              className={`w-full mt-12 py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${loading || !origin || selectedDestinations.length === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-none' : 'bg-black text-white hover:bg-gray-900 border-b-8 border-gray-700'}`}
            >
              {loading ? (
                <>
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  CALCULATING OPTIMAL ROUTE...
                </>
              ) : (
                <>GENERATE {settings.language} ITINERARY <ArrowRight size={28} /></>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header Result Card */}
            <div className="glass rounded-[3rem] p-10 text-black border-2 border-white/50 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{plan.currency}</span>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{type} Mode</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter text-black">{plan.name}</h1>
                  <p className="text-gray-500 font-bold text-lg leading-relaxed max-w-3xl">{plan.summary}</p>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                  <button onClick={() => alert("Added to Comparison Tray")} className="flex-1 lg:flex-none p-5 bg-white border-2 border-black/5 rounded-[1.5rem] shadow-sm hover:border-black transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"><RefreshCw size={16}/> Compare</button>
                  <button className="flex-1 lg:flex-none p-5 bg-white border-2 border-black/5 rounded-[1.5rem] shadow-sm hover:border-black transition-all flex items-center justify-center"><Share2 size={24}/></button>
                  <button className="flex-1 lg:flex-none px-8 py-5 bg-black text-white rounded-[1.5rem] shadow-xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    BOOK ALL <ChevronRight size={18}/>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white border-2 border-black/5 p-6 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Total Budget</p>
                  <p className="text-4xl font-black text-black tracking-tighter mb-1">{settings.currency === Currency.USD ? '$' : '₹'}{plan.budgetUsed}</p>
                  <div className="text-[10px] text-green-600 font-black uppercase tracking-widest">Saved {plan.savingsVsMarket}</div>
                </div>
                <div className="bg-white border-2 border-black/5 p-6 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Safety Score</p>
                  <p className="text-4xl font-black text-black tracking-tighter mb-1">{plan.safetyScore}/100</p>
                  <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Verified Zones</div>
                </div>
                <div className="bg-white border-2 border-black/5 p-6 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Duration</p>
                  <p className="text-4xl font-black text-black tracking-tighter mb-1">{plan.durationDays}d</p>
                  <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{plan.legs.length} Stops</div>
                </div>
                <div className="bg-white border-2 border-black/5 p-6 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Points Earned</p>
                  <p className="text-4xl font-black text-black tracking-tighter mb-1">+1.8k</p>
                  <div className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Level Up</div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex bg-black p-2 rounded-[2rem] overflow-x-auto gap-3">
              {(['OVERVIEW', 'ROUTE', 'STAY', 'BUDGET'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[140px] py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-white/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div layout className="glass rounded-[3rem] p-12 text-black border-2 border-white/50 shadow-2xl min-h-[400px]">
               {activeTab === 'OVERVIEW' && (
                  <div className="space-y-16">
                    {plan.legs.map((leg, i) => (
                      <div key={i} className="relative pl-14">
                        {i < plan.legs.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-blue-600/30 to-transparent" />
                        )}
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg z-10 shadow-xl">
                          {leg.day}
                        </div>
                        <div className="mb-8">
                          <h3 className="text-3xl font-black tracking-tight">{leg.from} <span className="text-gray-300">→</span> {leg.to}</h3>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {leg.activities.map((act, j) => (
                              <div key={j} className="flex items-center gap-4 p-5 bg-white border-2 border-black/5 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                  <Activity size={20} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-black text-sm mb-1">{act.name}</h4>
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{act.type} • {act.cost}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               )}

               {activeTab === 'ROUTE' && (
                 <div className="space-y-8">
                    <h3 className="text-3xl font-black mb-6">Transport Intelligence Engine</h3>
                    {plan.legs.map((leg, i) => (
                      <div key={i} className="mb-10">
                         <div className="flex items-center gap-4 mb-4">
                            <span className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Leg {i+1}</span>
                            <h4 className="font-bold text-lg">{leg.from} to {leg.to}</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {leg.transportOptions.map((opt, j) => (
                              <div key={j} className={`p-5 rounded-2xl border-2 transition-all ${opt.recommended ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-black/5'}`}>
                                 <div className="flex justify-between items-start mb-3">
                                   <div className={`p-2 rounded-lg ${opt.recommended ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                      {getTransportIcon(opt.mode)}
                                   </div>
                                   {opt.recommended && <span className="text-[8px] font-black uppercase bg-blue-200 text-blue-800 px-2 py-1 rounded">Best Value</span>}
                                 </div>
                                 <p className="font-black text-lg mb-1">{opt.mode}</p>
                                 <div className="flex justify-between items-end">
                                    <div className="text-xs text-gray-500 font-bold">{opt.duration}</div>
                                    <div className="font-black text-xl">{opt.cost}</div>
                                 </div>
                                 <div className="mt-3 flex gap-2">
                                   <span className="text-[8px] font-bold uppercase border border-black/10 px-2 py-0.5 rounded">Comfort: {opt.comfort}/5</span>
                                   <span className="text-[8px] font-bold uppercase border border-black/10 px-2 py-0.5 rounded">CO2: {opt.carbonFootprint}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'STAY' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.legs.map((leg, i) => (
                      <div key={i} className="p-8 bg-white border-2 border-black/5 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white"><Home size={30} /></div>
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Day {leg.day} Stop</p>
                          <h4 className="font-black text-xl mb-1">{leg.stay.name}</h4>
                          <div className="flex gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{leg.stay.type}</span>
                            <span className="text-xs font-black text-green-600">{leg.stay.cost} / night</span>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'BUDGET' && (
                 <div className="space-y-6">
                    <h3 className="text-3xl font-black">Financial Breakdown</h3>
                    <div className="p-8 bg-black rounded-[2rem] text-white">
                       <div className="flex justify-between items-end mb-8">
                          <div>
                            <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Net Estimated</p>
                            <p className="text-6xl font-black">{plan.budgetUsed}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-2">Market Efficiency</p>
                            <p className="text-3xl font-black text-green-400">+{Math.round((plan.savingsVsMarket/plan.totalBudget)*100)}%</p>
                          </div>
                       </div>
                       <p className="text-sm font-bold text-gray-400 leading-relaxed italic border-t border-white/10 pt-6">
                         "Optimizer Note: We've weighted this budget towards {type === TravelType.BIKER ? 'High-Octane Fuel and Scenic Pitstops' : 'Cultural Immersion and Central Stays'} based on your selected Dynamic."
                       </p>
                    </div>
                 </div>
               )}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={() => setPlan(null)} className="flex-1 py-5 bg-white text-black rounded-[2rem] font-black border-2 border-black/10 hover:border-black transition-all shadow-lg uppercase text-xs tracking-widest">Refine Logic</button>
              <button className="flex-1 py-5 bg-black text-white rounded-[2rem] font-black shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] border-b-8 border-gray-700">START REAL-TIME TRIP <Zap size={20} className="text-blue-400" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripPlanner;
