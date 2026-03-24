import { useState, useEffect, useCallback } from 'react';
import { fetchImpulses, addImpulse, updateImpulseStatus, deleteImpulse } from '../services/impulseService';

const useUrges = () => {
    const [urges, setUrges] = useState([]);
    const [savedAmount, setSavedAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('userId');

    // Fetch from backend on mount
    const loadUrges = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await fetchImpulses(userId);
            setUrges(data.impulses || []);
            setSavedAmount(data.savedAmount || 0);
        } catch (err) {
            console.error('Failed to load impulses:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadUrges();
    }, [loadUrges]);

    const addUrge = useCallback(async (formData) => {
        if (!userId) return;
        try {
            const res = await addImpulse({
                UserId: userId,
                Name: formData.name,
                Amount: parseFloat(formData.amount) || 0,
                Category: formData.category || 'Other',
                Note: formData.note || '',
                IntendedDate: formData.intendedDate || null
            });
            // Add the new impulse to state immediately
            if (res.impulse) {
                setUrges(prev => [res.impulse, ...prev]);
            }
        } catch (err) {
            console.error('Failed to add impulse:', err);
        }
    }, [userId]);

    const markBought = useCallback(async (id) => {
        try {
            await updateImpulseStatus(id, 'bought');
            setUrges(prev => prev.map(u => u.id === id ? { ...u, status: 'bought' } : u));
        } catch (err) {
            console.error('Failed to mark as bought:', err);
        }
    }, []);

    const markDiscarded = useCallback(async (id) => {
        try {
            await updateImpulseStatus(id, 'discarded');
            setUrges(prev => prev.map(u => u.id === id ? { ...u, status: 'discarded' } : u));
            // Reload to get updated saved amount
            loadUrges();
        } catch (err) {
            console.error('Failed to mark as discarded:', err);
        }
    }, [loadUrges]);

    const removeUrge = useCallback(async (id) => {
        try {
            await deleteImpulse(id);
            setUrges(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error('Failed to delete impulse:', err);
        }
    }, []);

    // Derived lists
    const now = Date.now();
    const pendingUrges = urges.filter(u => u.status === 'pending' && new Date(u.expiresAt).getTime() > now);
    const expiredUrges = urges.filter(u => u.status === 'pending' && new Date(u.expiresAt).getTime() <= now);

    return {
        urges,
        pendingUrges,
        expiredUrges,
        savedAmount,
        loading,
        addUrge,
        markBought,
        markDiscarded,
        removeUrge
    };
};

export default useUrges;
