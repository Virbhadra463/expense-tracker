import React from 'react';
import useExpenses from '../../hooks/useExpenses';
import StatsCards from './StatsCards';
import CategoryChart from './CategoryChart';
import MonthlyChart from './MonthlyChart';
import SpendingTrend from './SpendingTrend';
import TopExpenses from './TopExpenses';

const Dashboard = () => {
    const { expenses, monthlySalary } = useExpenses();

    return (
        <div className="bg-white font-inter min-h-[calc(100vh-62px)] relative">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(77, 16, 166, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 16, 166, 0.04) 1px, transparent 1px)', backgroundSize: '56px 56px' }}></div>

            <div className="min-h-screen p-8 relative z-10">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Row 1: Summary Stats */}
                    <StatsCards expenses={expenses} monthlySalary={monthlySalary} />

                    {/* Row 2: Category Chart + Spending Trend */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CategoryChart expenses={expenses} />
                        <SpendingTrend expenses={expenses} />
                    </div>

                    {/* Row 3: Monthly Chart + Top Expenses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MonthlyChart expenses={expenses} />
                        <TopExpenses expenses={expenses} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
