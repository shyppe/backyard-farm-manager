import React, { useState } from 'react';
import { useFarmContext } from '../context/FarmContext';
import { SaleCategory, ExpenseCategory } from '../types';
import { getTodayDateString, formatDate } from '../utils/dateUtils';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  ShoppingCart,
  X,
  CreditCard,
  Wallet,
} from 'lucide-react';

export const FinancesView: React.FC = () => {
  const { farmData, recordSale, addExpense } = useFarmContext();

  const [activeTab, setActiveTab] = useState<'sales' | 'expenses'>('sales');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Sale Form State
  const [customer, setCustomer] = useState('Batangas Public Market Stall');
  const [category, setCategory] = useState<SaleCategory>('Eggs');
  const [breed, setBreed] = useState('Rhode Island Red');
  const [quantity, setQuantity] = useState(24);
  const [pricePerUnit, setPricePerUnit] = useState(240.00);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'GCash' | 'Bank Transfer' | 'Credit'>('GCash');
  const [saleRemarks, setSaleRemarks] = useState('Fresh farm eggs');

  // Expense Form State
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Feed');
  const [amount, setAmount] = useState(1850.00);
  const [description, setDescription] = useState('Purchased 50kg Layer feed bag');

  if (!farmData) return null;

  const { sales, expenses } = farmData;

  const totalSalesRevenue = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExpensesAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalSalesRevenue - totalExpensesAmount;

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordSale({
      date: getTodayDateString(),
      customer,
      category,
      breed,
      quantity,
      pricePerUnit,
      paymentMethod,
      remarks: saleRemarks,
    });
    setIsSaleModalOpen(false);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense({
      date: getTodayDateString(),
      category: expCategory,
      amount,
      description,
    });
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Finances & Sales Record
          </h2>
          <p className="text-xs text-slate-400">
            Track farm sales, income categories, payment methods & overhead expenses
          </p>
        </div>
      </div>

      {/* Overview Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₱{totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Expenses</p>
            <p className="text-2xl font-black text-rose-400 mt-1">₱{totalExpensesAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Net Farm Profit</p>
            <p className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
              ₱{netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            ₱
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'sales' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-1" />
          Sales Records ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'expenses' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4 inline mr-1" />
          Expense Logs ({expenses.length})
        </button>
      </div>

      {/* TAB 1: SALES */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsSaleModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Record New Sale
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
            {sales.map(sale => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    💰
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {sale.customer} • {sale.category} ({sale.breed})
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatDate(sale.date)} • {sale.quantity} units @ ₱{sale.pricePerUnit.toFixed(2)}/ea • Paid via {sale.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">+₱{sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{sale.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Record New Expense
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
            {expenses.map(exp => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                    💵
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{exp.category} Expense</p>
                    <p className="text-[10px] text-slate-400">{formatDate(exp.date)} • {exp.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-rose-400">-₱{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Sale Modal */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Record Sale</h3>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={e => setCustomer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as SaleCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Eggs">Eggs</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Feeds">Feeds</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Breed / Item</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price Per Unit ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={pricePerUnit}
                    onChange={e => setPricePerUnit(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-400 my-2">
                <span>Calculated Total Revenue:</span>
                <span className="text-base">${(quantity * pricePerUnit).toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition"
              >
                Record Sale & Update Inventory Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Record Farm Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="Feed">Feed</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Labor">Labor</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-base font-bold text-rose-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Reason</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition"
              >
                Save Expense Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
