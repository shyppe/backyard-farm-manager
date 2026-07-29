import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { TabType } from './BottomNav';
import {
  Sun,
  Moon,
  CloudCheck,
  RefreshCw,
  Bell,
  Search,
  Code,
  User,
  ChevronDown,
  LogOut,
  FolderGit2,
  LayoutDashboard,
  Bird,
  Egg,
  Package,
  DollarSign,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSearch: () => void;
  onOpenAppsScript: () => void;
  onOpenNotifications: () => void;
}

// Navigation Items
const NAV_ITEMS = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'animals' as TabType, label: 'Animals', icon: Bird },
  { id: 'eggs' as TabType, label: 'Eggs & Incubator', icon: Egg },
  { id: 'inventory' as TabType, label: 'Inventory & Feed', icon: Package },
  { id: 'finances' as TabType, label: 'Finances', icon: DollarSign },
  { id: 'reports' as TabType, label: 'Reports', icon: FileSpreadsheet },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenAppsScript,
  onOpenNotifications,
}) => {
  const {
    currentUserEmail,
    farmData,
    syncStatus,
    syncMessage,
    isDarkMode,
    toggleDarkMode,
    switchUserEmail,
    logoutUser,
  } = useFarmContext();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const unreadCount = farmData
    ? farmData.notifications.filter(n => !n.read).length
    : 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: App Title / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-900/30">
            🐔
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base leading-tight tracking-tight text-white">
                Backyard Farm Manager
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                By Zac
              </span>
            </div>
            {/* Sync Badge */}
            <div className="flex items-center gap-1 mt-0.5 text-xs">
              {syncStatus === 'syncing' ? (
                <span className="flex items-center gap-1 text-amber-400 font-medium text-[11px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Syncing to Google Drive...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]" title={syncMessage}>
                  <CloudCheck className="w-3.5 h-3.5" />
                  Google Drive & Sheets
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Desktop Web Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-2xl border border-slate-700/60">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            title="Global Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Google Apps Script Modal Trigger */}
          <button
            onClick={onOpenAppsScript}
            className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 px-2.5 py-1.5 rounded-xl text-slate-200 transition"
            title="Apps Script Backend Setup"
          >
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Apps Script</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Google Account Selector Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:bg-slate-700/80 transition text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                {currentUserEmail.charAt(0)}
              </div>
              <div className="hidden lg:block max-w-[120px] truncate text-xs">
                <p className="font-semibold text-slate-200 truncate">{farmData?.profile.ownerName || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUserEmail}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Account Switcher Dropdown */}
            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-slate-800/60 rounded-xl mb-2">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Current Google Account
                  </p>
                  <p className="text-sm font-medium text-white truncate">{currentUserEmail}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3" />
                    Isolated Google Drive Storage
                  </p>
                </div>

                <div className="space-y-1 border-t border-slate-800 pt-2">
                  <button
                    onClick={() => {
                      const custom = prompt('Enter Gmail address to switch account:');
                      if (custom && custom.includes('@')) {
                        switchUserEmail(custom.trim());
                      }
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Switch Account...</span>
                  </button>

                  <button
                    onClick={() => {
                      logoutUser();
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
