type TabType = 'overview' | 'cvs' | 'applications';

interface UserDetailsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cvsCount: number;
  applicationsCount: number;
}

export const UserDetailsTabs = ({ activeTab, onTabChange, cvsCount, applicationsCount }: UserDetailsTabsProps) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'cvs', label: `CVs (${cvsCount})` },
    { id: 'applications', label: `Applications (${applicationsCount})` }
  ];

  return (
    <div className="flex border-b overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </button>
      ))}
    </div>
  );
};

export type { TabType };
