import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import Charts from './Charts';

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'accounts', user.uid, 'transactions'),
      orderBy('date', 'desc')
    );
    //123456
    //12345678
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  // Calculate stats
  const { totalIncome, totalExpense } = transactions.reduce((acc, tx) => {
    if (tx.type === 'income') acc.totalIncome += tx.amount;
    else acc.totalExpense += tx.amount;
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  const totalBalance = totalIncome - totalExpense;

  const totalBalanceStr = totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const incomeStr = totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const expenseStr = totalExpense.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <header className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-700/50 shadow-2xl">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
              Finance Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Real-time tracking & analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-inner">
                <span className="font-semibold text-sky-400">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <span className="text-sm font-medium text-slate-300 hidden md:inline-block">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-300"
            >
              Log Out
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Quick Stats Sidebar */}
            <div className="space-y-6 md:col-span-1">

              {/* Total Balance */}
              <div className="glass-card rounded-2xl p-6 hover:translate-y-[-4px] transition-transform duration-300">
                <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold tracking-tight text-white mb-2">{totalBalanceStr}</h3>
              </div>

              {/* Income */}
              <div className="glass rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-300">
                <p className="text-slate-400 text-sm font-medium mb-1">Total Income</p>
                <h3 className="text-2xl font-bold tracking-tight text-emerald-400 mb-2">{incomeStr}</h3>
              </div>

              {/* Expense */}
              <div className="glass rounded-2xl p-6 border border-rose-500/20 hover:border-rose-500/40 transition-colors duration-300">
                <p className="text-slate-400 text-sm font-medium mb-1">Total Expenses</p>
                <h3 className="text-2xl font-bold tracking-tight text-rose-400 mb-2">{expenseStr}</h3>
              </div>

              {/* Add Transaction Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                <span>Add Transaction</span>
              </button>

            </div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">

              <Charts transactions={transactions} />

              <TransactionList transactions={transactions} />

            </div>
          </div>
        )}

      </div>

      {/* Modal for adding transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <TransactionForm uid={user.uid} onClose={() => setIsModalOpen(false)} />
        </div>
      )}

    </div>
  );
};

export default Dashboard;
