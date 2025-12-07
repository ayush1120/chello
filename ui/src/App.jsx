import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AgentVisualizer from './components/AgentVisualizer';
import TemplatesView from './components/TemplatesView';

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'visualizer', 'templates'

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden selection:bg-purple-100 selection:text-purple-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 h-full pl-16 transition-all duration-300 relative">
        {/* Background Gradients - Subtle & Calming */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-200/40 to-blue-200/40 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-rose-200/40 to-orange-100/40 blur-[120px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="relative z-10 h-full">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'templates' && <TemplatesView />}
          {/* Only render visualizer if expressly selected (though currently it's a tab, design might imply it's side-by-side or separate. For now, treating as a tab) */}
          {activeTab === 'visualizer' && <AgentVisualizer />}
        </div>
      </main>
    </div>
  );
}

export default App;
