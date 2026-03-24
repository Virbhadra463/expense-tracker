const API_BASE = 'http://127.0.0.1:8000/api';

export const fetchImpulses = async (userId) => {
    const response = await fetch(`${API_BASE}/get_impulses/?user_id=${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch impulses');
    return data;
};

export const addImpulse = async (payload) => {
    const response = await fetch(`${API_BASE}/add_impulse/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add impulse');
    return data;
};

export const updateImpulseStatus = async (impulseId, status) => {
    const response = await fetch(`${API_BASE}/update_impulse/${impulseId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update impulse');
    return data;
};

export const deleteImpulse = async (impulseId) => {
    const response = await fetch(`${API_BASE}/delete_impulse/${impulseId}/`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete impulse');
    return data;
};
