import React from 'react';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 text-center">
        <p className="text-slate-400">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-100">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-slate-700/50">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-slate-700/20 transition-colors flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {tx.type === 'income' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{tx.category} {tx.note && <span className="text-slate-400 text-xs font-normal ml-1">- {tx.note}</span>}</p>
                <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
