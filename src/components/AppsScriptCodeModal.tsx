import React, { useState } from 'react';
import { APPS_SCRIPT_CODE_STRING } from '../utils/googleAppsScript';
import { Code, Copy, Check, X, FolderGit2, Sparkles } from 'lucide-react';

interface AppsScriptCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptCodeModal: React.FC<AppsScriptCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google Apps Script (Code.gs)</h3>
              <p className="text-[11px] text-slate-400">Deploy as Google Web App for live Google Drive & Sheets sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-xs space-y-2 text-slate-300">
          <p className="font-bold text-emerald-400 flex items-center gap-1.5">
            <FolderGit2 className="w-4 h-4" />
            3-Step Google Apps Script Deployment Guide
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
            <li>Open <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">script.google.com</a> and click "New project".</li>
            <li>Replace all existing code in <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">Code.gs</code> with the code below.</li>
            <li>Click <strong>Deploy → New Deployment</strong> → Type: <strong>Web app</strong> → Execute as: <strong>Me</strong> → Access: <strong>Anyone</strong>.</li>
            <li>Copy the Web App URL and paste it into Backyard Farm Manager Settings!</li>
          </ol>
        </div>

        {/* Code Editor Preview */}
        <div className="relative">
          <button
            onClick={handleCopyCode}
            className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transition z-10"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>

          <pre className="bg-slate-950 border border-slate-800 text-emerald-400/90 font-mono text-[11px] p-4 rounded-2xl max-h-72 overflow-y-auto pt-10">
            {APPS_SCRIPT_CODE_STRING}
          </pre>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl text-xs transition"
        >
          Close Code Viewer
        </button>
      </div>
    </div>
  );
};
