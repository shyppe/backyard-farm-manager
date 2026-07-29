import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { FarmProfile, FullFarmData } from '../types';
import { Building2, User, MapPin, Phone, Upload, Sparkles, FolderPlus, Link, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';

export const FarmSetupModal: React.FC = () => {
  const { currentUserEmail, completeSetupWizard, loginUser, importBackupJSON } = useFarmContext();

  const [activeMode, setActiveMode] = useState<'sync' | 'backup' | 'new'>('sync');
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState('');
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const [farmName, setFarmName] = useState("Zac's Backyard Farm");
  const [ownerName, setOwnerName] = useState(currentUserEmail.split('@')[0] || 'Zac');
  const [farmAddress, setFarmAddress] = useState('Purok 3, Brgy. San Jose, Lipa City, Batangas, Philippines');
  const [contactNumber, setContactNumber] = useState('+63 917 839 2041');
  const [farmLogo, setFarmLogo] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=250&q=80');
  const [farmBanner, setFarmBanner] = useState('https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80');
  const [startWithSampleData, setStartWithSampleData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectAppsScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appsScriptUrlInput || appsScriptUrlInput.trim().length < 10) {
      setSyncError('Please enter a valid Google Apps Script Web App URL.');
      return;
    }
    setSyncError('');
    setIsSyncing(true);
    try {
      await loginUser(currentUserEmail, appsScriptUrlInput.trim());
      setSyncSuccess('Successfully connected and loaded Google Drive farm data!');
    } catch (err) {
      setSyncError('Could not fetch farm data from this URL. Make sure execution access is set to "Anyone".');
    }
    setIsSyncing(false);
  };

  const handleJSONFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncError('');
    setIsSyncing(true);
    try {
      const text = await file.text();
      const parsed: FullFarmData = JSON.parse(text);
      await importBackupJSON(parsed);
      setSyncSuccess('Successfully imported FarmData.json backup!');
    } catch (err) {
      setSyncError('Invalid FarmData.json file. Please select a valid backup JSON.');
    }
    setIsSyncing(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFarmBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profile: FarmProfile = {
      farmName: farmName.trim() || "Zac's Backyard Farm",
      ownerName: ownerName.trim() || 'Farm Owner',
      farmAddress: farmAddress.trim() || 'N/A',
      contactNumber: contactNumber.trim() || 'N/A',
      farmLogo,
      farmBanner,
      googleEmail: currentUserEmail,
      isSetupComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await completeSetupWizard(profile, startWithSampleData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 my-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-emerald-900/40 mb-3">
            🐔
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Device Setup & Data Recovery
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Signed in as <span className="text-emerald-400 font-semibold">{currentUserEmail}</span>
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setActiveMode('sync')}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeMode === 'sync' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Drive Sync</span>
          </button>

          <button
            onClick={() => setActiveMode('backup')}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeMode === 'backup' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Import File</span>
          </button>

          <button
            onClick={() => setActiveMode('new')}
            className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeMode === 'new' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Farm</span>
          </button>
        </div>

        {syncError && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        {syncSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncSuccess}</span>
          </div>
        )}

        {/* Mode 1: Connect Google Apps Script URL */}
        {activeMode === 'sync' && (
          <form onSubmit={handleConnectAppsScript} className="space-y-4 text-xs bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Link className="w-4 h-4 text-emerald-400" />
                Connect Live Google Apps Script Web App
              </h3>
              <p className="text-slate-400 text-[11px]">
                If you deployed the Google Apps Script on your Google account on another device, paste your Web App URL below to instantly pull your farm data!
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Google Apps Script Web App URL</label>
              <input
                type="text"
                required
                value={appsScriptUrlInput}
                onChange={e => setAppsScriptUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {isSyncing ? 'Connecting to Google Drive...' : 'Connect & Load Live Farm Data'}
            </button>
          </form>
        )}

        {/* Mode 2: Import Backup JSON */}
        {activeMode === 'backup' && (
          <div className="space-y-4 text-xs bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-emerald-400" />
                Import FarmData.json Backup
              </h3>
              <p className="text-slate-400 text-[11px]">
                Upload a backup JSON file exported from your other device to restore all your animals, eggs, sales, and records.
              </p>
            </div>

            <label className="cursor-pointer block border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/80 p-6 rounded-2xl text-center space-y-2 transition">
              <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-slate-200">Click or drag your FarmData.json backup file here</p>
              <p className="text-[10px] text-slate-400">Supports all Backyard Farm Manager backup files</p>
              <input type="file" accept=".json" onChange={handleJSONFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Mode 3: New Farm Setup */}
        {activeMode === 'new' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <FolderPlus className="w-4 h-4" />
                Automatic Google Storage Provisioning
              </div>
              <p className="text-slate-400">
                Saving will create a new farm instance on this device:
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farm Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  placeholder="e.g., Zac's Backyard Farm"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="e.g., Zac"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Initial Data Mode */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Initial Farm Dataset Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setStartWithSampleData(false)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    !startWithSampleData
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white flex items-center justify-between">
                      <span>✨ Clean Slate (Zero Records)</span>
                      {!startWithSampleData && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">Selected</span>}
                    </p>
                    <p className="text-[10px] mt-1 text-slate-400">
                      Starts with 0 animals, 0 sales, and 0 feed logs. Recommended for fresh farms.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStartWithSampleData(true)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    startWithSampleData
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white flex items-center justify-between">
                      <span>📊 Sample Demo Data</span>
                      {startWithSampleData && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">Selected</span>}
                    </p>
                    <p className="text-[10px] mt-1 text-slate-400">
                      Pre-fills sample hens, feed inventory, egg logs, and finances for testing.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition text-xs"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Initializing...' : 'Create New Farm Dataset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
