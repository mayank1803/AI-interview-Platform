"use client"
import React from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function Header() {
    const path = usePathname();

    return (
        <div className="relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://www.shutterstock.com/image-photo/job-recruitment-recruiting-hiring-overhead-260nw-1930282715.jpg')`, opacity: 0.9 }}
            />

            {/* Header Content */}
            <div className="relative flex items-center justify-between p-4 md:p-6  bg-opacity-80 shadow-lg rounded-lg">
                {/* Logo */}
                <Image src="/logo.svg" width={160} height={100} alt="logo" />

                {/* Navigation Links */}
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
            </div>
        </div>
    );
}

export default Header;
