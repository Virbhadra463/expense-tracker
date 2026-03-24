import React, { useState, useEffect } from 'react';
import { Flame, X, Clock, Check, Trash2, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import useUrges from '../../hooks/useUrges';
import { addExpense as addExpenseApi } from '../../services/expenseService';

const MOTIVATIONAL_NUDGES = [
    "Still want it after sleeping on it?",
    "Is this a need or just a want?",
    "Future you will thank you for waiting.",
    "Save now, smile later.",
    "Will you remember this purchase in a week?",
    "Think about what else you could do with this money.",
];

const ImpulseBuyCard = ({ monthlySalary }) => {
    const {
        pendingUrges,
        expiredUrges,
        savedAmount,
        addUrge,
        markBought,
        markDiscarded,
        removeUrge
    } = useUrges();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showExpired, setShowExpired] = useState(true);
    const [formData, setFormData] = useState({
        name: '', amount: '', category: '', note: '', intendedDate: new Date().toISOString().split('T')[0]
    });
    const [, setTick] = useState(0);

    // Re-render every 5s to keep countdowns + nudges live
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 5000);
        const handleOpen = () => setIsFormOpen(true);
        window.addEventListener('openUrgeBuyModal', handleOpen);
        return () => {
            clearInterval(interval);
            window.removeEventListener('openUrgeBuyModal', handleOpen);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.amount) return;
        addUrge(formData);
        setFormData({ name: '', amount: '', category: '', note: '', intendedDate: new Date().toISOString().split('T')[0] });
        setIsFormOpen(false);
    };

    const handleBought = async (urge) => {
        const user = localStorage.getItem('userId');
        if (user) {
            try {
                await addExpenseApi({
                    UserId: user,
                    ExpenseCategory: urge.category || 'Other',
                    ExpenseAmount: urge.amount,
                    ExpenseDescription: urge.note ? `${urge.name} - ${urge.note}` : urge.name,
                    ExpenseDate: urge.intendedDate || new Date().toISOString().split('T')[0]
                });
            } catch (err) {
                console.error('Error logging urge as expense:', err);
            }
        }
        markBought(urge.id);
    };

    const formatCountdown = (expiresAt) => {
        const expiryTime = new Date(expiresAt).getTime();
        const diff = expiryTime - Date.now();
        if (isNaN(diff) || diff <= 0) return { text: 'Ready!', hours: 0, minutes: 0, seconds: 0, percentage: 100 };
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const percentage = Math.max(0, Math.min(100, ((24 * 60 * 60 * 1000 - diff) / (24 * 60 * 60 * 1000)) * 100));
        const text = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
        return { text, hours, minutes, seconds, percentage };
    };

    const randomNudge = (id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        const base = isNaN(numId) ? 0 : numId;
        const idx = (base + Math.floor(Date.now() / 5000)) % MOTIVATIONAL_NUDGES.length;
        return MOTIVATIONAL_NUDGES[idx];
    };

    // Calculate how many hours of work this item costs
    // Assumes 22 working days/month, 8 hours/day = 176 hours/month
    const getWorkHoursQuote = (amount) => {
        if (!monthlySalary || monthlySalary <= 0) return null;
        const hourlyRate = monthlySalary / 176;
        const hoursNeeded = amount / hourlyRate;
        const salaryPercent = ((amount / monthlySalary) * 100).toFixed(1);
        if (hoursNeeded < 1) {
            const mins = Math.round(hoursNeeded * 60);
            return `⏱ This costs ${mins} min of your work time (${salaryPercent}% of salary)`;
        }
        return `⏱ You need to work ${hoursNeeded.toFixed(1)}h to afford this (${salaryPercent}% of salary)`;
    };

    const hasUrges = pendingUrges.length > 0 || expiredUrges.length > 0;
    
    if (!hasUrges && !isFormOpen && savedAmount === 0) return null;

    return (
        <div className="flex flex-col gap-3">

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative transform transition-all">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                                <Flame className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Log an Impulse Buy</h3>
                                <p className="text-xs text-gray-500">Think before you spend</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">What do you want to buy?</label>
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. New Headphones"
                                        className="w-full text-sm rounded-xl py-2.5 px-3.5 bg-[#F8F6FF] border border-[#E8E0FF] focus:outline-none focus:ring-2 focus:ring-[#4D10A6]/20 focus:border-[#4D10A6] placeholder:text-gray-400 transition-all font-medium" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Estimated Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                            <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0"
                                                className="w-full pl-7 pr-3 max-w-full text-sm rounded-xl py-2.5 bg-[#F8F6FF] border border-[#E8E0FF] focus:outline-none focus:ring-2 focus:ring-[#4D10A6]/20 focus:border-[#4D10A6] placeholder:text-gray-400 transition-all font-bold text-[#4D10A6]" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange}
                                            className="w-full text-sm rounded-xl py-[11px] px-3.5 bg-[#F8F6FF] border border-[#E8E0FF] focus:outline-none focus:ring-2 focus:ring-[#4D10A6]/20 focus:border-[#4D10A6] text-gray-600 transition-all font-medium">
                                            <option value="">Select...</option>
                                            <option value="Food">Food</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Bills">Bills</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Note / Why do you want it?</label>
                                    <input name="note" value={formData.note} onChange={handleChange} placeholder="(optional)"
                                        className="w-full text-sm rounded-xl py-2.5 px-3.5 bg-[#F8F6FF] border border-[#E8E0FF] focus:outline-none focus:ring-2 focus:ring-[#4D10A6]/20 focus:border-[#4D10A6] placeholder:text-gray-400 transition-all" />
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit" className="w-full py-3.5 rounded-xl bg-[#4D10A6] text-[#E1FF17] text-sm font-bold hover:bg-[#3D0D85] shadow-lg shadow-[#4D10A6]/20 hover:shadow-[#4D10A6]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center gap-2 items-center tracking-wide">
                                    <Clock className="w-4 h-4 text-[#E1FF17]" />
                                    Start 24h Cooldown Timer
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">If you still want it tomorrow, buy it.</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pending Urges — Countdown Cards */}
            {pendingUrges.length > 0 && (
                <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Cooling Down ({pendingUrges.length})
                    </p>
                    {pendingUrges.map(urge => {
                        const countdown = formatCountdown(urge.expiresAt);
                        return (
                            <div key={urge.id} className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{urge.name}</p>
                                        <p className="text-[10px] text-gray-400 italic mt-0.5">{randomNudge(urge.id)}</p>
                                    </div>
                                    <span className="text-base font-extrabold text-amber-600 ml-3 shrink-0">₹{urge.amount?.toLocaleString('en-IN')}</span>
                                </div>

                                {/* Countdown Timer Bar */}
                                <div className="mb-2">
                                    <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
                                            style={{ width: `${countdown.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Timer Display */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-amber-100 rounded-lg px-2 py-1">
                                            <Clock className="w-3 h-3 text-amber-600" />
                                            <span className="text-xs font-bold text-amber-700 tabular-nums">{countdown.text}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">remaining</span>
                                    </div>
                                    {urge.category && (
                                        <span className="text-[10px] bg-white/80 text-gray-500 px-2 py-0.5 rounded-md font-medium border border-gray-200/60">{urge.category}</span>
                                    )}
                                </div>

                                {/* Work hours quote */}
                                {getWorkHoursQuote(urge.amount) && (
                                    <p className="text-[10px] text-amber-700/70 font-semibold mt-2 bg-amber-100/50 rounded-lg px-2.5 py-1.5">
                                        {getWorkHoursQuote(urge.amount)}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Expired Urges — Decision Time */}
            {expiredUrges.length > 0 && (
                <div className="space-y-3">
                    <button onClick={() => setShowExpired(!showExpired)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest cursor-pointer hover:text-red-700 transition-colors">
                        <Flame className="w-3 h-3" /> Decision Time ({expiredUrges.length})
                        {showExpired ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showExpired && expiredUrges.map(urge => (
                        <div key={urge.id} className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-gray-900 truncate flex-1 min-w-0">{urge.name}</p>
                                <span className="text-base font-extrabold text-red-500 flex-shrink-0 ml-3">₹{urge.amount?.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 mb-3 font-medium">⏰ Time's up! Did you still buy it?</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleBought(urge)}
                                    className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                                    <Check className="w-3.5 h-3.5" /> Yes, log it
                                </button>
                                <button onClick={() => markDiscarded(urge.id)}
                                    className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                                    <TrendingDown className="w-3.5 h-3.5" /> No, saved!
                                </button>
                                <button onClick={() => removeUrge(urge.id)}
                                    className="px-3 py-2 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Saved Amount Summary */}
            {savedAmount > 0 && !hasUrges && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 p-4 shadow-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Call Summary</p>
                    <p className="text-2xl font-extrabold text-emerald-700">₹{savedAmount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-500 mt-0.5">saved by resisting impulse buys 🎉</p>
                </div>
            )}

        </div>
    );
};

export default ImpulseBuyCard;
