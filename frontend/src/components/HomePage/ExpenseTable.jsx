import React from 'react';
import { Trash2, ChevronDown, X, Pencil, Check } from 'lucide-react';
import getCategoryIcon from '../../utils/categoryIcons';
import AddExpenseRow from './AddExpenseRow';

const ExpenseTable = ({
    expenses,
    isAddExpenseOpen,
    isDeleteMode,
    selectedExpenses,
    formData,
    editingExpenseId,
    editFormData,
    handleExpenseChange,
    handleExpenseSubmit,
    handleDeleteExpenses,
    toggleDeleteMode,
    toggleSelectExpense,
    toggleSelectAll,
    startEditExpense,
    handleEditFormChange,
    cancelEdit,
    handleEditSubmit
}) => {
    return (
        <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">Expenses</h3>
                    {isDeleteMode && (
                        <span className="text-sm text-gray-500">
                            {selectedExpenses.length} selected
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isDeleteMode ? (
                        <>
                            <button onClick={handleDeleteExpenses} disabled={selectedExpenses.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${selectedExpenses.length > 0 ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">Confirm Delete ({selectedExpenses.length})</span>
                            </button>
                            <button onClick={toggleDeleteMode}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">Cancel</span>
                            </button>
                        </>
                    ) : (
                        <select className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <select>Recent
                                <option> NewestFirst </option>

                            </select>
                            <option>Amount(highest to lowest)</option>
                            <option>Other</option>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </select>
                    )}
                </div>
            </div>

            <div className="overflow-auto expense-scroll flex-1 min-h-0 relative">
                <table className="w-full table-fixed text-left">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                        <tr className="border-b border-gray-100">
                            {isDeleteMode && (
                                <th className="w-[5%] text-left py-3 px-2">
                                    <input type="checkbox" checked={expenses.length > 0 && selectedExpenses.length === expenses.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4D10A6] focus:ring-[#4D10A6] cursor-pointer accent-[#4D10A6]" />
                                </th>
                            )}
                            <th className={`${isDeleteMode ? 'w-[12%]' : 'w-[12%]'} text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate`}>Date</th>
                            <th className={`${isDeleteMode ? 'w-[25%]' : 'w-[25%]'} text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate`}>Expense</th>
                            <th className={`${isDeleteMode ? 'w-[14%]' : 'w-[15%]'} text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate`}>Category</th>
                            <th className={`${isDeleteMode ? 'w-[27%]' : 'w-[25%]'} text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate`}>Note</th>
                            <th className={`${isDeleteMode ? 'w-[10%]' : 'w-[13%]'} text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate`}>Amount</th>
                            {!isDeleteMode && <th className="w-[10%] text-right py-3 px-2"></th>}
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {isAddExpenseOpen && (
                            <AddExpenseRow
                                formData={formData}
                                handleExpenseChange={handleExpenseChange}
                                handleExpenseSubmit={handleExpenseSubmit}
                            />
                        )}
                        {expenses.map((expense, idx) => {
                            const IconComponent = getCategoryIcon(expense.category);
                            const descriptionParts = expense.description ? expense.description.split(' - ') : [''];
                            const expenseTitle = descriptionParts[0] || 'Expense';
                            const expenseNote = descriptionParts.length > 1 ? descriptionParts.slice(1).join(' - ') : '';
                            const isEditing = editingExpenseId === expense.id;

                            // Render inline edit row
                            if (isEditing) {
                                return (
                                    <tr key={expense.id} className="border-b border-gray-100 bg-blue-50/50 transition-colors">
                                        <td className="py-2 px-1 text-left overflow-hidden">
                                            <input type="date" name="date" value={editFormData.date || ''} onChange={handleEditFormChange}
                                                className="w-full min-w-0 text-xs rounded-lg py-1.5 px-2 bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
                                        </td>
                                        <td className="py-2 px-1 text-left overflow-hidden">
                                            <input type="text" name="expense" value={editFormData.expense || ''} onChange={handleEditFormChange}
                                                className="w-full min-w-0 text-xs rounded-lg py-1.5 px-2 bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
                                        </td>
                                        <td className="py-2 px-1 text-left overflow-hidden">
                                            <select name="category" value={editFormData.category || ''} onChange={handleEditFormChange}
                                                className="w-full min-w-0 text-xs rounded-lg py-1.5 px-2 bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]">
                                                <option value="" disabled>Select</option>
                                                <option value="Food">Food</option>
                                                <option value="Shopping">Shopping</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Bills">Bills</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-1 text-left overflow-hidden">
                                            <input type="text" name="note" value={editFormData.note || ''} onChange={handleEditFormChange}
                                                className="w-full min-w-0 text-xs rounded-lg py-1.5 px-2 bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
                                        </td>
                                        <td className="py-2 px-1 overflow-hidden">
                                            <input type="number" name="amount" value={editFormData.amount || ''} onChange={handleEditFormChange}
                                                className="w-full min-w-0 text-xs rounded-lg py-1.5 px-2 bg-white border border-blue-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6] text-right" />
                                        </td>
                                        <td className="py-2 px-1 text-right overflow-hidden">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEditSubmit(expense.id)}
                                                    className="p-1.5 rounded-lg bg-[#4D10A6] text-white hover:bg-[#4D10A6]/90 transition-colors" title="Save">
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={cancelEdit}
                                                    className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors" title="Cancel">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            // Normal row with edit icon on hover
                            return (
                                <tr key={expense.id || idx}
                                    className={`expense-row border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${isDeleteMode && selectedExpenses.includes(expense.id) ? 'bg-red-50' : ''}`}
                                    onClick={() => isDeleteMode && toggleSelectExpense(expense.id)}>
                                    {isDeleteMode && (
                                        <td className="py-4 px-2 text-left">
                                            <input type="checkbox" checked={selectedExpenses.includes(expense.id)}
                                                onChange={() => toggleSelectExpense(expense.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-4 h-4 rounded border-gray-300 text-[#4D10A6] focus:ring-[#4D10A6] cursor-pointer accent-[#4D10A6]" />
                                        </td>
                                    )}
                                    <td className="py-4 px-2 truncate text-left">
                                        <span className="text-sm text-gray-600">{expense.date}</span>
                                    </td>
                                    <td className="py-4 px-2 truncate text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 truncate">{expenseTitle}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 truncate text-left">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#4D10A6]/10 text-[#4D10A6] text-xs font-medium">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 truncate text-left">
                                        <span className="text-sm text-gray-500 truncate block">{expenseNote}</span>
                                    </td>
                                    <td className="py-4 px-2 text-right truncate">
                                        <span className="text-sm font-semibold text-red-500 block">
                                            ₹{parseFloat(expense.amount).toFixed(2)}
                                        </span>
                                    </td>
                                    {!isDeleteMode && (
                                        <td className="py-4 px-2 text-right">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startEditExpense(expense); }}
                                                className="edit-btn p-2 rounded-lg hover:bg-[#4D10A6]/10 text-gray-400 hover:text-[#4D10A6] transition-all"
                                                title="Edit expense">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTable;
