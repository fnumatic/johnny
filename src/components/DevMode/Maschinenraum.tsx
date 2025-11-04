import { Button } from "@/components/ui/button";
import { useStore } from '../../store/useStore';
import { X, TestTube, BarChart3, Bug, Info } from 'lucide-react';
import { useState } from 'react';
import { TestProgramsTab } from './tabs/TestProgramsTab';
import { StatisticsTab } from './tabs/StatisticsTab';
import { DebugToolsTab } from './tabs/DebugToolsTab';
import { SystemInfoTab } from './tabs/SystemInfoTab';

type TabType = 'test-programs' | 'statistics' | 'debug-tools' | 'system-info';

export function Maschinenraum() {
  const showMaschinenraum = useStore(state => state.showMaschinenraum);
  const toggleMaschinenraum = useStore(state => state.toggleMaschinenraum);
  
  const [activeTab, setActiveTab] = useState<TabType>('test-programs');

  if (!showMaschinenraum) {
    return null;
  }

  const tabs = [
    { id: 'test-programs' as TabType, label: 'Test Programs', icon: TestTube },
    { id: 'statistics' as TabType, label: 'Statistics', icon: BarChart3 },
    { id: 'debug-tools' as TabType, label: 'Debug Tools', icon: Bug },
    { id: 'system-info' as TabType, label: 'System Info', icon: Info },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'test-programs':
        return <TestProgramsTab />;
      case 'statistics':
        return <StatisticsTab />;
      case 'debug-tools':
        return <DebugToolsTab />;
      case 'system-info':
        return <SystemInfoTab />;
      default:
        return null;
    }
  };

  return (
    <section aria-label="Maschinenraum" className="fixed right-0 top-0 h-full w-96 bg-slate-800 border-l border-slate-700 z-40 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right" data-testid="dev-mode">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Maschinenraum</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMaschinenraum}
          className="text-gray-400 hover:text-white"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`${tab.id}-tab`}
              className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </section>
  );
}
