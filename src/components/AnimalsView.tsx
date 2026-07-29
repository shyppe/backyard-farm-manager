import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { Animal, AnimalType, AnimalStatus } from '../types';
import { calculateAge, getTodayDateString } from '../utils/dateUtils';
import {
  Bird,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Upload,
  Calendar,
  Scale,
  DollarSign,
  Tag,
} from 'lucide-react';

export const AnimalsView: React.FC = () => {
  const { farmData, addAnimal, updateAnimal, deleteAnimal } = useFarmContext();

  const [activeSpecies, setActiveSpecies] = useState<AnimalType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);

  // Modal Form State
  const [type, setType] = useState<AnimalType>('Chicken');
  const [breed, setBreed] = useState('Rhode Island Red');
  const [variety, setVariety] = useState('Single Comb');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [status, setStatus] = useState<AnimalStatus>('Hen');
  const [dateAcquired, setDateAcquired] = useState(getTodayDateString());
  const [birthDate, setBirthDate] = useState(getTodayDateString());
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(15);
  const [currentValue, setCurrentValue] = useState(25);
  const [weight, setWeight] = useState(2.2);
  const [color, setColor] = useState('Red / Mahogany');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80');

  if (!farmData) return null;

  const animals = farmData.animals;

  const filteredAnimals = animals.filter(a => {
    const matchesSpecies = activeSpecies === 'All' || a.type === activeSpecies;
    const matchesQuery =
      a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesQuery;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingAnimalId(null);
    setType('Chicken');
    setBreed('Rhode Island Red');
    setVariety('Single Comb');
    setGender('Female');
    setStatus('Hen');
    setDateAcquired(getTodayDateString());
    setBirthDate(getTodayDateString());
    setQuantity(1);
    setPurchasePrice(15);
    setCurrentValue(25);
    setWeight(2.2);
    setColor('Mahogany Red');
    setNotes('');
    setPhoto('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (animal: Animal) => {
    setEditingAnimalId(animal.id);
    setType(animal.type);
    setBreed(animal.breed);
    setVariety(animal.variety);
    setGender(animal.gender);
    setStatus(animal.status);
    setDateAcquired(animal.dateAcquired);
    setBirthDate(animal.birthDate);
    setQuantity(animal.quantity);
    setPurchasePrice(animal.purchasePrice);
    setCurrentValue(animal.currentValue);
    setWeight(animal.weight);
    setColor(animal.color);
    setNotes(animal.notes);
    setPhoto(animal.photo || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnimalId) {
      await updateAnimal(editingAnimalId, {
        type,
        breed,
        variety,
        gender,
        status,
        dateAcquired,
        birthDate,
        quantity,
        purchasePrice,
        currentValue,
        weight,
        color,
        notes,
        photo,
      });
    } else {
      await addAnimal({
        type,
        breed,
        variety,
        gender,
        status,
        dateAcquired,
        birthDate,
        quantity,
        purchasePrice,
        currentValue,
        weight,
        color,
        notes,
        photo,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bird className="w-6 h-6 text-emerald-400" />
            Animal Management
          </h2>
          <p className="text-xs text-slate-400">
            Track poultry livestock, auto-calculate ages & manage flock health
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-900/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Animal
        </button>
      </div>

      {/* Species Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(['All', 'Chicken', 'Turkey', 'Duck', 'Quail', 'Goose'] as const).map(spec => (
          <button
            key={spec}
            onClick={() => setActiveSpecies(spec)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeSpecies === spec
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {spec === 'Chicken' && '🐔 '}
            {spec === 'Turkey' && '🦃 '}
            {spec === 'Duck' && '🦆 '}
            {spec === 'Quail' && '🪶 '}
            {spec === 'Goose' && '🪿 '}
            {spec}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by breed, ID, or status..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
        />
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimals.map(animal => {
          const ageInfo = calculateAge(animal.birthDate || animal.dateAcquired);
          return (
            <div
              key={animal.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={animal.photo || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                    alt={animal.breed}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {animal.id}
                      </span>
                      <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded-xl border border-slate-700">
                        Qty: {animal.quantity}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white truncate mt-1">{animal.breed}</h3>
                    <p className="text-xs text-slate-400 truncate">{animal.type} • {animal.variety}</p>
                  </div>
                </div>

                {/* Badges & Age Calculation */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-2.5 rounded-2xl border border-slate-800 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status & Sex</span>
                    <span className="font-semibold text-slate-200">{animal.status} ({animal.gender})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Calculated Age</span>
                    <span className="font-bold text-emerald-400">{ageInfo.formatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Weight</span>
                    <span className="font-semibold text-slate-200">{animal.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Val</span>
                    <span className="font-semibold text-amber-400">₱{(animal.currentValue * animal.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {animal.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-xl mb-3 border border-slate-800/80">
                    "{animal.notes}"
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3 mt-1">
                <button
                  onClick={() => openEditModal(animal)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Edit Animal Record"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${animal.breed} (${animal.id})?`)) {
                      deleteAnimal(animal.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                  title="Delete Animal Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">
                {editingAnimalId ? 'Edit Animal Record' : 'Add New Animal Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Species</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as AnimalType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Chicken">Chicken</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Duck">Duck</option>
                    <option value="Quail">Quail</option>
                    <option value="Goose">Goose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as AnimalStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Chick">Chick</option>
                    <option value="Adult">Adult</option>
                    <option value="Hen">Hen</option>
                    <option value="Rooster">Rooster</option>
                    <option value="Poult">Poult (Turkey)</option>
                    <option value="Tom">Tom (Turkey)</option>
                    <option value="Hen Turkey">Hen Turkey</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Breed Name</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    placeholder="e.g., Rhode Island Red"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Variety</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    placeholder="e.g., Single Comb"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Birth / Hatch Date</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date Acquired</label>
                  <input
                    type="date"
                    value={dateAcquired}
                    onChange={e => setDateAcquired(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Purchase Price (₱)</label>
                  <input
                    type="number"
                    step="1"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Value (₱/ea)</label>
                  <input
                    type="number"
                    step="1"
                    value={currentValue}
                    onChange={e => setCurrentValue(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional health or breeding details..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Photo Upload</label>
                <div className="flex items-center gap-3">
                  <img src={photo} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl mt-4 shadow-lg transition"
              >
                {editingAnimalId ? 'Save Changes' : 'Save Animal Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
