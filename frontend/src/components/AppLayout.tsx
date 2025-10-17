import { useState } from 'react';
import { Menu } from 'lucide-react';
import TopBar from './TopBar';
import LeftNav from './LeftNav';
import type { User, PersonaType } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [user, setUser] = useState<User>({
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    persona: 'Data Engineer',
  });

  const handlePersonaChange = (persona: PersonaType) => {
    setUser({ ...user, persona });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="flex flex-1 overflow-hidden">
        <LeftNav
          isCollapsed={isNavCollapsed}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} onPersonaChange={handlePersonaChange} />

          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <button
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className="mb-4 p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
