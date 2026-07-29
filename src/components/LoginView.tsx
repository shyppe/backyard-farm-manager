import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { LogIn, ShieldCheck, Database, HardDrive, FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginUser } = useFarmContext();
  const [email, setEmail] = useState('jackjackque1147@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoggingIn(true);
    await loginUser(email);
    setIsLoggingIn(false);
  };

  const handlePresetSelect = async (presetEmail: string) => {
    setEmail(presetEmail);
    setIsLoggingIn(true);
    await loginUser(presetEmail);
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-3xl shadow-inner mb-1">
            🐔
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Backyard Farm Manager</h1>
          <p className="text-xs font-semibold text-emerald-400">
            Developed by <span className="text-white font-bold">Zac</span> • Mobile & Web Cloud App
          </p>
        </div>

        {/* Cloud Architecture Badges */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px]">
          <div className="bg-slate-800/60 p-2.5 rounded-2xl text-center flex flex-col items-center">
            <HardDrive className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="font-bold text-slate-200">Google Drive</span>
            <span className="text-[9px] text-slate-400">JSON Storage</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-2xl text-center flex flex-col items-center">
            <FileSpreadsheet className="w-4 h-4 text-green-400 mb-1" />
            <span className="font-bold text-slate-200">Google Sheets</span>
            <span className="text-[9px] text-slate-400">Live Database</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-2xl text-center flex flex-col items-center">
            <Database className="w-4 h-4 text-teal-400 mb-1" />
            <span className="font-bold text-slate-200">Apps Script</span>
            <span className="text-[9px] text-slate-400">Free Backend</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google / Gmail Account
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 pl-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">📧</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Each Gmail account gets its own independent farm dataset & Google Sheet.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password / PIN (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 pl-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔒</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Connecting to Google Drive...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                Sign In to Farm Manager
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick Sign-In Accounts
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handlePresetSelect('jackjackque1147@gmail.com')}
              className="w-full p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">👨‍🌾</span>
                <div>
                  <p className="text-xs font-bold text-white">Zac (Primary Owner)</p>
                  <p className="text-[10px] text-emerald-400">jackjackque1147@gmail.com</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Sample Loaded
              </span>
            </button>

            <button
              onClick={() => handlePresetSelect('zac.farm@gmail.com')}
              className="w-full p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🌾</span>
                <div>
                  <p className="text-xs font-bold text-white">Zac (Secondary Farm)</p>
                  <p className="text-[10px] text-slate-400">zac.farm@gmail.com</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                Independent
              </span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Free • No paid database • Offline & Google Drive Mode</span>
        </div>

      </div>
    </div>
  );
};
