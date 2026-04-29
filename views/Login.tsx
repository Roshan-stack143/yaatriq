
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Globe, ArrowRight, ShieldCheck, User as UserIcon, Briefcase } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'OTP' | 'EMAIL'>('OTP');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'user_' + Math.random().toString(36).substr(2, 4),
        name: identifier.split('@')[0] || (role === UserRole.PROVIDER ? 'Elite Tours' : 'Voyager'),
        email: identifier.includes('@') ? identifier : 'user@yaatriq.ai',
        role: role,
        points: role === UserRole.PROVIDER ? 0 : 1500,
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-12 md:mt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2.5rem] p-10 shadow-2xl text-black border-2 border-white/50"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden transition-colors ${role === UserRole.PROVIDER ? 'bg-emerald-800' : 'bg-gradient-to-br from-blue-700 via-indigo-800 to-black'}`}
          >
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            Y
          </motion.div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter text-black uppercase">Yaatriq</h1>
          <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Select Your Portal</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setRole(UserRole.USER)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === UserRole.USER ? 'bg-black text-white border-black shadow-xl' : 'bg-white text-gray-400 border-black/5 hover:border-black/20'}`}
          >
            <UserIcon size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Traveler</span>
          </button>
          <button 
            onClick={() => setRole(UserRole.PROVIDER)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === UserRole.PROVIDER ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : 'bg-white text-gray-400 border-black/5 hover:border-emerald-200'}`}
          >
            <Briefcase size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Provider</span>
          </button>
        </div>

        <div className="flex bg-black/5 p-1.5 rounded-2xl mb-8 border border-black/5">
          <button 
            onClick={() => setMethod('OTP')}
            className={`flex-1 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${method === 'OTP' ? 'bg-white shadow-xl text-black' : 'text-gray-400'}`}
          >
            Mobile OTP
          </button>
          <button 
            onClick={() => setMethod('EMAIL')}
            className={`flex-1 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest ${method === 'EMAIL' ? 'bg-white shadow-xl text-black' : 'text-gray-400'}`}
          >
            Email
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1">Credential</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60">
                {method === 'OTP' ? <Phone size={20} /> : <Mail size={20} />}
              </div>
              <input 
                type={method === 'OTP' ? "tel" : "email"}
                placeholder={method === 'OTP' ? "+91 000 000 0000" : "access@yaatriq.ai"}
                className="w-full bg-white border-2 border-black/5 rounded-2xl py-4 pl-14 pr-4 focus:border-black transition-all outline-none font-black text-black text-lg placeholder:text-gray-300"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={mockLogin}
            disabled={!identifier || isLoading}
            className={`w-full text-white font-black py-5 rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 ${role === UserRole.PROVIDER ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-black hover:bg-gray-900'}`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>LOGIN TO {role} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>

        <div className="mt-10 pt-8 border-t-2 border-black/5 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <ShieldCheck size={14} className="text-green-500" /> Professional Grade Encryption
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
