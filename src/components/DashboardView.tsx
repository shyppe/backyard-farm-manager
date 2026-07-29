import React from 'react';
import { useFarmContext } from '../context/FarmContext';
import { TabType } from './BottomNav';
import {
  Bird,
  Egg,
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Receipt,
  ShoppingCart,
  Boxes,
  Activity,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardViewProps {
  onTabChange: (tab: TabType) => void;
  onOpenEggCollectModal: () => void;
  onOpenAddAnimalModal: () => void;
  onOpenIncubationModal: () => void;
  onOpenSaleModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onTabChange,
  onOpenEggCollectModal,
  onOpenAddAnimalModal,
  onOpenIncubationModal,
  onOpenSaleModal,
}) => {
  const { farmData } = useFarmContext();

  if (!farmData) return null;

  const { profile, animals, eggCollections, eggStorage, incubatorBatches, inventory, sales, expenses, activityLogs } = farmData;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate metrics
  const totalChickens = animals
    .filter(a => a.type === 'Chicken')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalTurkeys = animals
    .filter(a => a.type === 'Turkey')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const todayIso = new Date().toISOString().split('T')[0];

  const eggsCollectedToday = eggCollections
    .filter(e => e.date === todayIso)
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalIncubated = incubatorBatches
    .filter(b => b.status === 'Incubating')
    .reduce((acc, curr) => acc + curr.eggQuantity, 0);

  const salesToday = sales
    .filter(s => s.date === todayIso)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const monthlyIncome = sales
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const monthlyExpenses = expenses
    .reduce((acc, curr) => acc + curr.amount, 0);

  const feedRemainingKg = inventory
    .filter(i => i.category === 'Feeds')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalInventoryCount = inventory.length;

  // Chart Data: Egg Collection trend (Last 7 Days)
  const eggTrendData = [
    { day: 'Mon', eggs: 14 },
    { day: 'Tue', eggs: 18 },
    { day: 'Wed', eggs: 15 },
    { day: 'Thu', eggs: 22 },
    { day: 'Fri', eggs: 19 },
    { day: 'Sat', eggs: 24 },
    { day: 'Sun', eggs: eggsCollectedToday || 18 },
  ];

  // Financial Chart Data
  const financialData = [
    { name: 'Income', amount: monthlyIncome },
    { name: 'Expenses', amount: monthlyExpenses },
    { name: 'Net Profit', amount: Math.max(0, monthlyIncome - monthlyExpenses) },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Banner & Profile Hero Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
        <div className="h-36 sm:h-44 w-full relative">
          <img
            src={profile.farmBanner || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80'}
            alt="Farm Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="px-6 pb-5 pt-0 relative -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={profile.farmLogo || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=250&q=80'}
              alt="Farm Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {profile.farmName || "Zac's Backyard Farm"}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <Award className="w-3.5 h-3.5" />
                Owner: {profile.ownerName || 'Zac'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={onOpenEggCollectModal}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition">
              <Egg className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">Collect Eggs</span>
          </button>

          <button
            onClick={onOpenAddAnimalModal}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
              <Bird className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">Add Animal</span>
          </button>

          <button
            onClick={onOpenIncubationModal}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">Incubate Eggs</span>
          </button>

          <button
            onClick={onOpenSaleModal}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/30 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 group-hover:scale-110 transition">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">Record Sale</span>
          </button>

          <button
            onClick={() => onTabChange('inventory')}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-slate-700/80 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-slate-700 text-slate-300 group-hover:scale-110 transition">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">Inventory</span>
          </button>

          <button
            onClick={() => onTabChange('reports')}
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-slate-700/80 transition text-left group"
          >
            <div className="p-2 rounded-xl bg-slate-700 text-slate-300 group-hover:scale-110 transition">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">PDF Reports</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Quick Statistics Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Chickens */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Chickens</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalChickens}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
              🐔
            </div>
          </div>

          {/* Turkeys */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Turkeys</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalTurkeys}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              🦃
            </div>
          </div>

          {/* Eggs Today */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Eggs Collected Today</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{eggsCollectedToday}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              🥚
            </div>
          </div>

          {/* Eggs in Storage */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Eggs in Storage</p>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{eggStorage.availableEggs}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              📦
            </div>
          </div>

          {/* Incubated */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Eggs Incubated</p>
              <p className="text-2xl font-black text-indigo-400 mt-0.5">{totalIncubated}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
              🥚
            </div>
          </div>

          {/* Hatched */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Chicks Hatched</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{eggStorage.totalHatched}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
              🐣
            </div>
          </div>

          {/* Total Sales Today */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Sales Today</p>
              <p className="text-2xl font-black text-teal-400 mt-0.5">₱{salesToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
              ₱
            </div>
          </div>

          {/* Monthly Income */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Total Sales Revenue</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">₱{monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Feed Remaining */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Feed Stock</p>
              <p className="text-2xl font-black text-yellow-400 mt-0.5">{feedRemainingKg} <span className="text-xs font-semibold text-slate-400">kg</span></p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center text-xl">
              🌽
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase">Total Expenses</p>
              <p className="text-2xl font-black text-rose-400 mt-0.5">₱{monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Egg Trend Area Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                🥚 Egg Production Daily Trend
              </h4>
              <p className="text-[11px] text-slate-400">Daily collections over last 7 days</p>
            </div>
            <button
              onClick={() => onTabChange('eggs')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Egg Logs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eggTrendData}>
                <defs>
                  <linearGradient id="eggGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="eggs" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#eggGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                💰 Financial Health Overview
              </h4>
              <p className="text-[11px] text-slate-400">Revenue vs Overhead Expenses</p>
            </div>
            <button
              onClick={() => onTabChange('reports')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Full Report <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Recent Activity Timeline
        </h4>
        <div className="space-y-3">
          {activityLogs.slice(0, 5).map(log => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-800"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                {log.type === 'egg' && '🥚'}
                {log.type === 'animal' && '🐔'}
                {log.type === 'incubator' && '🐣'}
                {log.type === 'sale' && '💰'}
                {log.type === 'feed' && '🌽'}
                {log.type === 'expense' && '💵'}
                {log.type === 'system' && '⚙️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-white truncate">{log.title}</p>
                  <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
