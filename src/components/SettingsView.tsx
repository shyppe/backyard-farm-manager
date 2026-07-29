import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import {
  Settings,
  User,
  Building2,
  MapPin,
  Phone,
  Code,
  Moon,
  Sun,
  Download,
  Upload,
  Database,
  FolderGit2,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  onOpenAppsScriptModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAppsScriptModal }) => {
  const {
    currentUserEmail,
    farmData,
    updateFarmProfile,
    isDarkMode,
    toggleDarkMode,
    setAppsScriptUrl,
    importBackupJSON,
    switchUserEmail,
    logoutUser,
  } = useFarmContext();

  if (!farmData) return null;

  const { profile } = farmData;

  const [farmName, setFarmName] = useState(profile.farmName || '');
  const [ownerName, setOwnerName] = useState(profile.ownerName || '');
  const [farmAddress, setFarmAddress] = useState(profile.farmAddress || '');
  const [contactNumber, setContactNumber] = useState(profile.contactNumber || '');
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(profile.appsScriptUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFarmProfile({
      farmName,
      ownerName,
      farmAddress,
      contactNumber,
    });
    if (appsScriptUrlInput) {
      await setAppsScriptUrl(appsScriptUrlInput.trim());
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const exportBackupJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(farmData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backyard_Farm_Manager_Backup_${currentUserEmail.replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Farm Settings & Integrations
          </h2>
          <p className="text-xs text-slate-400">
            Edit profile, manage Google Drive & Apps Script integration & backups
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Edit Farm Profile
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Farm Name</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={e => setFarmName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Owner Name</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Farm Address</label>
              <input
                type="text"
                value={farmAddress}
                onChange={e => setFarmAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          {/* Apps Script Web App Endpoint */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-semibold">
                Google Apps Script Web App URL
              </label>
              <button
                type="button"
                onClick={onOpenAppsScriptModal}
                className="text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5" /> Get Apps Script Code
              </button>
            </div>
            <input
              type="text"
              value={appsScriptUrlInput}
              onChange={e => setAppsScriptUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Connects directly to your live Google Apps Script Web App for real-time Google Drive & Google Sheets sync.
            </p>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg transition text-xs"
          >
            {isSaved ? '✓ Saved Profile Updates!' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Preferences & Dark Mode */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Appearance & Dark Mode
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800">
          <div>
            <p className="text-xs font-bold text-white">Dark Mode Interface</p>
            <p className="text-[11px] text-slate-400">Default high-contrast dark theme for mobile outdoor use</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition ${
              isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backup & Database Schema Overview */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Google Drive Backup & Data Management
        </h3>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
          <button
            onClick={exportBackupJSON}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export FarmData.json
          </button>

          <label className="w-full sm:w-auto cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition">
            <Upload className="w-4 h-4 text-emerald-400" />
            Import Backup File
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const parsed = JSON.parse(text);
                  await importBackupJSON(parsed);
                  alert("FarmData.json backup successfully imported!");
                } catch (err) {
                  alert("Error importing file. Please make sure it is a valid FarmData.json backup.");
                }
              }}
            />
          </label>

          <button
            onClick={() => {
              const custom = prompt('Enter Gmail address to switch account:');
              if (custom && custom.includes('@')) {
                switchUserEmail(custom.trim());
              }
            }}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition"
          >
            <User className="w-4 h-4 text-emerald-400" />
            Switch Account
          </button>

          <button
            onClick={() => logoutUser()}
            className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-4 py-2.5 rounded-xl border border-rose-500/20 flex items-center justify-center gap-2 text-xs transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
