import React, { useState } from 'react';
import { Bot, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <motion.div
            className="fixed left-0 top-0 h-full w-16 hover:w-64 bg-white/30 backdrop-blur-md border-r border-white/40 z-50 flex flex-col items-center hover:items-start transition-all duration-300 group overflow-hidden shadow-sm"
            initial={{ width: '4rem' }}
            whileHover={{ width: '16rem' }}
        >
            {/* Logo Area */}
            <div className="h-16 w-full flex items-center justify-center group-hover:justify-start group-hover:px-6 transition-all border-b border-white/20">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                    <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="ml-3 font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Chalo Agent
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 w-full py-6 flex flex-col gap-2 px-2">
                <NavItem
                    icon={<Bot size={24} />}
                    label="Chat"
                    isActive={activeTab === 'chat'}
                    onClick={() => setActiveTab('chat')}
                />
                <NavItem
                    icon={<Brain size={24} />}
                    label="Agent Internals"
                    isActive={activeTab === 'visualizer'}
                    onClick={() => setActiveTab('visualizer')}
                />
            </nav>

            {/* Footer */}
            <div className="p-4 w-full border-t border-white/20">
                <div className="flex items-center justify-center group-hover:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 border border-white/50" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-sm font-medium text-slate-700">User</p>
                        <p className="text-xs text-slate-500">Mindful Plan</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 relative group/item
        ${isActive
                ? 'bg-purple-100/50 text-purple-700'
                : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
            }`}
    >
        <span className="flex-shrink-0">{icon}</span>
        <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {label}
        </span>
        {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full shadow-sm" />
        )}
    </button>
);

export default Sidebar;
