import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { FarmProfile } from '../types';
import { Building2, User, MapPin, Phone, Upload, Sparkles, FolderPlus } from 'lucide-react';

export const FarmSetupModal: React.FC = () => {
  const { currentUserEmail, completeSetupWizard } = useFarmContext();

  const [farmName, setFarmName] = useState("Zac's Backyard Farm");
  const [ownerName, setOwnerName] = useState(currentUserEmail.split('@')[0] || 'Zac');
  const [farmAddress, setFarmAddress] = useState('Purok 3, Brgy. San Jose, Lipa City, Batangas, Philippines');
  const [contactNumber, setContactNumber] = useState('+63 917 839 2041');
  const [farmLogo, setFarmLogo] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=250&q=80');
  const [farmBanner, setFarmBanner] = useState('https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80');
  const [startWithSampleData, setStartWithSampleData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-emerald-900/40 mb-3">
            🐔
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Farm Setup Wizard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Setting up new Google Drive storage & Google Sheets database for{' '}
            <span className="text-emerald-400 font-semibold">{currentUserEmail}</span>
          </p>
        </div>

        {/* Auto Creation Info Box */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
            <FolderPlus className="w-4 h-4" />
            Automatic Google Storage Provisioning
          </div>
          <p className="text-slate-400">
            Saving will automatically generate your isolated Google Drive folder:
          </p>
          <ul className="mt-2 space-y-1 text-[11px] font-mono text-emerald-300/90 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <li>📁 Backyard Farm Manager/</li>
            <li className="pl-4">📄 FarmData.json</li>
            <li className="pl-4">📁 Reports/</li>
            <li className="pl-4">📁 Images/</li>
            <li className="pl-4">📊 Google Sheets Database (16 Tabs)</li>
          </ul>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farm Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={farmAddress}
                  onChange={e => setFarmAddress(e.target.value)}
                  placeholder="Street / City"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Logo & Banner Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farm Logo
              </label>
              <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <img
                  src={farmLogo}
                  alt="Logo preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                />
                <label className="cursor-pointer text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-medium flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farm Banner
              </label>
              <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
                <img
                  src={farmBanner}
                  alt="Banner preview"
                  className="w-16 h-12 rounded-lg object-cover border border-slate-600"
                />
                <label className="cursor-pointer text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-medium flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
              </div>
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
                    Starts with 0 animals, 0 sales, and 0 feed logs. Recommended for publish.
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
            className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-5 h-5" />
            {isSubmitting ? 'Provisioning Google Storage...' : 'Create Farm & Initialize Database'}
          </button>
        </form>
      </div>
    </div>
  );
};
