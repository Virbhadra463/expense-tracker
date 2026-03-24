import { useState, useEffect, useCallback } from 'react';
import { fetchExpenses as fetchExpensesApi, addExpense as addExpenseApi, deleteExpenses as deleteExpensesApi, updateExpense as updateExpenseApi, updateSalary as updateSalaryApi } from '../services/expenseService';

const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [monthlySalary, setMonthlySalary] = useState(0);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        date: new Date().toISOString().split("T")[0],
        note: '',
        expense: ''
    });

    const user = localStorage.getItem('userId');

    const loadExpenses = useCallback(async () => {
        if (!user) return;
        try {
            const data = await fetchExpensesApi(user);
            setExpenses(data.expenses || []);
            setMonthlySalary(data.monthly_salary || 0);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [user]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    const handleExpenseChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("User not logged in!");
            return;
        }

        const payload = {
            UserId: user,
            ExpenseCategory: formData.category || 'Other',
            ExpenseAmount: parseFloat(formData.amount) || 0,
            ExpenseDescription: formData.note ? `${formData.expense} - ${formData.note}` : formData.expense,
            ExpenseDate: formData.date
        };

        try {
            await addExpenseApi(payload);
            setIsAddExpenseOpen(false);

            // Default back to today if current month is selected, else 1st of selected month.
            const today = new Date();
            let defaultDate = today;
            if (today.getMonth() !== selectedDate.getMonth() || today.getFullYear() !== selectedDate.getFullYear()) {
                defaultDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
            }

            setFormData({
                amount: '',
                category: '',
                date: defaultDate.toISOString().split("T")[0],
                note: '',
                expense: ''
            });
            loadExpenses();
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    };

    const toggleAddExpense = () => {
        setIsAddExpenseOpen(!isAddExpenseOpen);
        if (!isAddExpenseOpen) {
            // Default to today if current month is selected, else 1st of selected month.
            const today = new Date();
            let defaultDate = today;
            if (today.getMonth() !== selectedDate.getMonth() || today.getFullYear() !== selectedDate.getFullYear()) {
                defaultDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                // adjust for timezone offset to get correct YYYY-MM-DD
                defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
            }
            setFormData(prev => ({ ...prev, date: defaultDate.toISOString().split("T")[0] }));
        }
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedExpenses([]);
        setEditingExpenseId(null); // Exit edit mode when entering delete mode
    };

    const toggleSelectExpense = (id) => {
        setSelectedExpenses(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedExpenses.length === expenses.length) {
            setSelectedExpenses([]);
        } else {
            setSelectedExpenses(expenses.map(e => e.id));
        }
    };

    const handleDeleteExpenses = async () => {
        if (selectedExpenses.length === 0) return;
        try {
            await deleteExpensesApi(selectedExpenses);
            setIsDeleteMode(false);
            setSelectedExpenses([]);
            loadExpenses();
        } catch (error) {
            console.error('Error deleting expenses:', error);
        }
    };

    // Edit expense logic
    const startEditExpense = (expense) => {
        const descriptionParts = expense.description ? expense.description.split(' - ') : [''];
        const expenseTitle = descriptionParts[0] || '';
        const expenseNote = descriptionParts.length > 1 ? descriptionParts.slice(1).join(' - ') : '';

        setEditingExpenseId(expense.id);
        setEditFormData({
            date: expense.date || '',
            expense: expenseTitle,
            category: expense.category || '',
            note: expenseNote,
            amount: expense.amount || ''
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const cancelEdit = () => {
        setEditingExpenseId(null);
        setEditFormData({});
    };

    const handleEditSubmit = async (expenseId) => {
        const payload = {
            ExpenseDate: editFormData.date,
            ExpenseDescription: editFormData.note ? `${editFormData.expense} - ${editFormData.note}` : editFormData.expense,
            ExpenseAmount: parseFloat(editFormData.amount) || 0,
            ExpenseCategory: editFormData.category || 'Other'
        };

        try {
            await updateExpenseApi(expenseId, payload);
            setEditingExpenseId(null);
            setEditFormData({});
            loadExpenses();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleSalaryUpdate = async (newSalary) => {
        if (!user) return;
        try {
            const data = await updateSalaryApi(user, newSalary);
            setMonthlySalary(data.monthly_salary);
        } catch (error) {
            console.error('Error updating salary:', error);
        }
    };

    // Calculate monthly spent logic based on selected date
    const handlePrevMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const spentThisMonth = expenses.reduce((total, expense) => {
        if (!expense.date) return total;
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return total + parseFloat(expense.amount || 0);
        }
        return total;
    }, 0);

    const remainingThisMonth = Math.max(0, monthlySalary - spentThisMonth);
    const progressPercentage = monthlySalary > 0 ? Math.min(100, (spentThisMonth / monthlySalary) * 100) : 0;

    return {
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
    };
};

export default useExpenses;
