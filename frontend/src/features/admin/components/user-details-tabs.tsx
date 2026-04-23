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
    <div className="px-7 pt-4">
      <div className="inline-flex bg-[#F5F3F0] rounded-xl p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-[#1C1917] font-semibold'
                : 'text-[#A8A29E] hover:text-[#78716C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export type { TabType };
