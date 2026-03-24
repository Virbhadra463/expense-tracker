import React from 'react';
import { Wallet, Bell, User, Flame } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine if we are logged in or on auth pages
    const isLoggedInPage = location.pathname.includes('/home') || location.pathname.includes('/dashboard') || location.pathname.includes('/impulse');
    const isAuth = location.pathname.includes('/login') || location.pathname.toLowerCase().includes('/signup');

    if (location.pathname === '/' || location.pathname === '/landingpage.html') return null;

    // Fetch user name and calculate initials
    const userName = localStorage.getItem('userName') || '';
    const getInitials = (name) => {
        if (!name) return 'U'; // Fallback
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };
    const userInitials = getInitials(userName);

    return (
        <header className="w-full h-[62px] flex items-center justify-between px-6 lg:px-12 bg-white border-b-[1.5px] border-[#E8E0FF] relative z-50 transition-all duration-300">
            {/* Top Left: Logo from Landingpage */}
            <div className="flex items-center gap-[0.7rem]">
                <Link to={isLoggedInPage ? "/home" : "/"} className="flex items-center gap-[0.7rem] font-['Bricolage_Grotesque',sans-serif] font-[800] text-[1.1rem] tracking-[-0.5px] text-[#4D10A6]">
                    <div className="w-[36px] h-[36px] bg-[#4D10A6] rounded-lg flex items-center justify-center relative overflow-hidden">
                        <span className="text-[#E1FF17] absolute leading-none">₹</span>
                    </div>
                    <span>Spend<em className="text-[#4D10A6] not-italic font-normal">Smart</em></span>
                </Link>
            </div>

            {/* Center Navigation for Logged-In Users */}
            {isLoggedInPage && (
                <nav className="hidden md:flex items-center gap-[2.2rem]">
                    <Link to="/dashboard" className={`text-[0.72rem] font-[500] tracking-[1.5px] uppercase transition-colors duration-200 ${location.pathname === '/dashboard' ? 'text-[#4D10A6]' : 'text-[#4A3F6B] hover:text-[#4D10A6]'}`}>
                        Dashboard
                    </Link>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('openUrgeBuyModal'))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E0FF] bg-[#F8F6FF] hover:bg-[#E1FF17]/20 text-[0.72rem] font-[800] tracking-[1px] uppercase transition-colors duration-200 text-[#4D10A6] cursor-pointer`}
                    >
                        Impulse Buy
                    </button>
                </nav>
            )}

            {/* Top Right: Dynamic actions based on route - hidden on auth pages */}
            {!isAuth && (
                <div className="flex items-center gap-[0.7rem]">
                    {isLoggedInPage ? (
                        <>
                            <button className="w-[36px] h-[36px] rounded border-[1.5px] border-[#E8E0FF] bg-white hover:bg-[#F8F6FF] text-[#4D10A6] flex items-center justify-center transition-colors">
                                <Bell className="w-[18px] h-[18px]" />
                            </button>
                            <div className="w-[36px] h-[36px] rounded bg-[#4D10A6] flex items-center justify-center cursor-pointer shadow-sm">
                                <span className="text-[#E1FF17] text-[0.73rem] font-[700] tracking-[0.5px] leading-none">{userInitials}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="py-[0.4rem] px-[1rem] text-[0.73rem] font-[500] tracking-[0.5px] text-[#4D10A6] border-[1.5px] border-[#4D10A6] rounded-[4px] hover:bg-[#4D10A6] hover:text-white transition-all duration-200"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="py-[0.42rem] px-[1.1rem] text-[0.73rem] font-[700] tracking-[0.5px] bg-[#E1FF17] text-[#0D0820] border-[1.5px] border-[#E1FF17] rounded-[4px] hover:bg-[#C8E800] hover:-translate-y-[1px] transition-all duration-200"
                            >
                                Start Free
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
