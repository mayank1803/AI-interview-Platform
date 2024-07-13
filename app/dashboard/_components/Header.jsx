"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

function Header() {
    const path = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://www.shutterstock.com/image-photo/job-recruitment-recruiting-hiring-overhead-260nw-1930282715.jpg')`, opacity: 0.9 }}
            />

            {/* Header Content */}
            <div className="relative flex items-center justify-between p-4 md:p-6 bg-opacity-80 shadow-lg rounded-lg z-10">
                {/* Logo */}
                <Image src="/logo.svg" width={160} height={100} alt="logo" className="w-32 md:w-40" />

                {/* Navigation Links for Desktop */}
                <ul className="hidden md:flex gap-8 text-blue-500 font-medium">
                    <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/dashboard' && 'text-blue-800 font-semibold'}`}>
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/questions' && 'text-blue-800 font-semibold'}`}>
                        <a href="/questions">Questions</a>
                    </li>
                    <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/how' && 'text-blue-800 font-semibold'}`}>
                        <a href="/how">How it Works?</a>
                    </li>
                </ul>

                {/* User Button */}
                <UserButton />

                {/* Hamburger Menu for Mobile */}
                <button className="md:hidden text-blue-500" onClick={toggleMenu}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-20">
                    <ul className="flex flex-col gap-4 text-blue-500 font-medium">
                        <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/dashboard' && 'text-blue-800 font-semibold'}`}>
                            <a href="/dashboard" onClick={toggleMenu}>Dashboard</a>
                        </li>
                        <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/questions' && 'text-blue-800 font-semibold'}`}>
                            <a href="/questions" onClick={toggleMenu}>Questions</a>
                        </li>
                        <li className={`hover:text-primary hover:font-semibold transition-all ${path === '/how' && 'text-blue-800 font-semibold'}`}>
                            <a href="/how" onClick={toggleMenu}>How it Works?</a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Header;
