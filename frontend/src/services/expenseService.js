const API_BASE = 'http://127.0.0.1:8000/api';

export const fetchExpenses = async (userId) => {
    const response = await fetch(`${API_BASE}/get_expenses/?user_id=${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch expenses');
    return data;
};

export const addExpense = async (payload) => {
    const response = await fetch(`${API_BASE}/add_expense/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add expense');
    return data;
};

export const deleteExpenses = async (expenseIds) => {
    const response = await fetch(`${API_BASE}/delete_expenses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expense_ids: expenseIds })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete expenses');
    return data;
};

export const updateExpense = async (expenseId, payload) => {
    const response = await fetch(`${API_BASE}/update_expense/${expenseId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update expense');
    return data;
};

export const updateSalary = async (userId, monthlySalary) => {
    const response = await fetch(`${API_BASE}/update_salary/${userId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ MonthlySalary: monthlySalary })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update salary');
    return data;
};
