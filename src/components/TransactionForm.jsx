import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/auth'; // Wait, it's firestore
import { db } from '../firebase';

// Oops correct imports in file content
import { collection as firestoreCollection, addDoc as firestoreAddDoc, serverTimestamp as firestoreServerTimestamp } from 'firebase/firestore';

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
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 shadow-2xl w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Add Transaction</h3>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex p-1 bg-slate-900/50 rounded-lg">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
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
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select a category...</option>
            {currentCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Note (Optional)</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-sky-500 hover:bg-sky-400 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-sky-500/20 disabled:opacity-70"
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
