import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FullFarmData, FarmProfile } from '../types';
import { calculateAge, formatDate } from './dateUtils';

export type ReportType =
  | 'Complete Farm Report'
  | 'Animal Report'
  | 'Inventory Report'
  | 'Egg Collection'
  | 'Egg Production'
  | 'Sales Report'
  | 'Expenses'
  | 'Income'
  | 'Profit & Loss'
  | 'Feed Consumption'
  | 'Incubation'
  | 'Mortality';

export type DateFilterOption = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'All Time';

export interface ReportOptions {
  reportType: ReportType;
  dateFilter: DateFilterOption;
  customStartDate?: string;
  customEndDate?: string;
}

export function generateFarmPDFReport(farmData: FullFarmData, options: ReportOptions): void {
  const doc = new jsPDF();
  const profile: FarmProfile = farmData.profile;
  const nowStr = new Date().toLocaleString();

  // Color Palette - Emerald Farm Theme
  const primaryColor = [22, 163, 74];   // #16a34a
  const secondaryColor = [30, 41, 59];  // #1e293b
  const lightBgColor = [241, 245, 249]; // #f1f5f9
  const accentGold = [217, 119, 6];     // #d97706

  // Header Banner Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(profile.farmName || 'Backyard Farm Manager', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Developed by Zac • Official Farm Record Report`, 14, 25);

  // Sub-header Info Box
  let yPos = 38;
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(14, yPos, 182, 22, 3, 3, 'F');

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Owner: `, 18, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${profile.ownerName || 'Farm Owner'} (${profile.googleEmail})`, 32, yPos + 7);

  doc.setFont('helvetica', 'bold');
  doc.text(`Address: `, 18, yPos + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(`${profile.farmAddress || 'N/A'} | Contact: ${profile.contactNumber || 'N/A'}`, 33, yPos + 13);

  doc.setFont('helvetica', 'bold');
  doc.text(`Report Type: `, 18, yPos + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.reportType} (${options.dateFilter}) | Generated: ${nowStr}`, 40, yPos + 18);

  yPos += 28;

  // Render specific tables based on options.reportType
  if (options.reportType === 'Animal Report' || options.reportType === 'Complete Farm Report') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('🐔 Livestock Inventory Summary', 14, yPos);
    yPos += 4;

    const animalRows = farmData.animals.map(a => [
      a.id,
      a.type,
      a.breed,
      a.gender,
      a.status,
      a.quantity.toString(),
      calculateAge(a.birthDate || a.dateAcquired).formatted,
      `PHP ${(a.currentValue * a.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    ]);

    const totalQty = farmData.animals.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalVal = farmData.animals.reduce((acc, curr) => acc + (curr.currentValue * curr.quantity), 0);

    autoTable(doc, {
      startY: yPos,
      head: [['ID', 'Type', 'Breed', 'Gender', 'Status', 'Qty', 'Age', 'Total Value']],
      body: animalRows,
      foot: [['', '', '', '', 'TOTAL', totalQty.toString(), '', `PHP ${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]],
      headStyles: { fillColor: primaryColor as [number, number, number] },
      footStyles: { fillColor: lightBgColor as [number, number, number], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  if (options.reportType === 'Egg Collection' || options.reportType === 'Egg Production' || options.reportType === 'Complete Farm Report') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
    doc.text('Egg Production & Storage Log', 14, yPos);
    yPos += 4;

    const eggRows = farmData.eggCollections.map(e => [
      e.id,
      formatDate(e.date),
      e.animalType,
      e.breed,
      e.quantity.toString(),
      e.remarks || '-',
    ]);

    const totalCollected = farmData.eggCollections.reduce((acc, curr) => acc + curr.quantity, 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Collection ID', 'Date', 'Species', 'Breed', 'Eggs Collected', 'Remarks']],
      body: eggRows,
      foot: [['', '', '', 'TOTAL EGGS', totalCollected.toString(), `Storage Bal: ${farmData.eggStorage.availableEggs} eggs`]],
      headStyles: { fillColor: accentGold as [number, number, number] },
      footStyles: { fillColor: lightBgColor as [number, number, number], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  if (options.reportType === 'Inventory Report' || options.reportType === 'Complete Farm Report') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Inventory & Feed Stock Status', 14, yPos);
    yPos += 4;

    const invRows = farmData.inventory.map(i => [
      i.name,
      i.category,
      `${i.quantity} ${i.unit}`,
      `${i.minStock} ${i.unit}`,
      `PHP ${i.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `PHP ${(i.quantity * i.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      i.expirationDate || 'N/A',
    ]);

    const totalInvVal = farmData.inventory.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Item Name', 'Category', 'Stock Left', 'Min Stock', 'Price/Unit', 'Total Cost', 'Exp Date']],
      body: invRows,
      foot: [['', '', '', '', 'TOTAL INVENTORY VALUE', `PHP ${totalInvVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']],
      headStyles: { fillColor: secondaryColor as [number, number, number] },
      footStyles: { fillColor: lightBgColor as [number, number, number], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  if (options.reportType === 'Sales Report' || options.reportType === 'Income' || options.reportType === 'Profit & Loss' || options.reportType === 'Complete Farm Report') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text('Sales & Revenue Summary (PHP)', 14, yPos);
    yPos += 4;

    const salesRows = farmData.sales.map(s => [
      s.id,
      formatDate(s.date),
      s.customer,
      s.category,
      s.quantity.toString(),
      `PHP ${s.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `PHP ${s.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      s.paymentMethod,
    ]);

    const totalSalesRevenue = farmData.sales.reduce((acc, curr) => acc + curr.totalAmount, 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Sale ID', 'Date', 'Customer', 'Category', 'Qty', 'Price/Unit', 'Total Revenue', 'Payment']],
      body: salesRows,
      foot: [['', '', '', '', '', 'TOTAL SALES', `PHP ${totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']],
      headStyles: { fillColor: [22, 163, 74] },
      footStyles: { fillColor: lightBgColor as [number, number, number], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  if (options.reportType === 'Expenses' || options.reportType === 'Profit & Loss' || options.reportType === 'Complete Farm Report') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(225, 29, 72);
    doc.text('Expenses & Overhead Record (PHP)', 14, yPos);
    yPos += 4;

    const expRows = farmData.expenses.map(ex => [
      ex.id,
      formatDate(ex.date),
      ex.category,
      ex.description,
      `PHP ${ex.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    ]);

    const totalExpenses = farmData.expenses.reduce((acc, curr) => acc + curr.amount, 0);

    autoTable(doc, {
      startY: yPos,
      head: [['Expense ID', 'Date', 'Category', 'Description', 'Amount (PHP)']],
      body: expRows,
      foot: [['', '', '', 'TOTAL EXPENSES', `PHP ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]],
      headStyles: { fillColor: [225, 29, 72] },
      footStyles: { fillColor: lightBgColor as [number, number, number], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  // Profit & Loss Summary Card if requested
  if (options.reportType === 'Profit & Loss' || options.reportType === 'Complete Farm Report') {
    const totalSalesRevenue = farmData.sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalExpenses = farmData.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalSalesRevenue - totalExpenses;

    doc.setFillColor(netProfit >= 0 ? 220 : 254, netProfit >= 0 ? 252 : 226, netProfit >= 0 ? 231 : 226);
    doc.roundedRect(14, yPos, 182, 20, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(netProfit >= 0 ? 22 : 180, netProfit >= 0 ? 101 : 20, netProfit >= 0 ? 52 : 20);
    doc.text(`FINANCIAL NET PROFIT / LOSS SUMMARY (PHP)`, 20, yPos + 8);

    doc.setFontSize(10);
    doc.text(
      `Total Revenue: PHP ${totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}  |  Total Expenses: PHP ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}  |  NET PROFIT: PHP ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      20,
      yPos + 15
    );
  }

  // Footer with developer credit
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Backyard Farm Manager • Developed by Zac • Powered by Google Drive & Sheets • Page ${i} of ${pageCount}`,
      105,
      288,
      { align: 'center' }
    );
  }

  // Save / Download PDF file
  const fileName = `${profile.farmName.replace(/[^a-zA-Z0-9]/g, '_')}_${options.reportType.replace(/ /g, '_')}_${options.dateFilter}.pdf`;
  doc.save(fileName);
}
