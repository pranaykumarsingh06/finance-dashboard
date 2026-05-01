import React from 'react';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-slate-400">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300">
      <div className="p-6 border-b border-slate-700/50 bg-slate-900/40">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recent Transactions
        </h3>
      </div>
      <div className="divide-y divide-slate-700/50">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-slate-700/30 hover:scale-[1.01] transition-all duration-300 flex items-center justify-between cursor-default">
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
