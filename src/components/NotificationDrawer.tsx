import React from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Bell, X, Check, Egg, Utensils, AlertTriangle, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { farmData, markNotificationRead } = useFarmContext();

  if (!isOpen || !farmData) return null;

  const notifications = farmData.notifications;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 max-w-md w-full h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Reminders & Notifications
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[80vh] pr-1">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition ${
                  notif.read
                    ? 'bg-slate-800/40 border-slate-800 opacity-75'
                    : 'bg-slate-800 border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-white">{notif.title}</h4>
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      <Check className="w-3 h-3" /> Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                <span className="text-[10px] text-slate-500 mt-2 block">{notif.date}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl text-xs transition"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
};
