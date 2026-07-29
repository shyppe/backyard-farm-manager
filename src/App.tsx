import React, { useState } from 'react';
import { FarmProvider, useFarmContext } from './context/FarmContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { FarmSetupModal } from './components/FarmSetupModal';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AnimalsView } from './components/AnimalsView';
import { EggsView } from './components/EggsView';
import { InventoryView } from './components/InventoryView';
import { FinancesView } from './components/FinancesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AppsScriptCodeModal } from './components/AppsScriptCodeModal';

function MainAppContent() {
  const { farmData, isLoading, currentUserEmail, isAuthenticated } = useFarmContext();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAppsScriptOpen, setIsAppsScriptOpen] = useState(false);

  // 1. If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 2. Loading indicator while initializing farm storage from Google Drive
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-3xl shadow-2xl shadow-emerald-900/40 animate-bounce mb-4">
          🐔
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Backyard Farm Manager
        </h2>
        <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Connecting to Google Drive & Sheets for {currentUserEmail}...
        </p>
      </div>
    );
  }

  // If first login and no data or setup not complete, render FarmSetupModal
  if (!farmData || !farmData.profile.isSetupComplete) {
    return <FarmSetupModal />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top App Header with Desktop Web Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAppsScript={() => setIsAppsScriptOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            onTabChange={setActiveTab}
            onOpenEggCollectModal={() => setActiveTab('eggs')}
            onOpenAddAnimalModal={() => setActiveTab('animals')}
            onOpenIncubationModal={() => setActiveTab('eggs')}
            onOpenSaleModal={() => setActiveTab('finances')}
          />
        )}

        {activeTab === 'animals' && <AnimalsView />}
        {activeTab === 'eggs' && <EggsView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'finances' && <FinancesView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && (
          <SettingsView onOpenAppsScriptModal={() => setIsAppsScriptOpen(true)} />
        )}
      </main>

      {/* Footer Credit */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-900 hidden md:block">
        <p className="font-medium text-slate-400">
          🐔 Backyard Farm Manager • Developed by Zac
        </p>
        <p className="text-[10px] text-slate-600 mt-1">
          100% Web Application • Powered by Google Drive, Google Sheets & Google Apps Script
        </p>
      </footer>

      {/* Mobile Bottom Navigation Bar & FAB */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAction={() => setActiveTab('eggs')}
      />

      {/* Modals & Drawers */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <AppsScriptCodeModal isOpen={isAppsScriptOpen} onClose={() => setIsAppsScriptOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <FarmProvider>
      <MainAppContent />
    </FarmProvider>
  );
}
