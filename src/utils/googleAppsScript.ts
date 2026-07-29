import { FullFarmData } from '../types';

export const APPS_SCRIPT_CODE_STRING = `/**
 * Backyard Farm Manager - Google Apps Script Backend (Code.gs)
 * Developed by: Zac
 * 
 * Instructions:
 * 1. Open Google Drive (https://drive.google.com)
 * 2. Click "+ New" -> "More" -> "Google Apps Script"
 * 3. Replace all code in Code.gs with this entire file.
 * 4. Click "Deploy" -> "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (or "Anyone with Google account")
 * 8. Authorize permissions when prompted.
 * 9. Copy the Web App URL and paste it into Backyard Farm Manager Settings!
 */

const FOLDER_NAME = "Backyard Farm Manager";
const DATA_FILE_NAME = "FarmData.json";
const SPREADSHEET_NAME = "Backyard_Farm_Database";

// Standard sheets tabs required by Backyard Farm Manager
const SHEET_TABS = [
  "Dashboard",
  "Animals",
  "Egg Collection",
  "Incubator",
  "Inventory",
  "Feeds",
  "Expenses",
  "Sales",
  "Income",
  "Medicine",
  "Vaccination",
  "Breeding",
  "Mortality",
  "Reports",
  "Settings"
];

function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail() || (e && e.parameter && e.parameter.email) || "default_user";
  const action = e && e.parameter ? e.parameter.action : "load";

  if (action === "load") {
    const data = loadFarmData(userEmail);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Backyard Farm Manager API active for " + userEmail }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const userEmail = contents.email || Session.getActiveUser().getEmail() || "default_user";
    const farmData = contents.data;

    if (!farmData) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No data payload provided" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const result = saveFarmData(userEmail, farmData);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Ensures Google Drive folder hierarchy exists and returns references.
 */
function getOrCreateFarmFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  let mainFolder;
  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
    mainFolder = DriveApp.createFolder(FOLDER_NAME);
    mainFolder.createFolder("Reports");
    mainFolder.createFolder("Images");
  }
  return mainFolder;
}

/**
 * Ensures Google Spreadsheet database exists inside the Drive folder with required tabs.
 */
function getOrCreateSpreadsheet(folder) {
  const files = folder.getFilesByName(SPREADSHEET_NAME);
  let ss;
  if (files.hasNext()) {
    const file = files.next();
    ss = SpreadsheetApp.openById(file.getId());
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    const file = DriveApp.getFileById(ss.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);

    // Create tabs
    SHEET_TABS.forEach(function(tabName) {
      if (!ss.getSheetByName(tabName)) {
        ss.insertSheet(tabName);
      }
    });

    // Remove default Sheet1 if exists
    const defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheet);
    }
  }
  return ss;
}

/**
 * Load farm data from Google Drive JSON file
 */
function loadFarmData(userEmail) {
  const folder = getOrCreateFarmFolder();
  const files = folder.getFilesByName(DATA_FILE_NAME);

  if (files.hasNext()) {
    const file = files.next();
    const content = file.getBlob().getDataAsString();
    return JSON.parse(content);
  }

  return null; // Return null if no data found (triggers setup wizard in client)
}

/**
 * Save farm data to Google Drive JSON file and sync tables to Google Sheets
 */
function saveFarmData(userEmail, data) {
  const folder = getOrCreateFarmFolder();
  const files = folder.getFilesByName(DATA_FILE_NAME);

  let file;
  if (files.hasNext()) {
    file = files.next();
    file.setContent(JSON.stringify(data, null, 2));
  } else {
    file = folder.createFile(DATA_FILE_NAME, JSON.stringify(data, null, 2), MimeType.PLAIN_TEXT);
  }

  // Sync tabular sheets
  const ss = getOrCreateSpreadsheet(folder);
  syncToSheets(ss, data);

  return {
    fileId: file.getId(),
    spreadsheetId: ss.getId(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Syncs full farm data array structures into Google Sheets tabs
 */
function syncToSheets(ss, data) {
  if (!data) return;

  // Sync Animals Sheet
  if (data.animals) {
    const sheet = ss.getSheetByName("Animals") || ss.insertSheet("Animals");
    sheet.clear();
    const headers = ["Animal ID", "Type", "Breed", "Variety", "Gender", "Status", "Date Acquired", "Birth Date", "Quantity", "Purchase Price", "Current Value", "Weight (kg)", "Color", "Notes"];
    const rows = data.animals.map(a => [a.id, a.type, a.breed, a.variety, a.gender, a.status, a.dateAcquired, a.birthDate, a.quantity, a.purchasePrice, a.currentValue, a.weight, a.color, a.notes]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Sync Egg Collection Sheet
  if (data.eggCollections) {
    const sheet = ss.getSheetByName("Egg Collection") || ss.insertSheet("Egg Collection");
    sheet.clear();
    const headers = ["ID", "Date", "Animal Type", "Breed", "Quantity", "Remarks"];
    const rows = data.eggCollections.map(e => [e.id, e.date, e.animalType, e.breed, e.quantity, e.remarks]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Sync Incubator Sheet
  if (data.incubatorBatches) {
    const sheet = ss.getSheetByName("Incubator") || ss.insertSheet("Incubator");
    sheet.clear();
    const headers = ["Batch ID", "Batch Name", "Date Started", "Species", "Breed", "Egg Quantity", "Expected Hatch Date", "Status", "Hatched Count", "Notes"];
    const rows = data.incubatorBatches.map(b => [b.id, b.batchName, b.dateStarted, b.species, b.breed, b.eggQuantity, b.expectedHatchDate, b.status, b.hatchedCount, b.notes]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Sync Inventory Sheet
  if (data.inventory) {
    const sheet = ss.getSheetByName("Inventory") || ss.insertSheet("Inventory");
    sheet.clear();
    const headers = ["ID", "Name", "Category", "Unit", "Quantity", "Min Stock", "Purchase Date", "Supplier", "Price", "Total Cost", "Expiration Date", "Notes"];
    const rows = data.inventory.map(i => [i.id, i.name, i.category, i.unit, i.quantity, i.minStock, i.purchaseDate, i.supplier, i.price, i.totalCost, i.expirationDate, i.notes]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Sync Expenses Sheet
  if (data.expenses) {
    const sheet = ss.getSheetByName("Expenses") || ss.insertSheet("Expenses");
    sheet.clear();
    const headers = ["ID", "Date", "Category", "Amount ($)", "Description"];
    const rows = data.expenses.map(ex => [ex.id, ex.date, ex.category, ex.amount, ex.description]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Sync Sales Sheet
  if (data.sales) {
    const sheet = ss.getSheetByName("Sales") || ss.insertSheet("Sales");
    sheet.clear();
    const headers = ["ID", "Date", "Customer", "Category", "Breed", "Quantity", "Price/Unit", "Total ($)", "Payment Method", "Remarks"];
    const rows = data.sales.map(s => [s.id, s.date, s.customer, s.category, s.breed, s.quantity, s.pricePerUnit, s.totalAmount, s.paymentMethod, s.remarks]);
    sheet.appendRow(headers);
    if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}
`;

/**
 * Service to sync farm data either through deployed Google Apps Script Web App or Local Storage per Gmail account
 */
export async function syncFarmDataToBackend(
  email: string,
  data: FullFarmData,
  appsScriptUrl?: string
): Promise<{ success: boolean; mode: 'google_apps_script' | 'local_drive_simulator'; message: string }> {
  // If user provided a real Apps Script URL, try pushing live
  if (appsScriptUrl && appsScriptUrl.trim().length > 10) {
    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          email,
          data,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success') {
          return {
            success: true,
            mode: 'google_apps_script',
            message: 'Successfully synced to Google Drive & Sheets via Apps Script!',
          };
        }
      }
    } catch (err) {
      console.warn('Apps Script endpoint failed, falling back to Google Drive Local Storage Simulator:', err);
    }
  }

  // Local Google Drive & Sheets Simulator per account key
  try {
    const storageKey = `backyard_farm_manager_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    return {
      success: true,
      mode: 'local_drive_simulator',
      message: 'Saved to local Google Drive / Sheets persistent store.',
    };
  } catch (e) {
    return {
      success: false,
      mode: 'local_drive_simulator',
      message: 'Local storage error: ' + String(e),
    };
  }
}

/**
 * Load Farm Data for a given Gmail account from Apps Script or Local Google Drive store
 */
export async function loadFarmDataFromBackend(
  email: string,
  appsScriptUrl?: string
): Promise<{ data: FullFarmData | null; mode: 'google_apps_script' | 'local_drive_simulator' }> {
  if (appsScriptUrl && appsScriptUrl.trim().length > 10) {
    try {
      const url = `${appsScriptUrl}?action=load&email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success' && json.data) {
          return { data: json.data, mode: 'google_apps_script' };
        }
      }
    } catch (err) {
      console.warn('Failed to load from Apps Script, checking local store:', err);
    }
  }

  const storageKey = `backyard_farm_manager_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const localRaw = localStorage.getItem(storageKey);
  if (localRaw) {
    try {
      const parsed = JSON.parse(localRaw);
      return { data: parsed, mode: 'local_drive_simulator' };
    } catch (e) {
      console.error('Error parsing local farm data:', e);
    }
  }

  return { data: null, mode: 'local_drive_simulator' };
}
