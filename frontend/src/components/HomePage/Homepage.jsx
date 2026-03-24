import React from 'react';
import useExpenses from '../../hooks/useExpenses';
import BalanceCard from './BalanceCard';
import ExpenseTable from './ExpenseTable';
import ImpulseBuyCard from './UrgeBuyCard';
import './Homepage.css';

const Dashboard = () => {
    const {
        expenses,
        monthlySalary,
        spentThisMonth,
        remainingThisMonth,
        progressPercentage,
        selectedDate,
        handlePrevMonth,
        handleNextMonth,
        isAddExpenseOpen,
        toggleAddExpense,
        isDeleteMode,
        selectedExpenses,
        formData,
        editingExpenseId,
        editFormData,
        handleExpenseChange,
        handleExpenseSubmit,
        toggleDeleteMode,
        toggleSelectExpense,
        toggleSelectAll,
        handleDeleteExpenses,
        startEditExpense,
        handleEditFormChange,
        cancelEdit,
        handleEditSubmit,
        handleSalaryUpdate
    } = useExpenses();

    return (
        <div className="bg-white font-inter h-[calc(100vh-62px)] overflow-hidden flex flex-col relative">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(77, 16, 166, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 16, 166, 0.04) 1px, transparent 1px)', backgroundSize: '56px 56px' }}></div>

            <div className="flex-1 p-6 lg:p-8 min-h-0 relative z-10">
                <div className="max-w-[1800px] mx-auto h-full">
                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
                        {/* Left Column */}
                        <div className="lg:col-span-4 xl:col-span-3 space-y-4 flex flex-col h-full min-h-0 overflow-y-auto hidden-scrollbar pb-6 lg:pb-0">
                            <BalanceCard
                                isAddExpenseOpen={isAddExpenseOpen}
                                toggleAddExpense={toggleAddExpense}
                                isDeleteMode={isDeleteMode}
                                toggleDeleteMode={toggleDeleteMode}
                                monthlySalary={monthlySalary}
                                spentThisMonth={spentThisMonth}
                                remainingThisMonth={remainingThisMonth}
                                progressPercentage={progressPercentage}
                                handleSalaryUpdate={handleSalaryUpdate}
                                selectedDate={selectedDate}
                                handlePrevMonth={handlePrevMonth}
                                handleNextMonth={handleNextMonth}
                            />
                            <ImpulseBuyCard monthlySalary={monthlySalary} />
                        </div>

                        {/* Center Column */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full min-h-0 overflow-hidden">
                            <ExpenseTable
                                expenses={expenses.filter(exp => {
                                    if (!exp.date) return false;
                                    const d = new Date(exp.date);
                                    return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
                                })}
                                isAddExpenseOpen={isAddExpenseOpen}
                                isDeleteMode={isDeleteMode}
                                selectedExpenses={selectedExpenses}
                                formData={formData}
                                editingExpenseId={editingExpenseId}
                                editFormData={editFormData}
                                handleExpenseChange={handleExpenseChange}
                                handleExpenseSubmit={handleExpenseSubmit}
                                handleDeleteExpenses={handleDeleteExpenses}
                                toggleDeleteMode={toggleDeleteMode}
                                toggleSelectExpense={toggleSelectExpense}
                                toggleSelectAll={toggleSelectAll}
                                startEditExpense={startEditExpense}
                                handleEditFormChange={handleEditFormChange}
                                cancelEdit={cancelEdit}
                                handleEditSubmit={handleEditSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
