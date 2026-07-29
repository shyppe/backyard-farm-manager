import React from 'react';
import {
  LayoutDashboard,
  Bird,
  Egg,
  Package,
  DollarSign,
  FileSpreadsheet,
  Settings,
  Plus,
} from 'lucide-react';

export type TabType = 'dashboard' | 'animals' | 'eggs' | 'inventory' | 'finances' | 'reports' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickAction,
}) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'animals' as TabType, label: 'Animals', icon: Bird },
    { id: 'eggs' as TabType, label: 'Eggs', icon: Egg },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Package },
    { id: 'finances' as TabType, label: 'Finances', icon: DollarSign },
    { id: 'reports' as TabType, label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={onQuickAction}
          className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all font-semibold text-sm"
          title="Quick Record / Collect"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
          <span className="hidden sm:inline">Quick Collect</span>
        </button>
      </div>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-800 text-slate-400 px-1 py-1.5 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-12 sm:w-14 py-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold scale-105'
                    : 'hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-emerald-500/20 border border-emerald-500/30' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
