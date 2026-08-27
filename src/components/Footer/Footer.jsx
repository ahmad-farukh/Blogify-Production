// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function Footer() {
    return (
        <footer className="bg-white text-red-700 py-4 border-red-800 border-1  border-red-800 font-bold text-2xl">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <Logo width="60px" />
                    <span className="text-sm text-red-600">&copy; {new Date().getFullYear()} DevUI. All rights reserved.</span>
                </div>
                
                <div className="flex flex-wrap items-center space-x-6 text-sm font-medium">
                 
                   
                    <Link to="#" className="hover:underline text-red-600">Privacy Policy</Link>
                    <Link to="#" className="hover:underline text-red-600">Terms of Service</Link>
                    <Link to="#" className="hover:underline text-red-600">Contact</Link>
                </div>
            </div>
        </footer>
    );
}