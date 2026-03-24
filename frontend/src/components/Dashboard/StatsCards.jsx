import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Zap, Trophy } from 'lucide-react';

const StatsCards = ({ expenses = [], monthlySalary = 0 }) => {
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const dayOfMonth = now.getDate();

        // This month's expenses
        const thisMonthExpenses = expenses.filter(exp => {
            if (!exp.date) return false;
            const d = new Date(exp.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        // Last month's expenses
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const lastMonthExpenses = expenses.filter(exp => {
            if (!exp.date) return false;
            const d = new Date(exp.date);
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        });

        // Total spent all time
        const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        // This month total
        const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        // Last month total
        const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        // Percentage change
        let percentChange = 0;
        let changeDirection = 'neutral';
        if (lastMonthTotal > 0) {
            percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);
            changeDirection = thisMonthTotal > lastMonthTotal ? 'up' : thisMonthTotal < lastMonthTotal ? 'down' : 'neutral';
        } else if (thisMonthTotal > 0) {
            percentChange = 100;
            changeDirection = 'up';
        }

        // Daily average (this month)
        const dailyAvg = dayOfMonth > 0 ? thisMonthTotal / dayOfMonth : 0;

        // Biggest single expense
        let biggest = null;
        if (expenses.length > 0) {
            biggest = expenses.reduce((max, exp) =>
                parseFloat(exp.amount || 0) > parseFloat(max.amount || 0) ? exp : max
                , expenses[0]);
        }

        return { totalSpent, thisMonthTotal, lastMonthTotal, percentChange, changeDirection, dailyAvg, biggest };
    }, [expenses]);

    const formatAmount = (val) => '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const biggestName = stats.biggest
        ? (stats.biggest.description ? stats.biggest.description.split(' - ')[0] : 'Expense')
        : '—';

    const cards = [
        {
            label: 'Total Spent',
            value: formatAmount(stats.totalSpent),
            sub: 'All time',
            icon: DollarSign,
            iconBg: 'bg-[#4D10A6]/10',
            iconColor: 'text-[#4D10A6]'
        },
        {
            label: 'This Month',
            value: formatAmount(stats.thisMonthTotal),
            sub: stats.changeDirection === 'up'
                ? `↑ ${Math.abs(stats.percentChange)}% vs last month`
                : stats.changeDirection === 'down'
                    ? `↓ ${Math.abs(stats.percentChange)}% vs last month`
                    : 'Same as last month',
            subColor: stats.changeDirection === 'up' ? 'text-red-500' : stats.changeDirection === 'down' ? 'text-green-500' : 'text-gray-400',
            icon: stats.changeDirection === 'up' ? TrendingUp : TrendingDown,
            iconBg: stats.changeDirection === 'up' ? 'bg-red-50' : 'bg-green-50',
            iconColor: stats.changeDirection === 'up' ? 'text-red-500' : 'text-green-500'
        },
        {
            label: 'Daily Average',
            value: formatAmount(stats.dailyAvg),
            sub: 'This month',
            icon: Zap,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500'
        },
        {
            label: 'Biggest Expense',
            value: stats.biggest ? formatAmount(parseFloat(stats.biggest.amount)) : '—',
            sub: biggestName,
            icon: Trophy,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                    <div key={i} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">{card.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
                        <span className={`text-xs ${card.subColor || 'text-gray-400'}`}>{card.sub}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
