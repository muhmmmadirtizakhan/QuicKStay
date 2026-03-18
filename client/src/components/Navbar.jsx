import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, UserButton } from '@clerk/clerk-react';
import {useAppContext} from '../context/AppContext'
import { toast } from 'react-hot-toast';
const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    const { openSignIn } = useClerk();
const {user,navigate,isOwner,setShowHotelReg,axios,getToken}=useAppContext();
const location = useLocation();
useEffect(() => {
if(location.pathname!=='/'){
setIsScrolled(true);
return;
}else{
    setIsScrolled(false);
}
setIsScrolled(prev=>location.pathname!=='/' ? true : prev);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    const handleLoginClick = () => {
        if (openSignIn) {
            openSignIn();
        } else {
            console.error("openSignIn is not available");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            toast.error('Enter a destination to search');
            return;
        }
        const destination = searchValue.trim();
        setIsSearching(true);
        try {
            if (user) {
                const token = await getToken();
                await axios.post('/api/user/store-recent-search',
                    { recentSearchedCity: destination },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            // silent fail, still navigate
        } finally {
            navigate(`/rooms?destination=${encodeURIComponent(destination)}`);
            setIsMenuOpen(false);
            setIsSearching(false);
        }
    };

    const BookIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
            isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"
        }`}>
            {/* Logo */}
            <Link to='/'>
                <img 
                    src={assets.logo} 
                    alt="logo" 
                    className={`h-9 ${isScrolled && "invert opacity-80"}`}
                />
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link key={i} to={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </Link>
                ))}
                {user && (
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} onClick={()=>isOwner ? navigate('/owner') :setShowHotelReg(true)}>
                        {isOwner ? 'Dashboard' :'list your hotel'} 
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search destination"
                        className={`h-9 px-3 rounded-full border border-gray-300 outline-none text-sm ${
                            isScrolled ? "bg-white text-gray-800" : "bg-white/90 text-gray-800"
                        }`}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-60"
                        title="Search"
                    >
                        <img src={assets.searchIcon} alt="search" className="h-5" />
                    </button>
                </form>
                
                {user ? (
                    <UserButton afterSignOutUrl="/">
                        <UserButton.MenuItems>
                            <UserButton.Action 
                                label="My Bookings" 
                                labelIcon={<BookIcon />}
                                onClick={() => navigate('/my-bookings')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button 
                        onClick={handleLoginClick} 
                        className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer ${
                            isScrolled ? "text-white bg-black" : "bg-white text-black"
                        }`}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Section */}
            <div className="flex items-center gap-3 md:hidden">
                {/* UserButton in mobile - YAHI SE MY BOOKINGS ACCESS HOGA */}
                {user && (
                    <UserButton afterSignOutUrl="/">
                        <UserButton.MenuItems>
                            <UserButton.Action 
                                label="My Bookings" 
                                labelIcon={<BookIcon />}
                                onClick={() => navigate('/my-bookings')}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
                {/* Menu Toggle Button */}
                <img 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    src={assets.menuIcon} 
                    alt="menu" 
                    className={`${isScrolled && 'invert'} h-4 cursor-pointer`} 
                />
            </div>

            {/* Mobile Menu - WITHOUT My Bookings (like YouTube) */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden transition-all duration-500 z-50 ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Close Button */}
                <button className="absolute top-4 right-4 z-10" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="close-menu" className="h-6" />
                </button>

                {/* Menu Items - Top se start, NO My Bookings here */}
                <div className="flex flex-col items-start gap-6 pt-20 px-8">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search destination"
                            className="h-10 px-3 rounded-full border border-gray-300 outline-none text-sm w-full"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-60"
                            title="Search"
                        >
                            <img src={assets.searchIcon} alt="search" className="h-5" />
                        </button>
                    </form>
                    {navLinks.map((link, i) => (
                        <Link 
                            key={i} 
                            to={link.path} 
                            onClick={() => setIsMenuOpen(false)}
                            className="text-lg font-medium text-gray-800 hover:text-black transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Dashboard Button */}
        {user && (
            <button 
onClick={() =>isOwner ? navigate('/owner'):setShowHotelReg(true)                            
                            }
                            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all mt-2"
                        >
                           {isOwner ? 'dashbaord' :'list your hotel'}
                        </button>
                    )}

                    {/* Login Button - for non-logged in users */}
                    {!user && (
                        <button 
                            onClick={() => {
                                handleLoginClick();
                                setIsMenuOpen(false);
                            }} 
                            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer mt-4"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
