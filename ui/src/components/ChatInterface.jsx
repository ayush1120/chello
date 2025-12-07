import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import chatData from '../data/chat_sequence.json';

const ChatInterface = () => {
    // State to track which message has its "thoughts" expanded
    const [expandedThoughts, setExpandedThoughts] = useState({});
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    const toggleThoughts = (turnId) => {
        setExpandedThoughts(prev => ({
            ...prev,
            [turnId]: !prev[turnId]
        }));
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="h-16 px-8 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-semibold text-slate-700">Asker Agent</h2>
                    <p className="text-xs text-purple-600 font-mono">Session: {chatData.meta.session_name}</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {chatData.chat_sequence.map((turn) => (
                    <div key={turn.turn_id} className="flex flex-col gap-6">

                        {/* User Message */}
                        <div className="flex gap-4 ml-auto flex-row-reverse max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-slate-200 text-slate-600">
                                <User size={20} />
                            </div>
                            <div className="rounded-2xl p-4 shadow-sm backdrop-blur-sm bg-purple-100/80 text-purple-900 border border-purple-200/50 rounded-tr-none">
                                <p className="leading-relaxed whitespace-pre-wrap">{turn.user_message}</p>
                            </div>
                        </div>

                        {/* Agent Message */}
                        <div className="flex gap-4 max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-purple-500 to-rose-400 text-white">
                                <Bot size={20} />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                {/* Main Bubble */}
                                <div className="rounded-2xl p-4 shadow-sm backdrop-blur-sm bg-white/60 border border-white/40 text-slate-700 rounded-tl-none relative group">
                                    <p className="leading-relaxed whitespace-pre-line">{turn.asker}</p>

                                    {/* Expand Thoughts Button */}
                                    {turn.processing_simulation && (
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                onClick={() => toggleThoughts(turn.turn_id)}
                                                className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-purple-600 transition-colors px-2 py-1 rounded-md hover:bg-purple-50"
                                            >
                                                <Sparkles size={12} />
                                                {expandedThoughts[turn.turn_id] ? 'Hide Internals' : 'View Internals'}
                                                {expandedThoughts[turn.turn_id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Internal Thoughts (Expandable) */}
                                {expandedThoughts[turn.turn_id] && turn.processing_simulation && (
                                    <div className="ml-2 rounded-xl bg-slate-50/80 border border-slate-200/60 p-3 text-xs font-mono text-slate-600 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-2 mb-1 border-b border-slate-200 pb-1">
                                            <span className={`w-2 h-2 rounded-full ${turn.processing_simulation.status === 'loop_complete' ? 'bg-green-400' :
                                                    turn.processing_simulation.status.includes('searching') ? 'bg-blue-400' :
                                                        'bg-amber-400'
                                                }`} />
                                            <span className="uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                                                {turn.processing_simulation.status.replace('_', ' ')}
                                            </span>
                                            <span className="ml-auto text-[10px] text-slate-400">
                                                {turn.processing_simulation.system_delay_ms}ms
                                            </span>
                                        </div>
                                        <p>{turn.processing_simulation.log}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/20 bg-white/10 backdrop-blur-md">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-purple-300/30 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                    <div className="relative flex items-center bg-white/50 rounded-xl border border-white/40 focus-within:border-purple-300 focus-within:bg-white/70 transition-all overflow-hidden shadow-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Reply to the simulation..."
                            className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[56px] max-h-32 text-slate-700 placeholder-slate-400 resize-none"
                            rows={1}
                        />
                        <button
                            className="p-3 mr-2 rounded-lg bg-gradient-to-br from-purple-500 to-rose-500 text-white hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ChatInterface;
