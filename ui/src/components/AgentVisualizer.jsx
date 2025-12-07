import React from 'react';

const AgentVisualizer = () => {
    // This is a placeholder for the mermaid diagram visualization.
    // In a real implementation, we would use a library like mermaid.js to render the graph provided in the prompt.
    // For now, we will create a CSS-based static representation or mock of the nodes.

    return (
        <div className="h-full flex flex-col bg-transparent">
            <div className="h-16 px-8 flex items-center border-b border-white/20 bg-white/10 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-700">Agent Internals (Live View)</h2>
            </div>

            <div className="flex-1 p-8 overflow-auto flex items-center justify-center relative">
                {/* Background Grid - Darker for visibility on light bg */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10 w-full max-w-5xl h-[600px] border border-white/40 rounded-3xl bg-white/30 backdrop-blur-md p-8 flex flex-col justify-between shadow-lg">

                    {/* Top Layer: Loop Logic */}
                    <div className="flex justify-center gap-8 mb-8">
                        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-50/50 backdrop-blur-md shadow-sm">
                            <h3 className="text-rose-600 font-mono text-sm mb-2">Loop Logic</h3>
                            <div className="flex gap-4">
                                {['Check Enquiry', 'Check Understanding', 'Check Feedback'].map((step, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-rose-100 border border-rose-200 text-xs text-rose-700">
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Layer: Agents */}
                    <div className="flex justify-center items-center gap-12">
                        {/* Clarifier */}
                        <div className="w-40 h-40 rounded-2xl border border-rose-200 bg-white/80 flex flex-col items-center justify-center shadow-md shadow-rose-200/50">
                            <span className="text-rose-500 font-bold mb-1">Clarifier</span>
                            <span className="text-[10px] text-slate-500 text-center px-2">Processing & Options</span>
                        </div>

                        {/* Asker (Central) */}
                        <div className="w-48 h-48 rounded-full border-2 border-purple-400 bg-white flex flex-col items-center justify-center shadow-xl shadow-purple-500/20 relative">
                            <div className="absolute -inset-2 rounded-full border border-purple-400/30 animate-pulse"></div>
                            <span className="text-purple-600 font-bold text-lg mb-1">Asker Agent</span>
                            <span className="text-xs text-slate-500 text-center px-4">Calms • Enquires • Relays</span>
                        </div>

                        {/* Web Surfer */}
                        <div className="w-40 h-40 rounded-2xl border border-rose-200 bg-white/80 flex flex-col items-center justify-center shadow-md shadow-rose-200/50">
                            <span className="text-rose-500 font-bold mb-1">Web Surfer</span>
                            <span className="text-[10px] text-slate-500 text-center px-2">Internal Research</span>
                        </div>
                    </div>

                    {/* Bottom Layer: Context */}
                    <div className="mt-8 grid grid-cols-2 gap-8">
                        <div className="h-32 rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4 flex items-center justify-center flex-col shadow-sm">
                            <span className="text-purple-600 font-bold">CHAT CONTEXT</span>
                            <span className="text-xs text-purple-400">Conversation History</span>
                        </div>
                        <div className="h-32 rounded-xl border-2 border-cyan-200 bg-cyan-50/50 p-4 flex items-center justify-center flex-col shadow-sm">
                            <span className="text-cyan-600 font-bold">INTERNAL CONTEXT</span>
                            <span className="text-xs text-cyan-400">Facts & Research</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AgentVisualizer;
