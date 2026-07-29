import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Search, X, Bird, Egg, Package, DollarSign } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { farmData } = useFarmContext();
  const [query, setQuery] = useState('');

  if (!isOpen || !farmData) return null;

  const { animals, inventory, eggCollections, sales, expenses } = farmData;

  const q = query.toLowerCase().trim();

  const matchingAnimals = q ? animals.filter(a => a.breed.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)) : [];
  const matchingInventory = q ? inventory.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)) : [];
  const matchingSales = q ? sales.filter(s => s.customer.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Search className="w-5 h-5 text-emerald-400" />
            Global Search
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type to search animals, inventory, sales, eggs..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />

        <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
          {matchingAnimals.length > 0 && (
            <div>
              <p className="font-bold text-emerald-400 mb-1">Livestock Animals ({matchingAnimals.length})</p>
              {matchingAnimals.map(a => (
                <div key={a.id} className="p-2.5 rounded-xl bg-slate-800/80 mb-1 text-slate-200">
                  <span className="font-bold text-white">{a.breed}</span> ({a.type}) • Qty: {a.quantity}
                </div>
              ))}
            </div>
          )}

          {matchingInventory.length > 0 && (
            <div>
              <p className="font-bold text-yellow-400 mb-1">Inventory Items ({matchingInventory.length})</p>
              {matchingInventory.map(i => (
                <div key={i.id} className="p-2.5 rounded-xl bg-slate-800/80 mb-1 text-slate-200">
                  <span className="font-bold text-white">{i.name}</span> • {i.quantity} {i.unit} left
                </div>
              ))}
            </div>
          )}

          {matchingSales.length > 0 && (
            <div>
              <p className="font-bold text-teal-400 mb-1">Sales Records ({matchingSales.length})</p>
              {matchingSales.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-800/80 mb-1 text-slate-200">
                  <span className="font-bold text-white">{s.customer}</span> • ${s.totalAmount.toFixed(2)}
                </div>
              ))}
            </div>
          )}

          {q && matchingAnimals.length === 0 && matchingInventory.length === 0 && matchingSales.length === 0 && (
            <p className="text-center text-slate-500 py-6">No matching farm records found for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};
