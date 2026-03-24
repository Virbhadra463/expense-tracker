import React from 'react';

const AddExpenseRow = ({ formData, handleExpenseChange, handleExpenseSubmit }) => {
    return (
        <tr className="border-b border-gray-100 bg-[#E1FF17]/10 transition-colors">
            <td className="py-2 px-2 text-left">
                <input type="date" name="date" value={formData.date} onChange={handleExpenseChange} className="w-full text-sm rounded-lg py-2 px-3 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
            </td>
            <td className="py-2 px-2 text-left">
                <input type="text" name="expense" placeholder="E.g., Coffee, Rent" value={formData.expense} onChange={handleExpenseChange} className="w-full text-sm rounded-lg py-2 px-3 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
            </td>
            <td className="py-2 px-2 text-left">
                <select name="category" value={formData.category} onChange={handleExpenseChange} className="w-full text-sm rounded-lg py-2 px-3 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6] text-left">
                    <option value="" disabled>Select</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                </select>
            </td>
            <td className="py-2 px-2">
                <input type="text" name="note" placeholder="Description..." value={formData.note} onChange={handleExpenseChange} className="w-full text-sm rounded-lg py-2 px-3 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6]" />
            </td>
            <td className="py-2 px-2">
                <input type="number" name="amount" placeholder="0.00" value={formData.amount} onChange={handleExpenseChange} className="w-full text-sm rounded-lg py-2 px-3 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4D10A6] text-right" />
            </td>
            <td className="py-2 px-2 text-right text-xs">
                <button onClick={handleExpenseSubmit} className="bg-[#4D10A6] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#4D10A6]/90 transition-colors flex items-center justify-center w-full">Save</button>
            </td>
        </tr>
    );
};

export default AddExpenseRow;
