'use client';

import React, { useState } from 'react';

interface Tab {
  name: string;
  content: React.ReactNode;
}

interface TabComponentProps {
  tabs: Tab[];
  index?: number;
  onChange?: (index: number) => void;
}

const Tab: React.FC<TabComponentProps> = ({ tabs, index = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(index);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="w-full">
      <ul className="flex border-b border-gray-200">
        {tabs.map((tab, idx) => (
          <li
            key={tab.name}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-400'
            }`}
            onClick={() => handleTabClick(idx)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
      <div className="p-4 mt-4 bg-white">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tab;
