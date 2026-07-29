import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { InventoryCategory, AnimalType } from '../types';
import { getTodayDateString, formatDate } from '../utils/dateUtils';
import {
  Package,
  Plus,
  AlertTriangle,
  Boxes,
  Utensils,
  Trash2,
  Edit,
  X,
  History,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    farmData,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    recordFeeding,
  } = useFarmContext();

  const [activeTab, setActiveTab] = useState<'inventory' | 'feeding'>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'All'>('All');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Item Modal State
  const [name, setName] = useState('Organic Layer Feed 16%');
  const [category, setCategory] = useState<InventoryCategory>('Feeds');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState(50);
  const [minStock, setMinStock] = useState(20);
  const [purchaseDate, setPurchaseDate] = useState(getTodayDateString());
  const [supplier, setSupplier] = useState('Countryside Feed Supplies');
  const [price, setPrice] = useState(0.95);
  const [expirationDate, setExpirationDate] = useState('2026-12-31');
  const [notes, setNotes] = useState('');

  // Feeding Form State
  const [feedAnimalType, setFeedAnimalType] = useState<AnimalType>('Chicken');
  const [feedBreed, setFeedBreed] = useState('Rhode Island Red');
  const [selectedFeedItemId, setSelectedFeedItemId] = useState('');
  const [feedQtyKg, setFeedQtyKg] = useState(3.5);
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');

  if (!farmData) return null;

  const { inventory, feedingRecords } = farmData;

  const filteredInventory = inventory.filter(i =>
    selectedCategory === 'All' ? true : i.category === selectedCategory
  );

  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);

  const openAddItemModal = () => {
    setEditingItemId(null);
    setName('');
    setCategory('Feeds');
    setUnit('kg');
    setQuantity(50);
    setMinStock(15);
    setPurchaseDate(getTodayDateString());
    setSupplier('Countryside Feed Supplies');
    setPrice(1.0);
    setExpirationDate('2026-12-31');
    setNotes('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: typeof inventory[0]) => {
    setEditingItemId(item.id);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.unit);
    setQuantity(item.quantity);
    setMinStock(item.minStock);
    setPurchaseDate(item.purchaseDate);
    setSupplier(item.supplier);
    setPrice(item.price);
    setExpirationDate(item.expirationDate);
    setNotes(item.notes);
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItemId) {
      await updateInventoryItem(editingItemId, {
        name,
        category,
        unit,
        quantity,
        minStock,
        purchaseDate,
        supplier,
        price,
        expirationDate,
        notes,
      });
    } else {
      await addInventoryItem({
        name,
        category,
        unit,
        quantity,
        minStock,
        purchaseDate,
        supplier,
        price,
        expirationDate,
        notes,
      });
    }
    setIsItemModalOpen(false);
  };

  const handleFeedingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feedItem = inventory.find(i => i.id === selectedFeedItemId) || inventory.find(i => i.category === 'Feeds');

    await recordFeeding({
      date: getTodayDateString(),
      timeOfDay,
      animalType: feedAnimalType,
      breed: feedBreed,
      feedType: feedItem ? feedItem.name : 'Standard Feed',
      quantityKg: feedQtyKg,
      feedItemId: feedItem?.id,
    });

    alert(`Feeding recorded! Deducted ${feedQtyKg}kg from ${feedItem ? feedItem.name : 'inventory'}.`);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-yellow-400" />
            Inventory & Feed Management
          </h2>
          <p className="text-xs text-slate-400">
            Track feed stock, medicines & automated stock deduction on feeding
          </p>
        </div>
        <button
          onClick={openAddItemModal}
          className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Item
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">Low Stock Alert ({lowStockItems.length} items)</p>
            <p className="text-amber-200/80">
              {lowStockItems.map(i => `${i.name} (${i.quantity} ${i.unit} left)`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'inventory' ? 'bg-yellow-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4 inline mr-1" />
          Stock Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('feeding')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'feeding' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4 inline mr-1" />
          Record Feeding
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(['All', 'Feeds', 'Medicine', 'Vitamins', 'Equipment', 'Supplies'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-200 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map(item => {
              const isLow = item.quantity <= item.minStock;
              return (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-3xl p-4 shadow-xl flex flex-col justify-between ${
                    isLow ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm text-white">{item.name}</h3>
                      </div>
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        ₱{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-2.5 rounded-2xl my-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Quantity Left</span>
                        <span className={`font-bold text-sm ${isLow ? 'text-amber-400' : 'text-slate-100'}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Min Stock</span>
                        <span className="font-semibold text-slate-300">{item.minStock} {item.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Price per Unit</span>
                        <span className="font-semibold text-slate-200">₱{item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Supplier</span>
                        <span className="font-semibold text-slate-200 truncate">{item.supplier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-2">
                    <span className="text-[10px] text-slate-500">Exp: {item.expirationDate || 'N/A'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteInventoryItem(item.id)}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RECORD FEEDING FORM & LOG */}
      {activeTab === 'feeding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Record Animal Feeding
            </h3>

            <form onSubmit={handleFeedingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Time of Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Morning', 'Afternoon', 'Evening'] as const).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimeOfDay(time)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        timeOfDay === time
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Feed from Inventory</label>
                <select
                  value={selectedFeedItemId}
                  onChange={e => setSelectedFeedItemId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="">Select feed item...</option>
                  {inventory.filter(i => i.category === 'Feeds').map(feed => (
                    <option key={feed.id} value={feed.id}>
                      {feed.name} ({feed.quantity} {feed.unit} remaining)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Animal Species</label>
                  <select
                    value={feedAnimalType}
                    onChange={e => setFeedAnimalType(e.target.value as AnimalType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Chicken">Chicken</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Duck">Duck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={feedQtyKg}
                    onChange={e => setFeedQtyKg(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-base font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Breed / Flock Notes</label>
                <input
                  type="text"
                  value={feedBreed}
                  onChange={e => setFeedBreed(e.target.value)}
                  placeholder="e.g., All Rhode Island Red hens"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition text-xs"
              >
                Record Feeding & Deduct Inventory Stock
              </button>
            </form>
          </div>

          {/* Feeding History */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Feeding History Log
            </h3>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {feedingRecords.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{item.feedType} ({item.timeOfDay})</p>
                    <p className="text-[10px] text-slate-400">{formatDate(item.date)} • {item.animalType} ({item.breed})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-400">-{item.quantityKg} kg</p>
                    <p className="text-[10px] text-rose-400">₱{item.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} cost</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">
                {editingItemId ? 'Edit Inventory Item' : 'Add Inventory Item'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as InventoryCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Feeds">Feeds</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit (kg, bag, bottle)</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={e => setMinStock(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price/Unit (₱)</label>
                  <input
                    type="number"
                    step="1"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 rounded-xl mt-4 shadow-lg transition"
              >
                Save Inventory Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
