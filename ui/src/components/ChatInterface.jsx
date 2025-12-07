import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, ChevronDown, ChevronUp, Sparkles, Activity, Search, Brain, CheckCircle } from 'lucide-react';

const InternalThoughtTimeline = ({ simulation }) => {
    // Normalize to array
    const steps = Array.isArray(simulation) ? simulation : [simulation];

    return (
        <div className="ml-2 mt-3 pl-4 border-l-2 border-purple-200 space-y-4">
            {steps.map((step, idx) => {
                // Parse log: "Agent Name: Action/Content"
                const parts = step.log.split(': ');
                const agentName = parts.length > 1 ? parts[0] : 'System';
                const content = parts.length > 1 ? parts.slice(1).join(': ') : step.log;

                // Determine styling based on status/agent
                let icon = <Activity size={14} />;
                let badgeColor = 'bg-slate-100 text-slate-600';

                if (step.status.includes('searching') || agentName.includes('Web Surfer')) {
                    icon = <Search size={14} />;
                    badgeColor = 'bg-sky-100 text-sky-700 border-sky-200';
                } else if (step.status.includes('clarifying') || agentName.includes('Clarifier')) {
                    icon = <Brain size={14} />;
                    badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
                } else if (step.status.includes('loop') || agentName.includes('Loop')) {
                    icon = <CheckCircle size={14} />;
                    badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                }

                return (
                    <div key={idx} className="relative animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
                        {/* Timeline Connector (if not last) */}
                        {idx < steps.length - 1 && (
                            <div className="absolute left-[7px] top-6 bottom-[-16px] w-[2px] bg-purple-100"></div>
                        )}

                        <div className="bg-white/80 border border-purple-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            {/* Header: Badge & Timer */}
                            <div className="flex items-center justify-between mb-2">
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                                    {icon}
                                    {step.status.replace(/_/g, ' ')}
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                    {step.system_delay_ms}ms
                                </span>
                            </div>

                            {/* Content */}
                            <div className="text-xs">
                                <span className="font-bold text-slate-700 block mb-1">{agentName}</span>
                                <p className="text-slate-600 font-mono leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                                    {content}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ChatInterface = () => {
    // State to track which message has its "thoughts" expanded
    const [expandedThoughts, setExpandedThoughts] = useState({});
    // Presentation Mode: Track current step (0 to length-1)
    const [currentStep, setCurrentStep] = useState(0);
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState('');
    const [chatSequence, setChatSequence] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data at runtime
    useEffect(() => {
        fetch('/ai_studio_code.json')
            .then(res => res.json())
            .then(data => {
                setChatSequence(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load chat data", err);
                setLoading(false);
            });
    }, []);

    const totalSteps = chatSequence?.chat_sequence?.length || 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [expandedThoughts, currentStep, chatSequence]);

    // Key Binding Listener for Presentation Mode
    useEffect(() => {
        if (!chatSequence) return;

        const handleKeyDown = (e) => {
            // Only trigger if not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') {
                setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
            } else if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') {
                setCurrentStep(prev => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [totalSteps, chatSequence]);

    const toggleThoughts = (turnId) => {
        setExpandedThoughts(prev => ({
            ...prev,
            [turnId]: !prev[turnId]
        }));
    };

    if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Loading simulation...</div>;
    if (!chatSequence) return <div className="flex items-center justify-center h-full text-red-400">Error loading data</div>;

    // Slice data for presentation
    const visibleTurns = chatSequence.chat_sequence.slice(0, currentStep + 1);

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-md sticky top-0 z-10">
                {/* Left: Session Info */}
                <div className="flex flex-col z-20">
                    <h2 className="text-lg font-semibold text-slate-700">Asker Agent</h2>
                    <p className="text-xs text-purple-600 font-mono">Session: {chatSequence.meta.session_name}</p>
                </div>

                {/* Center: Glorious Turn Indicator */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-full max-w-lg pointer-events-none">
                    <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl px-8 py-3 rounded-3xl border border-white/60 shadow-xl shadow-purple-500/10 transition-all duration-300">
                        {/* Eyebrow: Turn Counter */}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                            Turn {currentStep + 1} / {totalSteps}
                        </span>

                        {/* Main Title: Turn Name */}
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 drop-shadow-sm text-center leading-tight whitespace-nowrap px-4">
                            {chatSequence?.chat_sequence[currentStep]?.turn_name || `Turn ${currentStep + 1}`}
                        </h1>
                    </div>
                </div>

                {/* Right: Controls Hint */}
                <div className="flex items-center gap-4 z-20">
                    <div className="text-[10px] text-slate-400 font-mono hidden md:block bg-white/30 px-3 py-1 rounded-full border border-white/20">
                        Use <span className="font-bold text-slate-600">A</span> / <span className="font-bold text-slate-600">D</span> to navigate
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                {visibleTurns.map((turn) => (
                    <div key={turn.turn_id} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

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
                                                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-purple-600 transition-colors px-3 py-1.5 rounded-full hover:bg-purple-50 border border-transparent hover:border-purple-100"
                                            >
                                                <Sparkles size={12} />
                                                {expandedThoughts[turn.turn_id] ? 'Hide Details' : 'View Internals'}
                                                {expandedThoughts[turn.turn_id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Internal Thoughts (Enhanced Timeline) */}
                                {expandedThoughts[turn.turn_id] && turn.processing_simulation && (
                                    <InternalThoughtTimeline simulation={turn.processing_simulation} />
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
