import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'agent', content: "Hello! I'm your Asker Agent. I'm here to understand your needs and help you feel better. How are you feeling today?" },
        { id: 2, type: 'user', content: "I'm feeling a bit anxious about the project deadline." },
        { id: 3, type: 'agent', content: "I understand that deadlines can be stressful. Let's break it down. What exactly makes you feel anxious? Is it the workload or the complexity?" }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), type: 'user', content: input }]);
        setInput('');
        // Simulation of response would go here
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="h-16 px-8 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-semibold text-slate-700">Asker Agent</h2>
                    <p className="text-xs text-purple-600 font-mono">Status: Connected</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-4 max-w-3xl ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm 
                            ${msg.type === 'agent'
                                ? 'bg-gradient-to-br from-purple-500 to-rose-400 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                        >
                            {msg.type === 'agent' ? <Bot size={20} /> : <User size={20} />}
                        </div>

                        {/* Bubble */}
                        <div className={`rounded-2xl p-4 shadow-sm backdrop-blur-sm
                            ${msg.type === 'agent'
                                ? 'bg-white/60 border border-white/40 text-slate-700 rounded-tl-none'
                                : 'bg-purple-100/80 text-purple-900 border border-purple-200/50 rounded-tr-none'
                            }`}
                        >
                            <p className="leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/20 bg-white/10 backdrop-blur-md">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-purple-300/30 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                    <div className="relative flex items-center bg-white/50 rounded-xl border border-white/40 focus-within:border-purple-300 focus-within:bg-white/70 transition-all overflow-hidden shadow-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Type a message..."
                            className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[56px] max-h-32 text-slate-700 placeholder-slate-400 resize-none"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            className="p-3 mr-2 rounded-lg bg-gradient-to-br from-purple-500 to-rose-500 text-white hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-slate-400 text-xs mt-3">AI can make mistakes. Please verify important information.</p>
            </div>
        </div>
    );
};

export default ChatInterface;
