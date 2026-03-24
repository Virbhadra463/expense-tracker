import React, { useState, useEffect, useRef } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, Trash2, X, Pencil, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const BalanceCard = ({
    isAddExpenseOpen,
    toggleAddExpense,
    isDeleteMode,
    toggleDeleteMode,
    monthlySalary,
    spentThisMonth,
    remainingThisMonth,
    progressPercentage,
    handleSalaryUpdate,
    selectedDate,
    handlePrevMonth,
    handleNextMonth
}) => {
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [tempSalary, setTempSalary] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditingSalary) {
            setTempSalary(monthlySalary.toString());
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 0);
        }
    }, [isEditingSalary, monthlySalary]);

    const submitSalary = () => {
        const value = parseFloat(tempSalary);
        if (!isNaN(value)) handleSalaryUpdate(value);
        setIsEditingSalary(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') submitSalary();
        if (e.key === 'Escape') setIsEditingSalary(false);
    };

    return (
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4D10A6] to-[#6B21A8] flex items-center justify-center shrink-0">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Balance</p>
                        <select id="currency-select" className="text-sm bg-transparent border-none outline-none cursor-pointer text-gray-800 font-semibold p-0 leading-tight">
                            <option>INR</option>
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                        </select>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E1FF17]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#4D10A6]" />
                </div>
            </div>

            {/* Balance Amount */}
            <div className="relative group mb-5">
                {isEditingSalary ? (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-5xl font-bold text-gray-900">₹</span>
                        <input
                            ref={inputRef}
                            type="number"
                            value={tempSalary}
                            onChange={(e) => setTempSalary(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="text-5xl font-bold text-gray-900 bg-transparent border-b-2 border-[#4D10A6] outline-none w-48"
                            min="0"
                        />
                        <button onClick={submitSalary} className="p-2 bg-[#4D10A6] text-white rounded-lg hover:bg-[#4D10A6]/90 transition-colors ml-2">
                            <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsEditingSalary(false)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-5xl font-bold text-gray-900 truncate tracking-tight" id="total-balance">
                            ₹{monthlySalary?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </h2>
                        <button onClick={() => setIsEditingSalary(true)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 shrink-0 transition-colors">
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <p className="text-sm text-gray-500">Monthly Budget / Pocket Money</p>
            </div>

            {/* Month + Progress */}
            <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold text-gray-700 min-w-[80px] text-center">
                            {selectedDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900" id="spent-percentage">
                        {Math.round(progressPercentage || 0)}%
                    </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div id="progress-bar"
                        className={`h-full rounded-full transition-all duration-500 ${progressPercentage > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-[#4D10A6] to-[#6B21A8]'}`}
                        style={{ width: `${Math.min(100, Math.max(0, progressPercentage || 0))}%` }}></div>
                </div>
                <div className="flex justify-between mt-3">
                    <div>
                        <p className="text-xs text-gray-500">Spent</p>
                        <p className="text-base font-bold text-gray-900" id="spent-amount">
                            ₹{spentThisMonth?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className={`text-base font-bold ${remainingThisMonth <= 0 ? 'text-red-500' : 'text-[#4D10A6]'}`} id="remaining-amount">
                            ₹{remainingThisMonth?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button onClick={toggleAddExpense} className="flex-1 bg-[#E1FF17] hover:bg-[#C8E800] text-gray-900 py-3 rounded-2xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4" />
                    Add Expense
                </button>
                <button onClick={toggleDeleteMode} className={`flex-1 py-3 rounded-2xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 ${isDeleteMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#4D10A6] hover:bg-[#4D10A6]/90 text-white'}`}>
                    {isDeleteMode ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    {isDeleteMode ? 'Cancel' : 'Delete Expense'}
                </button>
            </div>
        </div>
    );
};

export default BalanceCard;
