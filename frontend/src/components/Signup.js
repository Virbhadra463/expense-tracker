import React, { useState } from 'react';
import { Wallet, Mail, Lock, ArrowRight, ChevronDown } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname === '/signup' ? 'register' : 'login';
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Birthdate: '',
        Gender: '',
        Email: '',
        Password: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ------------------ LOGIN LOGIC ------------------
        if (activeTab === 'login') {
            if (!formData.Email || !formData.Password) {
                toast.error("Please fill in email and password.");
                return;
            }

            try {
                const payload = {
                    Email: formData.Email,
                    Password: formData.Password
                };

                const response = await fetch("http://127.0.0.1:8000/api/login/", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.status === 200) {
                    toast.success('Login Successful!');
                    // Save user credentials
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('userName', data.userName);
                    // Clear fields and redirect them to their dashboard
                    setFormData({ ...formData, Email: '', Password: '' });
                    navigate('/home');
                } else {
                    toast.error(data.message || "Invalid credentials.");
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error("Could not connect to server. Try Again.");
            }
            return;
        }

        // ------------------ REGISTER LOGIC ------------------
        if (activeTab === 'register') {
            // Frontend validation
            if (!formData.FirstName || !formData.LastName || !formData.Email || !formData.Password || !formData.Gender) {
                toast.error("Please fill in all required fields.");
                return;
            }
            if (!formData.Birthdate) {
                toast.error("Please enter your birthdate.");
                return;
            }

            try {
                const payload = {
                    FirstName: formData.FirstName,
                    LastName: formData.LastName,
                    BirthDate: formData.Birthdate,
                    Gender: formData.Gender,
                    Email: formData.Email,
                    Password: formData.Password
                };

                const response = await fetch("http://127.0.0.1:8000/api/signup/", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.status === 201) {
                    toast.success('Signup Successful! Please Login.');

                    // Switch tab back to login automatically by updating URL
                    setTimeout(() => {
                        navigate('/login');
                        // Optionally clear out registration form data
                        setFormData({
                            FirstName: '',
                            LastName: '',
                            Birthdate: '',
                            Gender: '',
                            Email: '',
                            Password: ''
                        });
                    }, 1500);
                }
                else {
                    toast.error(data.message || "Something went wrong.");
                }

            }
            catch (error) {
                console.error('Error:', error);
                toast.error("Could not connect to server. Try Again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f3f3] font-inter">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Hero Content */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 pb-12 gap-12 lg:gap-24 max-w-[1400px] mx-auto w-full">
                {/* Left: Hero Text */}
                <div className="text-center lg:text-left flex-1 max-w-[700px]">
                    <h1 className="text-[50px] lg:text-[78px] leading-[1.0] font-black text-black tracking-tight">
                        Not just an expense tracker
                    </h1>

                    <p className="mt-8 text-gray-500 text-[20px] lg:text-[28px] leading-relaxed font-medium">
                        a financial tool as well.
                    </p>
                </div>

                {/* Right: Auth Card */}
                <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d8ff00]/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

                    {/* Tabs Container */}
                    <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl mb-8 border border-gray-200">
                        <button
                            onClick={() => navigate('/login')}
                            id="tab-login"
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'login'
                                ? 'shadow-sm bg-white text-[#5b2ccf]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            id="tab-register"
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'register'
                                ? 'shadow-sm bg-white text-[#5b2ccf]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form id="form-login" className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                    Email or Username
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-[#5b2ccf] transition-colors" />
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="form-input w-full rounded-2xl py-3.5 pl-12 pr-4 font-semibold text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <a href="#!" className="text-xs font-bold text-[#5b2ccf] hover:underline">
                                        Forgot?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-[#5b2ccf] transition-colors" />
                                    <input
                                        type="password"
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="form-input w-full rounded-2xl py-3.5 pl-12 pr-4 font-semibold text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full bg-[#5b2ccf] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#4a24a8] transition shadow-[0_10px_20px_-5px_rgba(91,44,207,0.3)] flex items-center justify-center gap-2 mt-4 hover:translate-y-[-2px]"
                            >
                                Sign In <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form id="form-register" className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name='FirstName'
                                        value={formData.FirstName}
                                        placeholder="John"
                                        onChange={handleChange}
                                        className="form-input w-full rounded-xl py-2.5 px-4 font-semibold text-gray-900 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name='LastName'
                                        value={formData.LastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        className="form-input w-full rounded-xl py-2.5 px-4 font-semibold text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        Birthdate
                                    </label>
                                    <input
                                        type="date"
                                        className="form-input w-full rounded-xl py-2.5 px-3 font-medium text-gray-500 text-sm"
                                        name='Birthdate'
                                        value={formData.Birthdate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <select
                                            name='Gender'
                                            value={formData.Gender}
                                            onChange={handleChange}
                                            className="form-input w-full rounded-xl py-2.5 px-3 font-medium text-gray-500 appearance-none bg-transparent text-sm cursor-pointer"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                    Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#d8ff00] transition-colors" />
                                    <input
                                        type="email"
                                        name='Email'
                                        value={formData.Email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="form-input w-full rounded-xl py-2.5 pl-10 pr-4 font-semibold text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#d8ff00] transition-colors" />
                                    <input
                                        type="password"
                                        name='Password'
                                        value={formData.Password}
                                        onChange={handleChange}
                                        placeholder="Create password"
                                        className="form-input w-full rounded-xl py-2.5 pl-10 pr-4 font-semibold text-gray-900 text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full bg-[#d8ff00] text-black font-bold text-lg py-3.5 rounded-2xl hover:bg-[#c2e600] transition shadow-[0_10px_20px_-5px_rgba(216,255,0,0.4)] mt-2 hover:translate-y-[-2px]"
                            >
                                Create Account
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Signup;
