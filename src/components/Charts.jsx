import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = ({ transactions }) => {
  // Aggregate data for Bar Chart (Monthly Income vs Expense)
  const barData = useMemo(() => {
    const monthlyData = {};
    
    transactions.forEach(tx => {
      const month = tx.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        monthlyData[month].income += tx.amount;
      } else {
        monthlyData[month].expense += tx.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Format "YYYY-MM" to "MMM YYYY"
    const labels = sortedMonths.map(m => {
      const date = new Date(m + '-01');
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: sortedMonths.map(m => monthlyData[m].income),
          backgroundColor: 'rgba(52, 211, 153, 0.8)', // Emerald-400
          borderRadius: 4,
        },
        {
          label: 'Expenses',
          data: sortedMonths.map(m => monthlyData[m].expense),
          backgroundColor: 'rgba(244, 63, 94, 0.8)', // Rose-500
          borderRadius: 4,
        }
      ]
    };
  }, [transactions]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1', font: { family: 'Inter' } }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: 'bold' },
        bodyFont: { family: 'Inter' },
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      }
    }
  };

  // Aggregate data for Pie Chart (Expense by Category)
  const pieData = useMemo(() => {
    const expensesByCategory = {};
    
    transactions.filter(tx => tx.type === 'expense').forEach(tx => {
      if (!expensesByCategory[tx.category]) {
        expensesByCategory[tx.category] = 0;
      }
      expensesByCategory[tx.category] += tx.amount;
    });

    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);

    // Vibrant Tailwind-inspired colors
    const backgroundColors = [
      '#38bdf8', // Sky
      '#818cf8', // Indigo
      '#c084fc', // Purple
      '#f472b6', // Pink
      '#fbbf24', // Amber
      '#34d399', // Emerald
      '#94a3b8'  // Slate
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 0,
        }
      ]
    };
  }, [transactions]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#cbd5e1', boxWidth: 12, font: { family: 'Inter' } }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        bodyFont: { family: 'Inter' },
      }
    }
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card rounded-2xl p-6 lg:col-span-2 h-80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
          Income vs Expenses
        </h3>
        <div className="h-64 relative">
          {barData.labels.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div className="flex pt-20 justify-center text-slate-500">No monthly data</div>
          )}
        </div>
      </div>
      
      <div className="glass-card rounded-2xl p-6 h-80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
          Expenses by Category
        </h3>
        <div className="h-64 relative pb-4">
          {pieData.labels.length > 0 ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <div className="flex pt-20 justify-center text-slate-500 text-center">No expense data<br/>to display</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
