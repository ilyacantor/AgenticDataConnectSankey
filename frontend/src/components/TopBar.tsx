import { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import AutonomyModeToggle from './AutonomyModeToggle';
import LegacyToggle from './LegacyToggle';
import type { User, PersonaType } from '../types';

interface TopBarProps {
  user: User;
  onPersonaChange: (persona: PersonaType) => void;
}

export default function TopBar({ user, onPersonaChange }: TopBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNotifications] = useState(true);

  const personas: PersonaType[] = ['Data Engineer', 'RevOps', 'FinOps'];

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 gap-6">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search or type a command..."
            className="w-full bg-gray-800 text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AutonomyModeToggle />
        <LegacyToggle />
      </div>

      <div className="relative">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-left">
            <div className="text-sm font-medium text-gray-200">{user.name}</div>
            <div className="text-xs text-gray-500">{user.persona}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Select Persona
                </div>
                {personas.map((persona) => (
                  <button
                    key={persona}
                    onClick={() => {
                      onPersonaChange(persona);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      user.persona === persona
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {persona}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
