import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FullFarmData,
  Animal,
  EggCollection,
  IncubatorBatch,
  InventoryItem,
  FeedingRecord,
  Expense,
  Sale,
  HealthRecord,
  BreedingPair,
  MortalityRecord,
  FarmProfile,
  ActivityLog,
  FarmNotification,
  SyncStatus,
  AnimalType,
} from '../types';
import { createInitialFarmData, createEmptyFarmData } from '../data/initialData';
import { loadFarmDataFromBackend, syncFarmDataToBackend } from '../utils/googleAppsScript';
import { getTodayDateString, getIncubationDaysForSpecies } from '../utils/dateUtils';

interface FarmContextType {
  currentUserEmail: string;
  isAuthenticated: boolean;
  farmData: FullFarmData | null;
  isLoading: boolean;
  syncStatus: SyncStatus;
  syncMode: 'google_apps_script' | 'local_drive_simulator';
  syncMessage: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  loginUser: (email: string, appsScriptUrl?: string) => Promise<void>;
  logoutUser: () => void;
  switchUserEmail: (email: string) => Promise<void>;
  updateFarmProfile: (profile: Partial<FarmProfile>) => Promise<void>;
  completeSetupWizard: (profile: FarmProfile, startWithSampleData?: boolean) => Promise<void>;
  importBackupJSON: (data: FullFarmData) => Promise<void>;
  
  // Animal CRUD
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<void>;
  updateAnimal: (id: string, animal: Partial<Animal>) => Promise<void>;
  deleteAnimal: (id: string) => Promise<void>;

  // Egg Collection
  collectEggs: (collection: Omit<EggCollection, 'id'>) => Promise<void>;

  // Incubator
  startIncubatorBatch: (batch: Omit<IncubatorBatch, 'id' | 'status' | 'hatchedCount' | 'expectedHatchDate'>) => Promise<void>;
  completeHatchBatch: (batchId: string, hatchedCount: number) => Promise<void>;

  // Inventory & Feeding
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'totalCost'>) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  recordFeeding: (record: Omit<FeedingRecord, 'id' | 'cost'>) => Promise<void>;

  // Finances
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  recordSale: (sale: Omit<Sale, 'id' | 'totalAmount'>) => Promise<void>;

  // Health & Breeding
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<void>;

  // Activity & Notifications
  addActivityLog: (title: string, description: string, type: ActivityLog['type']) => void;
  markNotificationRead: (id: string) => void;

  // Settings & Utilities
  setAppsScriptUrl: (url: string) => Promise<void>;
  triggerManualSync: () => Promise<void>;
  resetToSampleData: () => Promise<void>;
  resetToZeroRecords: () => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const PRESET_USERS = [
  'jackjackque1147@gmail.com',
  'zac.farm@gmail.com',
  'demo.owner@gmail.com',
];

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('farm_user_email') || 'jackjackque1147@gmail.com';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('farm_is_authenticated') === 'true';
  });
  const [farmData, setFarmData] = useState<FullFarmData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [syncMode, setSyncMode] = useState<'google_apps_script' | 'local_drive_simulator'>('local_drive_simulator');
  const [syncMessage, setSyncMessage] = useState<string>('Connected to Google Drive / Sheets Store');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Initialize Dark Mode class on document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Load user data whenever currentUserEmail changes
  useEffect(() => {
    if (isAuthenticated) {
      loadUserFarmData(currentUserEmail);
    } else {
      setIsLoading(false);
    }
  }, [currentUserEmail, isAuthenticated]);

  const loginUser = async (email: string, appsScriptUrl?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    setCurrentUserEmail(formattedEmail);
    setIsAuthenticated(true);
    localStorage.setItem('farm_user_email', formattedEmail);
    localStorage.setItem('farm_is_authenticated', 'true');
    if (appsScriptUrl && appsScriptUrl.trim().length > 10) {
      localStorage.setItem(`gas_url_${formattedEmail}`, appsScriptUrl.trim());
    }
    await loadUserFarmData(formattedEmail, appsScriptUrl);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('farm_is_authenticated');
  };

  async function loadUserFarmData(email: string, overrideAppsScriptUrl?: string) {
    setIsLoading(true);
    setSyncStatus('syncing');
    setSyncMessage('Checking Google Drive & local storage for farm data...');

    // Try loading saved Apps Script URL from local config or override parameter
    const savedAppsScriptUrl = overrideAppsScriptUrl || localStorage.getItem(`gas_url_${email}`) || undefined;

    const result = await loadFarmDataFromBackend(email, savedAppsScriptUrl);
    setSyncMode(result.mode);

    if (result.data) {
      if (result.data.profile?.appsScriptUrl) {
        localStorage.setItem(`gas_url_${email}`, result.data.profile.appsScriptUrl);
      }
      setFarmData(result.data);
      setSyncStatus('synced');
      setSyncMessage(result.mode === 'google_apps_script' 
        ? 'Loaded farm data live from Google Apps Script!' 
        : 'Loaded farm data automatically from Google Drive JSON storage.');
    } else {
      // If default demo email and no local data found AND no Apps Script URL configured, populate initial demo sample data
      if (email === 'jackjackque1147@gmail.com' && !savedAppsScriptUrl) {
        const initial = createInitialFarmData(email, "Zac's Backyard Farm", 'Zac');
        setFarmData(initial);
        await saveAndSync(initial);
      } else {
        // No existing farm data found on this device and no Apps Script URL returned data
        setFarmData(null);
        setSyncStatus('synced');
        setSyncMessage('No local data on this device. Connect Google Apps Script URL or import backup.');
      }
    }
    setIsLoading(false);
  }

  /**
   * Universal save & sync helper
   */
  async function saveAndSync(updatedData: FullFarmData) {
    setFarmData(updatedData);
    setSyncStatus('syncing');

    const appsScriptUrl = updatedData.profile.appsScriptUrl || localStorage.getItem(`gas_url_${currentUserEmail}`) || undefined;
    if (appsScriptUrl) {
      localStorage.setItem(`gas_url_${currentUserEmail}`, appsScriptUrl);
    }

    const res = await syncFarmDataToBackend(currentUserEmail, updatedData, appsScriptUrl);
    setSyncMode(res.mode);
    setSyncStatus('synced');
    setSyncMessage(res.message);
  }

  const importBackupJSON = async (importedData: FullFarmData) => {
    if (!importedData || !importedData.profile || !Array.isArray(importedData.animals)) {
      throw new Error('Invalid FarmData.json backup structure');
    }
    importedData.profile.googleEmail = currentUserEmail;
    importedData.profile.updatedAt = getTodayDateString();
    await saveAndSync(importedData);
  };

  const switchUserEmail = async (email: string) => {
    setCurrentUserEmail(email);
  };

  const completeSetupWizard = async (profileData: FarmProfile, startWithSampleData: boolean = false) => {
    const baseData = startWithSampleData
      ? createInitialFarmData(profileData.googleEmail, profileData.farmName, profileData.ownerName)
      : createEmptyFarmData(profileData.googleEmail, profileData.farmName, profileData.ownerName);

    baseData.profile = {
      ...profileData,
      isSetupComplete: true,
      updatedAt: getTodayDateString(),
    };
    await saveAndSync(baseData);
  };

  const updateFarmProfile = async (profileUpdates: Partial<FarmProfile>) => {
    if (!farmData) return;
    const updated: FullFarmData = {
      ...farmData,
      profile: {
        ...farmData.profile,
        ...profileUpdates,
        updatedAt: getTodayDateString(),
      },
    };
    await saveAndSync(updated);
  };

  const addActivityLog = (title: string, description: string, type: ActivityLog['type']) => {
    if (!farmData) return;
    const newLog: ActivityLog = {
      id: 'ACT-' + Math.random().toString(36).substr(2, 7),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + getTodayDateString(),
      title,
      description,
      type,
    };
    farmData.activityLogs.unshift(newLog);
  };

  // ----------------------------------------------------
  // ANIMAL MANAGEMENT
  // ----------------------------------------------------
  const addAnimal = async (animalInput: Omit<Animal, 'id'>) => {
    if (!farmData) return;
    const id = 'ANM-' + Math.floor(100 + Math.random() * 900);
    const newAnimal: Animal = { ...animalInput, id };

    const updated: FullFarmData = {
      ...farmData,
      animals: [newAnimal, ...farmData.animals],
    };

    addActivityLog('New Animal Added', `Added ${newAnimal.quantity}x ${newAnimal.breed} (${newAnimal.status})`, 'animal');
    await saveAndSync(updated);
  };

  const updateAnimal = async (id: string, updates: Partial<Animal>) => {
    if (!farmData) return;
    const updatedAnimals = farmData.animals.map(a => a.id === id ? { ...a, ...updates } : a);
    const updated: FullFarmData = { ...farmData, animals: updatedAnimals };
    await saveAndSync(updated);
  };

  const deleteAnimal = async (id: string) => {
    if (!farmData) return;
    const updatedAnimals = farmData.animals.filter(a => a.id !== id);
    const updated: FullFarmData = { ...farmData, animals: updatedAnimals };
    await saveAndSync(updated);
  };

  // ----------------------------------------------------
  // EGG COLLECTION & STORAGE AUTOMATION
  // ----------------------------------------------------
  const collectEggs = async (collectionInput: Omit<EggCollection, 'id'>) => {
    if (!farmData) return;
    const id = 'EGG-' + Math.floor(100 + Math.random() * 900);
    const newCollection: EggCollection = { ...collectionInput, id };

    // Automatic rule: Egg storage increases by collected quantity
    const updatedEggStorage = {
      ...farmData.eggStorage,
      availableEggs: farmData.eggStorage.availableEggs + collectionInput.quantity,
      totalCollected: farmData.eggStorage.totalCollected + collectionInput.quantity,
    };

    const updated: FullFarmData = {
      ...farmData,
      eggCollections: [newCollection, ...farmData.eggCollections],
      eggStorage: updatedEggStorage,
    };

    addActivityLog('Eggs Collected', `Collected ${collectionInput.quantity} eggs from ${collectionInput.breed}`, 'egg');
    await saveAndSync(updated);
  };

  // ----------------------------------------------------
  // INCUBATOR & HATCHERY AUTOMATION
  // ----------------------------------------------------
  const startIncubatorBatch = async (
    batchInput: Omit<IncubatorBatch, 'id' | 'status' | 'hatchedCount' | 'expectedHatchDate'>
  ) => {
    if (!farmData) return;

    // Check if enough eggs available in storage
    if (farmData.eggStorage.availableEggs < batchInput.eggQuantity) {
      alert(`Not enough eggs in storage! Available: ${farmData.eggStorage.availableEggs}`);
      return;
    }

    const incubationDays = getIncubationDaysForSpecies(batchInput.species);
    const start = new Date(batchInput.dateStarted);
    const expected = new Date(start);
    expected.setDate(expected.getDate() + incubationDays);
    const expectedHatchDate = expected.toISOString().split('T')[0];

    const id = 'INC-' + Math.floor(100 + Math.random() * 900);
    const newBatch: IncubatorBatch = {
      ...batchInput,
      id,
      expectedHatchDate,
      status: 'Incubating',
      hatchedCount: 0,
    };

    // Automatic rule: Decrease Egg Storage, Increase totalIncubated
    const updatedStorage = {
      ...farmData.eggStorage,
      availableEggs: Math.max(0, farmData.eggStorage.availableEggs - batchInput.eggQuantity),
      totalIncubated: farmData.eggStorage.totalIncubated + batchInput.eggQuantity,
    };

    const updated: FullFarmData = {
      ...farmData,
      incubatorBatches: [newBatch, ...farmData.incubatorBatches],
      eggStorage: updatedStorage,
    };

    addActivityLog('Incubation Started', `Incubating ${batchInput.eggQuantity} eggs for ${batchInput.batchName}`, 'incubator');
    await saveAndSync(updated);
  };

  const completeHatchBatch = async (batchId: string, hatchedCount: number) => {
    if (!farmData) return;

    const batch = farmData.incubatorBatches.find(b => b.id === batchId);
    if (!batch) return;

    // Update batch status
    const updatedBatches = farmData.incubatorBatches.map(b =>
      b.id === batchId ? { ...b, status: 'Hatched' as const, hatchedCount } : b
    );

    // Update Egg Storage metrics
    const updatedStorage = {
      ...farmData.eggStorage,
      totalHatched: farmData.eggStorage.totalHatched + hatchedCount,
    };

    // AUTOMATIC RULE: Automatically add hatched chicks/poults to Animals count!
    let updatedAnimals = [...farmData.animals];
    const chickStatus = batch.species === 'Turkey' ? 'Poult' : 'Chick';
    
    // Find if existing chick record exists for this breed
    const existingIndex = updatedAnimals.findIndex(
      a => a.type === batch.species && a.breed === batch.breed && a.status === chickStatus
    );

    if (existingIndex >= 0) {
      updatedAnimals[existingIndex] = {
        ...updatedAnimals[existingIndex],
        quantity: updatedAnimals[existingIndex].quantity + hatchedCount,
      };
    } else {
      const newChickRecord: Animal = {
        id: 'ANM-' + Math.floor(100 + Math.random() * 900),
        type: batch.species,
        breed: batch.breed,
        variety: 'Standard',
        gender: 'Female', // Default, unsexed
        status: chickStatus,
        dateAcquired: getTodayDateString(),
        birthDate: getTodayDateString(),
        quantity: hatchedCount,
        purchasePrice: 0,
        currentValue: 10,
        weight: 0.2,
        color: 'Yellow / Fluffy',
        notes: `Hatched from Incubator batch ${batch.batchName}`,
      };
      updatedAnimals.unshift(newChickRecord);
    }

    const updated: FullFarmData = {
      ...farmData,
      incubatorBatches: updatedBatches,
      eggStorage: updatedStorage,
      animals: updatedAnimals,
    };

    addActivityLog('Batch Hatched!', `${hatchedCount} new ${chickStatus}s hatched from batch "${batch.batchName}" and added to animals!`, 'incubator');
    await saveAndSync(updated);
  };

  // ----------------------------------------------------
  // INVENTORY & FEEDING AUTOMATION
  // ----------------------------------------------------
  const addInventoryItem = async (itemInput: Omit<InventoryItem, 'id' | 'totalCost'>) => {
    if (!farmData) return;
    const id = 'INV-' + Math.floor(100 + Math.random() * 900);
    const newItem: InventoryItem = {
      ...itemInput,
      id,
      totalCost: itemInput.quantity * itemInput.price,
    };

    const updated: FullFarmData = {
      ...farmData,
      inventory: [newItem, ...farmData.inventory],
    };

    addActivityLog('Inventory Added', `Added ${newItem.quantity} ${newItem.unit} of ${newItem.name}`, 'system');
    await saveAndSync(updated);
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!farmData) return;
    const updatedInventory = farmData.inventory.map(i => {
      if (i.id === id) {
        const qty = updates.quantity !== undefined ? updates.quantity : i.quantity;
        const price = updates.price !== undefined ? updates.price : i.price;
        return { ...i, ...updates, totalCost: qty * price };
      }
      return i;
    });

    const updated: FullFarmData = { ...farmData, inventory: updatedInventory };
    await saveAndSync(updated);
  };

  const deleteInventoryItem = async (id: string) => {
    if (!farmData) return;
    const updatedInventory = farmData.inventory.filter(i => i.id !== id);
    const updated: FullFarmData = { ...farmData, inventory: updatedInventory };
    await saveAndSync(updated);
  };

  const recordFeeding = async (feedingInput: Omit<FeedingRecord, 'id' | 'cost'>) => {
    if (!farmData) return;

    // Find feed item in inventory
    const feedItem = farmData.inventory.find(i => i.id === feedingInput.feedItemId || i.name === feedingInput.feedType);
    const costPerKg = feedItem ? feedItem.price : 1.0;
    const calculatedCost = feedingInput.quantityKg * costPerKg;

    const id = 'FED-' + Math.floor(100 + Math.random() * 900);
    const newRecord: FeedingRecord = {
      ...feedingInput,
      id,
      cost: calculatedCost,
    };

    // AUTOMATIC RULE: Reduce feed stock in inventory
    let updatedInventory = [...farmData.inventory];
    if (feedItem) {
      updatedInventory = updatedInventory.map(i => {
        if (i.id === feedItem.id) {
          const newQty = Math.max(0, i.quantity - feedingInput.quantityKg);
          return { ...i, quantity: newQty, totalCost: newQty * i.price };
        }
        return i;
      });
    }

    // AUTOMATIC RULE: Log feed expense automatically
    const newExpense: Expense = {
      id: 'EXP-' + Math.floor(100 + Math.random() * 900),
      date: feedingInput.date,
      category: 'Feed',
      amount: calculatedCost,
      description: `Feeding record: ${feedingInput.quantityKg}kg ${feedingInput.feedType} for ${feedingInput.animalType}`,
    };

    const updated: FullFarmData = {
      ...farmData,
      feedingRecords: [newRecord, ...farmData.feedingRecords],
      inventory: updatedInventory,
      expenses: [newExpense, ...farmData.expenses],
    };

    addActivityLog('Feeding Recorded', `Fed ${feedingInput.quantityKg}kg ${feedingInput.feedType} (${feedingInput.timeOfDay})`, 'feed');
    await saveAndSync(updated);
  };

  // ----------------------------------------------------
  // FINANCES: EXPENSES & SALES AUTOMATION
  // ----------------------------------------------------
  const addExpense = async (expenseInput: Omit<Expense, 'id'>) => {
    if (!farmData) return;
    const id = 'EXP-' + Math.floor(100 + Math.random() * 900);
    const newExpense: Expense = { ...expenseInput, id };

    const updated: FullFarmData = {
      ...farmData,
      expenses: [newExpense, ...farmData.expenses],
    };

    addActivityLog('Expense Recorded', `$${expenseInput.amount.toFixed(2)} for ${expenseInput.category}`, 'expense');
    await saveAndSync(updated);
  };

  const recordSale = async (saleInput: Omit<Sale, 'id' | 'totalAmount'>) => {
    if (!farmData) return;

    const totalAmount = saleInput.quantity * saleInput.pricePerUnit;
    const id = 'SAL-' + Math.floor(100 + Math.random() * 900);
    const newSale: Sale = { ...saleInput, id, totalAmount };

    let updatedStorage = { ...farmData.eggStorage };
    let updatedAnimals = [...farmData.animals];
    let updatedInventory = [...farmData.inventory];

    // AUTOMATIC RULE: Reduce stock depending on Sale Category
    if (saleInput.category === 'Eggs') {
      updatedStorage = {
        ...updatedStorage,
        availableEggs: Math.max(0, updatedStorage.availableEggs - saleInput.quantity),
        totalSold: updatedStorage.totalSold + saleInput.quantity,
      };
    } else if (saleInput.category === 'Chicken' || saleInput.category === 'Turkey') {
      const matchIndex = updatedAnimals.findIndex(a => a.type === saleInput.category && a.breed === saleInput.breed);
      if (matchIndex >= 0) {
        const remainingQty = Math.max(0, updatedAnimals[matchIndex].quantity - saleInput.quantity);
        if (remainingQty === 0) {
          updatedAnimals.splice(matchIndex, 1);
        } else {
          updatedAnimals[matchIndex] = { ...updatedAnimals[matchIndex], quantity: remainingQty };
        }
      }
    } else if (saleInput.category === 'Feeds') {
      const matchInv = updatedInventory.find(i => i.name.toLowerCase().includes(saleInput.breed.toLowerCase()));
      if (matchInv) {
        updatedInventory = updatedInventory.map(i =>
          i.id === matchInv.id ? { ...i, quantity: Math.max(0, i.quantity - saleInput.quantity) } : i
        );
      }
    }

    const updated: FullFarmData = {
      ...farmData,
      sales: [newSale, ...farmData.sales],
      eggStorage: updatedStorage,
      animals: updatedAnimals,
      inventory: updatedInventory,
    };

    addActivityLog('Sale Recorded', `Sold ${saleInput.quantity}x ${saleInput.category} to ${saleInput.customer} for $${totalAmount.toFixed(2)}`, 'sale');
    await saveAndSync(updated);
  };

  const addHealthRecord = async (recordInput: Omit<HealthRecord, 'id'>) => {
    if (!farmData) return;
    const id = 'HLT-' + Math.floor(100 + Math.random() * 900);
    const newRecord: HealthRecord = { ...recordInput, id };

    const updated: FullFarmData = {
      ...farmData,
      healthRecords: [newRecord, ...farmData.healthRecords],
    };

    addActivityLog('Health Record Added', `${recordInput.type}: ${recordInput.name} for ${recordInput.animalType}`, 'system');
    await saveAndSync(updated);
  };

  const markNotificationRead = (id: string) => {
    if (!farmData) return;
    const updatedNotifications = farmData.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setFarmData({ ...farmData, notifications: updatedNotifications });
  };

  const setAppsScriptUrl = async (url: string) => {
    localStorage.setItem(`gas_url_${currentUserEmail}`, url);
    if (farmData) {
      await updateFarmProfile({ appsScriptUrl: url });
    }
  };

  const triggerManualSync = async () => {
    if (!farmData) return;
    await saveAndSync(farmData);
  };

  const resetToSampleData = async () => {
    const sample = createInitialFarmData(currentUserEmail, "Zac's Backyard Farm", 'Zac');
    await saveAndSync(sample);
  };

  const resetToZeroRecords = async () => {
    const currentName = farmData?.profile.farmName || "My Backyard Farm";
    const currentOwner = farmData?.profile.ownerName || "Farm Owner";
    const emptyData = createEmptyFarmData(currentUserEmail, currentName, currentOwner);
    if (farmData?.profile) {
      emptyData.profile = {
        ...farmData.profile,
        updatedAt: getTodayDateString(),
      };
    }
    await saveAndSync(emptyData);
  };

  return (
    <FarmContext.Provider
      value={{
        currentUserEmail,
        isAuthenticated,
        farmData,
        isLoading,
        syncStatus,
        syncMode,
        syncMessage,
        isDarkMode,
        toggleDarkMode,
        loginUser,
        logoutUser,
        switchUserEmail,
        updateFarmProfile,
        completeSetupWizard,
        importBackupJSON,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        collectEggs,
        startIncubatorBatch,
        completeHatchBatch,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        recordFeeding,
        addExpense,
        recordSale,
        addHealthRecord,
        addActivityLog,
        markNotificationRead,
        setAppsScriptUrl,
        triggerManualSync,
        resetToSampleData,
        resetToZeroRecords,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export function useFarmContext() {
  const ctx = useContext(FarmContext);
  if (!ctx) {
    throw new Error('useFarmContext must be used within a FarmProvider');
  }
  return ctx;
}
