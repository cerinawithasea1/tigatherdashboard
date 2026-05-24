'use client';

import '@/index.css';
import { useState } from 'react';
import { TabBar } from './tab-bar';
import type { Tab } from './tab-bar';
import { HomeTab } from './home-tab';
import { PlaceholderPanel } from './placeholder-panel';
import { TasksTab } from './tasks-tab';
import { LibraryTab } from './library-tab';
import { SessionsTab } from './sessions-tab';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-950">
        <span className="text-lg font-bold tracking-tight text-white">AI Sisters</span>
        <span className="text-xs text-gray-600 font-mono">dashboard</span>
      </header>

      {/* Tab Bar */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <main>
        {activeTab === 'Home'        && <HomeTab />}
        {activeTab === 'Tasks'       && <TasksTab />}
        {activeTab === 'Library'     && <LibraryTab />}
        {activeTab === 'Sessions'    && <SessionsTab />}
        {activeTab === 'Connections' && <PlaceholderPanel name="Connections" />}
      </main>
    </div>
  );
}

export default App;
