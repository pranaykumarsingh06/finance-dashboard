import React, { useState } from 'react';
import { collection as firestoreCollection, addDoc as firestoreAddDoc, serverTimestamp as firestoreServerTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionForm = ({ uid, onClose }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Predefined categories
  const expenseCategories = ['Rent/Mortgage', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Healthcare', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      const userTransactionsRef = firestoreCollection(db, 'accounts', uid, 'transactions');
      
      await firestoreAddDoc(userTransactionsRef, {
        type,
        amount: parsedAmount,
        category,
        date,
        note,
        createdAt: firestoreServerTimestamp(),
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Error adding transaction: ", error);
      alert("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-md border border-slate-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xl font-bold text-white text-gradient bg-gradient-to-r from-sky-400 to-indigo-400">Add Transaction</h3>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Type Toggle */}
        <div className="flex p-1 bg-slate-900/50 rounded-lg border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Income
          </button>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 shadow-inner"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 shadow-inner"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
          <select
            required
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 shadow-inner appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled className="bg-slate-900 text-slate-500">Select a category...</option>
            {currentCategories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Note (Optional)</label>
          <input
            type="text"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-300 shadow-inner"
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
