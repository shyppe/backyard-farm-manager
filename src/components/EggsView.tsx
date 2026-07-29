import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { AnimalType } from '../types';
import { getTodayDateString, calculateDaysRemaining, formatDate } from '../utils/dateUtils';
import confetti from 'canvas-confetti';
import {
  Egg,
  Sparkles,
  Plus,
  History,
  TrendingUp,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';

export const EggsView: React.FC = () => {
  const {
    farmData,
    collectEggs,
    startIncubatorBatch,
    completeHatchBatch,
  } = useFarmContext();

  const [activeSubTab, setActiveSubTab] = useState<'collection' | 'storage' | 'incubator'>('collection');

  // Collect Egg Form State
  const [eggDate, setEggDate] = useState(getTodayDateString());
  const [animalType, setAnimalType] = useState<AnimalType>('Chicken');
  const [breed, setBreed] = useState('Rhode Island Red');
  const [eggQty, setEggQty] = useState(12);
  const [remarks, setRemarks] = useState('Clean extra large eggs');

  // Incubator Form Modal
  const [isIncubatorModalOpen, setIsIncubatorModalOpen] = useState(false);
  const [batchName, setBatchName] = useState('Batch #' + Math.floor(100 + Math.random() * 900));
  const [incDateStarted, setIncDateStarted] = useState(getTodayDateString());
  const [incSpecies, setIncSpecies] = useState<AnimalType>('Chicken');
  const [incBreed, setIncBreed] = useState('Rhode Island Red');
  const [incEggQty, setIncEggQty] = useState(6);
  const [incNotes, setIncNotes] = useState('Candled & selected smooth clean eggs');

  // Hatch Completion Modal
  const [hatchingBatchId, setHatchingBatchId] = useState<string | null>(null);
  const [actualHatchedQty, setActualHatchedQty] = useState(4);

  if (!farmData) return null;

  const { eggCollections, eggStorage, incubatorBatches, animals } = farmData;

  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await collectEggs({
      date: eggDate,
      animalType,
      breed,
      quantity: eggQty,
      remarks,
    });
    // Trigger celebratory confetti effect on egg collection!
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleStartIncubatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startIncubatorBatch({
      batchName,
      dateStarted: incDateStarted,
      species: incSpecies,
      breed: incBreed,
      eggQuantity: incEggQty,
      notes: incNotes,
    });
    setIsIncubatorModalOpen(false);
  };

  const handleCompleteHatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hatchingBatchId) return;

    await completeHatchBatch(hatchingBatchId, actualHatchedQty);

    // Confetti celebration for hatched chicks!
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setHatchingBatchId(null);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Egg className="w-6 h-6 text-amber-400" />
            Egg & Incubator Management
          </h2>
          <p className="text-xs text-slate-400">
            Egg collection, storage inventory & automated incubator hatch tracking
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('collection')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'collection'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Collect Eggs
        </button>
        <button
          onClick={() => setActiveSubTab('storage')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'storage'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Egg Storage ({eggStorage.availableEggs})
        </button>
        <button
          onClick={() => setActiveSubTab('incubator')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'incubator'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Incubator ({incubatorBatches.filter(b => b.status === 'Incubating').length})
        </button>
      </div>

      {/* TAB 1: EGG COLLECTION FORM & LOG */}
      {activeSubTab === 'collection' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Record Egg Collection
            </h3>

            <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Collection Date</label>
                <input
                  type="date"
                  required
                  value={eggDate}
                  onChange={e => setEggDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Species</label>
                  <select
                    value={animalType}
                    onChange={e => setAnimalType(e.target.value as AnimalType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Chicken">Chicken</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Duck">Duck</option>
                    <option value="Quail">Quail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Egg Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={eggQty}
                    onChange={e => setEggQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-base font-bold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Breed / Flock</label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={e => setBreed(e.target.value)}
                  placeholder="e.g., Rhode Island Red"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Condition, shell grade, notes..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg shadow-amber-900/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Collect & Add to Egg Storage
              </button>
            </form>
          </div>

          {/* Log History */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Egg Collection History Log
            </h3>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {eggCollections.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                      🥚
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.breed} ({item.animalType})</p>
                      <p className="text-[10px] text-slate-400">{formatDate(item.date)} • {item.remarks || 'No remarks'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-amber-400">+{item.quantity} Eggs</p>
                    <span className="text-[10px] text-slate-500 font-mono">{item.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EGG STORAGE OVERVIEW */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Available Eggs</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{eggStorage.availableEggs}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Collected</p>
              <p className="text-2xl font-black text-white mt-1">{eggStorage.totalCollected}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Eggs Incubated</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">{eggStorage.totalIncubated}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Eggs Hatched</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{eggStorage.totalHatched}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Eggs Sold</p>
              <p className="text-2xl font-black text-teal-400 mt-1">{eggStorage.totalSold}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Broken / Loss</p>
              <p className="text-2xl font-black text-rose-400 mt-1">{eggStorage.totalBroken}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Ready to hatch your own chicks?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Incubate eggs directly from available storage. When started, storage will automatically decrease!
              </p>
            </div>
            <button
              onClick={() => setIsIncubatorModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 whitespace-nowrap"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              Incubate Eggs From Storage
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: INCUBATOR & HATCHERY TRACKER */}
      {activeSubTab === 'incubator' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-indigo-400" />
              Active Incubator Batches
            </h3>
            <button
              onClick={() => setIsIncubatorModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Start New Batch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incubatorBatches.map(batch => {
              const countdown = calculateDaysRemaining(batch.expectedHatchDate);
              const isHatchingToday = countdown.daysLeft === 0 && batch.status === 'Incubating';

              return (
                <div
                  key={batch.id}
                  className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition flex flex-col justify-between ${
                    isHatchingToday
                      ? 'border-amber-500/60 ring-2 ring-amber-500/30'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          {batch.species} • {batch.breed}
                        </span>
                        <h4 className="font-bold text-base text-white">{batch.batchName}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          batch.status === 'Hatched'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-3 rounded-2xl my-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Egg Quantity</span>
                        <span className="font-bold text-amber-400 text-sm">{batch.eggQuantity} Eggs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Expected Hatch</span>
                        <span className="font-bold text-slate-200">{formatDate(batch.expectedHatchDate)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {batch.status === 'Incubating' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Incubation Progress</span>
                          <span className="font-bold text-indigo-400">
                            {countdown.daysLeft > 0 ? `${countdown.daysLeft} days remaining` : 'READY TO HATCH!'}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all"
                            style={{ width: `${Math.min(100, Math.max(10, 100 - (countdown.daysLeft / 21) * 100))}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {batch.status === 'Incubating' && (
                    <button
                      onClick={() => {
                        setHatchingBatchId(batch.id);
                        setActualHatchedQty(batch.eggQuantity);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Hatch & Add Chicks to Flock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Incubator Start Modal */}
      {isIncubatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Start Incubator Batch</h3>
              <button onClick={() => setIsIncubatorModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartIncubatorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Batch Name</label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Species</label>
                  <select
                    value={incSpecies}
                    onChange={e => setIncSpecies(e.target.value as AnimalType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Chicken">Chicken (21 days)</option>
                    <option value="Turkey">Turkey (28 days)</option>
                    <option value="Duck">Duck (28 days)</option>
                    <option value="Quail">Quail (17 days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Egg Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={eggStorage.availableEggs}
                    value={incEggQty}
                    onChange={e => setIncEggQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-amber-400 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Storage available: {eggStorage.availableEggs}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Breed</label>
                <input
                  type="text"
                  required
                  value={incBreed}
                  onChange={e => setIncBreed(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={incDateStarted}
                  onChange={e => setIncDateStarted(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl mt-4 shadow-lg transition"
              >
                Start Incubating (Deducts Storage)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hatch Completion Modal */}
      {hatchingBatchId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl mb-3">
              🐣
            </div>
            <h3 className="font-bold text-lg text-white">Chicks Hatched Celebration!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Enter the exact count of healthy chicks hatched. They will automatically be added to your Animal livestock count!
            </p>

            <form onSubmit={handleCompleteHatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Healthy Chicks</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={actualHatchedQty}
                  onChange={e => setActualHatchedQty(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-center text-2xl font-black text-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHatchingBatchId(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg"
                >
                  Confirm & Add Chicks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
