import { LayoutDashboard, GitBranch, Cable, Bot, Network, Settings } from 'lucide-react';
import autonomosLogo from '../assets/autonomos-logo.png';

interface LeftNavProps {
  isCollapsed: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
  tooltip?: string;
}

export default function LeftNav({ isCollapsed, currentPage, onNavigate }: LeftNavProps) {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'lineage', label: 'Data Lineage', icon: <GitBranch className="w-5 h-5" /> },
    { id: 'connections', label: 'Connections', icon: <Cable className="w-5 h-5" /> },
    { id: 'xao', label: 'xAO', icon: <Bot className="w-5 h-5" />, tooltip: 'Cross-Agentic Orchestration (xAO) coordinates multiple autonomOS instances across federated domains.' },
    { id: 'ontology', label: 'Ontology', icon: <Network className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-18' : 'w-60'
      } bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}
    >
      <div className="h-16 flex items-center border-b border-gray-800 px-3">
        {isCollapsed ? (
          <img src={autonomosLogo} alt="autonomOS" className="h-[42px] object-contain mx-auto" />
        ) : (
          <img src={autonomosLogo} alt="autonomOS" className="h-[42px] object-contain -ml-3" />
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={item.tooltip}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            } ${item.highlight && currentPage !== item.id ? 'ring-1 ring-blue-500/30' : ''}`}
          >
            <span className={isCollapsed ? 'mx-auto' : ''}>{item.icon}</span>
            {!isCollapsed && <span className="font-medium text-left">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
