import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ expenses = [] }) => {
    const [filterMode, setFilterMode] = useState('all'); // 'all' or 'month'
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    // Build list of available months from expenses
    const availableMonths = useMemo(() => {
        const monthSet = new Set();
        expenses.forEach(exp => {
            if (!exp.date) return;
            const d = new Date(exp.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthSet.add(key);
        });
        return Array.from(monthSet).sort().reverse();
    }, [expenses]);

    // Filter expenses based on mode
    const filteredExpenses = useMemo(() => {
        if (filterMode === 'all') return expenses;
        const [year, month] = selectedMonth.split('-').map(Number);
        return expenses.filter(exp => {
            if (!exp.date) return false;
            const d = new Date(exp.date);
            return d.getFullYear() === year && d.getMonth() === month - 1;
        });
    }, [expenses, filterMode, selectedMonth]);

    const categoryMap = {
        'Food': { color: '#4D10A6', amount: 0 },
        'Shopping': { color: '#6B21A8', amount: 0 },
        'Transport': { color: '#8B5CF6', amount: 0 },
        'Entertainment': { color: '#A78BFA', amount: 0 },
        'Bills': { color: '#C4B5FD', amount: 0 },
        'Other': { color: '#e5e7eb', amount: 0 }
    };

    filteredExpenses.forEach(exp => {
        const cat = exp.category || 'Other';
        if (categoryMap[cat]) {
            categoryMap[cat].amount += parseFloat(exp.amount || 0);
        } else {
            categoryMap['Other'].amount += parseFloat(exp.amount || 0);
        }
    });

    const activeCategories = Object.keys(categoryMap)
        .map(key => ({
            name: key,
            color: categoryMap[key].color,
            amount: categoryMap[key].amount
        }))
        .filter(cat => cat.amount > 0)
        .sort((a, b) => b.amount - a.amount);

    const hasData = activeCategories.length > 0;
    const totalSpend = activeCategories.reduce((sum, c) => sum + c.amount, 0);

    const categoryChartData = {
        labels: hasData ? activeCategories.map(c => c.name) : ['No Expenses'],
        datasets: [{
            data: hasData ? activeCategories.map(c => c.amount) : [1],
            backgroundColor: hasData ? activeCategories.map(c => c.color) : ['#f3f4f6'],
            borderWidth: 0,
            spacing: 2
        }]
    };

    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const val = context.parsed;
                        const pct = totalSpend > 0 ? ((val / totalSpend) * 100).toFixed(1) : 0;
                        return `${context.label}: ₹${val.toLocaleString('en-IN')} (${pct}%)`;
                    }
                }
            }
        },
        cutout: '60%'
    };

    const formatMonthLabel = (monthStr) => {
        const [year, month] = monthStr.split('-').map(Number);
        const d = new Date(year, month - 1);
        return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Category Breakdown</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilterMode('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterMode === 'all'
                            ? 'bg-[#4D10A6] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All Time
                    </button>
                    <button
                        onClick={() => setFilterMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterMode === 'month'
                            ? 'bg-[#4D10A6] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {filterMode === 'month' && (
                <div className="mb-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4D10A6]/30 focus:border-[#4D10A6] transition-colors"
                    >
                        {availableMonths.map(m => (
                            <option key={m} value={m}>{formatMonthLabel(m)}</option>
                        ))}
                        {availableMonths.length === 0 && (
                            <option value={selectedMonth}>{formatMonthLabel(selectedMonth)}</option>
                        )}
                    </select>
                </div>
            )}

            <div className="flex justify-center mb-6 relative" style={{ height: '250px' }}>
                <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>

            {hasData && (
                <div className="text-center mb-4">
                    <span className="text-sm text-gray-500">Total: </span>
                    <span className="text-lg font-bold text-gray-900">
                        ₹{totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            )}

            <div className="space-y-3">
                {activeCategories.map((cat) => {
                    const pct = totalSpend > 0 ? ((cat.amount / totalSpend) * 100).toFixed(1) : 0;
                    return (
                        <div key={cat.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                <span className="text-sm text-gray-700">{cat.name}</span>
                                <span className="text-xs text-gray-400">{pct}%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                ₹{cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    );
                })}
                {!hasData && (
                    <div className="text-center text-sm text-gray-500 py-4">
                        {filterMode === 'month' ? 'No expenses for this month.' : 'No expenses recorded yet.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryChart;
