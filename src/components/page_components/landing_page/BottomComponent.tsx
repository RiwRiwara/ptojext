"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { HiArrowUp } from 'react-icons/hi';
import Image from 'next/image';

export default function BottomComponent() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter signup functionality
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="relative   pt-16 pb-8 border-t border-gray-200 bg-white">
            {/* Decorative elements */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Logo and tagline */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="relative h-10 w-10 mr-3">
                                <Image src="/logo/logo-full.png" alt="Logo" width={40} height={40} />
                            </div>
                            <h3 className="text-xl font-bold text-[#83AFC9]">Visual Right : AI Playground</h3>
                        </div>
                        <p className="text-gray-600 mb-6 pr-4">
                            Explore the fascinating world of AI algorithms through interactive visualizations and simulations. Learn, experiment, and have fun!
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com/RiwRiwara/ptojext.git" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-600 transition-colors">
                                <FaGithub size={20} />
                            </a>

                            {/* <a href="https://discord.gg/yourinvite" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-400 transition-colors">
                                <FaDiscord size={20} />
                            </a> */}
                        </div>
                    </div>

                    {/* Navigation links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-600 hover:text-sky-600 transition-colors">Home</Link></li>
                            <li><Link href="/visualizations" className="text-gray-600 hover:text-sky-600 transition-colors">Visualizations</Link></li>
                            <li><Link href="/simulations" className="text-gray-600 hover:text-sky-600 transition-colors">Simulations</Link></li>
                            {/* <li><Link href="/about" className="text-gray-600 hover:text-sky-600 transition-colors">About</Link></li> */}
                            {/* <li><Link href="/contact" className="text-gray-600 hover:text-sky-600 transition-colors">Contact</Link></li> */}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Tutorials</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Community</a></li>
                        </ul>
                    </div>

                    {/* Newsletter signup */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Stay Updated</h4>
                        <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                required
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent flex-grow"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-[#83AFC9] text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Bottom section with copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Visual Right. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <Link href="/about/privacy" className="hover:text-sky-600 transition-colors">Privacy Policy</Link>
                        <span className="hidden sm:inline">•</span>
                        <Link href="/about/terms" className="hover:text-sky-600 transition-colors">Terms of Service</Link>
                        <span className="hidden sm:inline">•</span>
                        <Link href="/about" className="hover:text-sky-600 transition-colors">About Us</Link>
                    </div>
                </div>
            </div>

            {/* Back to top button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-3 bg-white rounded-full shadow-lg border border-gray-200 text-sky-600 hover:bg-sky-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <HiArrowUp size={20} />
            </motion.button>
        </footer>
    );
}
