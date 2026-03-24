import React, { useMemo } from 'react';
import getCategoryIcon from '../../utils/categoryIcons';

const TopExpenses = ({ expenses = [] }) => {
    const topExpenses = useMemo(() => {
        return [...expenses]
            .sort((a, b) => parseFloat(b.amount || 0) - parseFloat(a.amount || 0))
            .slice(0, 5);
    }, [expenses]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const rankColors = [
        'bg-yellow-400 text-yellow-900',
        'bg-gray-300 text-gray-700',
        'bg-amber-600 text-amber-100',
        'bg-gray-100 text-gray-500',
        'bg-gray-100 text-gray-500'
    ];

    return (
        <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Expenses</h3>
                <span className="text-sm text-gray-500">All time</span>
            </div>

            {topExpenses.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-8">
                    No expenses recorded yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {topExpenses.map((expense, idx) => {
                        const IconComponent = getCategoryIcon(expense.category);
                        const name = expense.description
                            ? expense.description.split(' - ')[0]
                            : 'Expense';

                        return (
                            <div
                                key={expense.id || idx}
                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                {/* Rank */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankColors[idx]}`}>
                                    {idx + 1}
                                </div>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-[#4D10A6]/10 flex items-center justify-center flex-shrink-0">
                                    <IconComponent className="w-5 h-5 text-[#4D10A6]" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#4D10A6]/10 text-[#4D10A6] text-[10px] font-medium">
                                            {expense.category || 'Other'}
                                        </span>
                                        <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-sm font-bold text-red-500 flex-shrink-0">
                                    ₹{parseFloat(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopExpenses;
