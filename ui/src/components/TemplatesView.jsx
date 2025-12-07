import React from 'react';
import { Plus, Heart, Coffee, Brain, Sun, Sparkles } from 'lucide-react';

const TemplateCard = ({ icon: Icon, title, description, color }) => (
    <div className="group relative p-6 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer flex flex-col items-start gap-4 overflow-hidden">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-md`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-700 group-hover:text-purple-700 transition-colors mb-1">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>

        {/* Hover Efx */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-white/0 to-white/40 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
    </div>
);

const AddTemplateCard = () => (
    <div className="group h-full min-h-[180px] p-6 rounded-3xl border-2 border-dashed border-slate-300 hover:border-purple-400 bg-white/20 hover:bg-white/30 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-purple-500">
        <div className="p-4 rounded-full bg-slate-100 group-hover:bg-purple-50 transition-colors">
            <Plus size={24} />
        </div>
        <span className="font-semibold text-sm">Create Custom Template</span>
    </div>
);

const TemplatesView = () => {
    const templates = [
        {
            icon: Brain,
            title: "Self-Reflection & Mindfulness",
            description: "Guided sessions to explore your thoughts and find inner clarity.",
            color: "bg-indigo-400"
        },
        {
            icon: Heart,
            title: "Companionship & Emotional Support",
            description: "A safe space to share feelings and receive empathetic understanding.",
            color: "bg-rose-400"
        },
        {
            icon: Sparkles,
            title: "Mental Health Support",
            description: "Evidence-based tools and conversations for mental well-being.",
            color: "bg-teal-400"
        },
        {
            icon: Sun,
            title: "Work Day Relaxation",
            description: "Quick breaks and breathing exercises to recharge during work.",
            color: "bg-amber-400"
        }
    ];

    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-3xl font-black text-slate-800 mb-2">Explore Templates</h1>
                <p className="text-slate-500 max-w-2xl">
                    Choose a starting point for your conversation or create a custom agent configuration tailored to your needs.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {templates.map((tpl, i) => (
                    <TemplateCard key={i} {...tpl} />
                ))}
                <AddTemplateCard />
            </div>
        </div>
    );
};

export default TemplatesView;
