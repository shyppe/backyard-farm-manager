import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { generateFarmPDFReport, ReportType, DateFilterOption } from '../utils/pdfGenerator';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Share2,
  Calendar,
  Filter,
  CheckCircle2,
  Building2,
  User,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { farmData } = useFarmContext();

  const [reportType, setReportType] = useState<ReportType>('Complete Farm Report');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Month');

  if (!farmData) return null;

  const { profile } = farmData;

  const handleExportPDF = () => {
    generateFarmPDFReport(farmData, {
      reportType,
      dateFilter,
    });
  };

  const REPORT_TYPES_LIST: ReportType[] = [
    'Complete Farm Report',
    'Animal Report',
    'Inventory Report',
    'Egg Collection',
    'Egg Production',
    'Sales Report',
    'Expenses',
    'Income',
    'Profit & Loss',
    'Feed Consumption',
    'Incubation',
    'Mortality',
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            Farm PDF Reports Engine
          </h2>
          <p className="text-xs text-slate-400">
            Generate, view & print official farm PDF reports with logo headers & summaries
          </p>
        </div>
      </div>

      {/* Report Controls Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Report Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Report Type
            </label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as ReportType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {REPORT_TYPES_LIST.map(rt => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Date Filter
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(['Today', 'Yesterday', 'This Week', 'This Month', 'All Time'] as const).map(df => (
                <button
                  key={df}
                  onClick={() => setDateFilter(df)}
                  className={`py-2.5 rounded-xl text-[11px] font-bold transition border ${
                    dateFilter === df
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {df}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Header Preview Box */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-3">
          <p className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PDF Header Header Template Preview
          </p>
          <div className="flex items-center gap-3">
            <img
              src={profile.farmLogo || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=250&q=80'}
              alt="Logo"
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <p className="font-bold text-white text-sm">{profile.farmName || "Zac's Backyard Farm"}</p>
              <p className="text-slate-400 text-[11px]">
                Owner: {profile.ownerName || 'Zac'} • Contact: {profile.contactNumber || 'N/A'}
              </p>
              <p className="text-slate-500 text-[10px]">{profile.farmAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportPDF}
            className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 text-xs transition"
          >
            <Download className="w-4 h-4" />
            Download {reportType} (PDF)
          </button>

          <button
            onClick={handleExportPDF}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-2xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Print PDF
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${profile.farmName} Report`,
                  text: `Farm report for ${profile.farmName}`,
                }).catch(() => {});
              } else {
                handleExportPDF();
              }
            }}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-2xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            Share PDF
          </button>
        </div>
      </div>
    </div>
  );
};
