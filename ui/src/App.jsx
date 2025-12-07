import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AgentVisualizer from './components/AgentVisualizer';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-16 transition-all duration-300 h-full relative">
        {/* Main Content Area - Transparent to show body gradient */}

        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'visualizer' && <AgentVisualizer />}
      </main>
    </div>
  );
}

export default App;
