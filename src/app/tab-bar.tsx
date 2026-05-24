'use client';

import { useState } from 'react';

export type Tab = 'Home' | 'Tasks' | 'Library' | 'Sessions' | 'Connections';

const TABS: Tab[] = ['Home', 'Tasks', 'Library', 'Sessions', 'Connections'];

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="flex border-b border-gray-800 bg-gray-950 px-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={[
            'px-5 py-3 text-sm font-medium transition-colors',
            active === tab
              ? 'border-b-2 border-indigo-400 text-white'
              : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export { TABS };
