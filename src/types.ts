export type AnimalType = 'Chicken' | 'Turkey' | 'Duck' | 'Quail' | 'Goose';

export type AnimalStatus = 
  | 'Chick' 
  | 'Adult' 
  | 'Hen' 
  | 'Rooster' 
  | 'Poult' 
  | 'Tom' 
  | 'Hen Turkey'
  | 'Drake'
  | 'Duckling';

export interface Animal {
  id: string;
  type: AnimalType;
  breed: string;
  variety: string;
  gender: 'Male' | 'Female';
  status: AnimalStatus;
  dateAcquired: string; // ISO string YYYY-MM-DD
  birthDate: string;    // ISO string YYYY-MM-DD
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  weight: number;       // in kg
  color: string;
  notes: string;
  photo?: string;       // base64 or URL
}

export interface EggCollection {
  id: string;
  date: string;         // YYYY-MM-DD
  animalType: AnimalType;
  breed: string;
  quantity: number;
  remarks: string;
}

export interface EggStorageData {
  availableEggs: number;
  totalCollected: number;
  totalSold: number;
  totalIncubated: number;
  totalHatched: number;
  totalBroken: number;
}

export interface IncubatorBatch {
  id: string;
  batchName: string;
  dateStarted: string;  // YYYY-MM-DD
  species: AnimalType;
  breed: string;
  eggQuantity: number;
  expectedHatchDate: string; // YYYY-MM-DD
  status: 'Incubating' | 'Hatched' | 'Cancelled';
  hatchedCount: number;
  notes: string;
}

export type InventoryCategory = 'Feeds' | 'Medicine' | 'Vitamins' | 'Equipment' | 'Supplies';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: string;         // kg, bag, bottle, pcs, etc.
  quantity: number;
  minStock: number;
  purchaseDate: string;
  supplier: string;
  price: number;        // price per unit
  totalCost: number;
  expirationDate: string;
  notes: string;
}

export interface FeedingRecord {
  id: string;
  date: string;         // YYYY-MM-DD
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  animalType: AnimalType;
  breed: string;
  feedType: string;
  quantityKg: number;
  cost: number;
  feedItemId?: string;
}

export type ExpenseCategory = 
  | 'Feed' 
  | 'Medicine' 
  | 'Utilities' 
  | 'Labor' 
  | 'Repairs' 
  | 'Equipment' 
  | 'Transportation' 
  | 'Others';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receiptImage?: string;
}

export type SaleCategory = 'Eggs' | 'Chicken' | 'Turkey' | 'Feeds' | 'Others';

export interface Sale {
  id: string;
  date: string;
  customer: string;
  category: SaleCategory;
  breed: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'GCash' | 'Bank Transfer' | 'Credit' | 'Other';
  remarks: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  animalType: AnimalType;
  breed: string;
  type: 'Medicine' | 'Vaccination';
  name: string;
  dosage: string;
  notes: string;
  nextDueDate?: string;
}

export interface BreedingPair {
  id: string;
  date: string;
  species: AnimalType;
  maleId: string;
  femaleId: string;
  breed: string;
  notes: string;
  status: 'Active' | 'Separated';
}

export interface MortalityRecord {
  id: string;
  date: string;
  animalType: AnimalType;
  breed: string;
  quantity: number;
  cause: string;
  notes: string;
}

export interface FarmProfile {
  farmName: string;
  ownerName: string;
  farmAddress: string;
  contactNumber: string;
  farmLogo?: string;
  farmBanner?: string;
  googleEmail: string;
  driveFolderId?: string;
  spreadsheetId?: string;
  appsScriptUrl?: string;
  isSetupComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'egg' | 'animal' | 'incubator' | 'sale' | 'feed' | 'expense' | 'sync' | 'system';
}

export interface FarmNotification {
  id: string;
  title: string;
  message: string;
  type: 'egg' | 'feed' | 'hatch' | 'stock' | 'medicine';
  date: string;
  read: boolean;
}

export interface FullFarmData {
  profile: FarmProfile;
  animals: Animal[];
  eggCollections: EggCollection[];
  eggStorage: EggStorageData;
  incubatorBatches: IncubatorBatch[];
  inventory: InventoryItem[];
  feedingRecords: FeedingRecord[];
  expenses: Expense[];
  sales: Sale[];
  healthRecords: HealthRecord[];
  breedingPairs: BreedingPair[];
  mortalityRecords: MortalityRecord[];
  activityLogs: ActivityLog[];
  notifications: FarmNotification[];
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';
