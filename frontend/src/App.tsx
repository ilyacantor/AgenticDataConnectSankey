import { useState } from 'react';
import { AutonomyProvider, useAutonomy } from './contexts/AutonomyContext';
import AppLayout from './components/AppLayout';
import DashboardPage from './components/DashboardPage';
import DataLineagePage from './components/DataLineagePage';
import ConnectionsPage from './components/ConnectionsPage';
import LegacyDCLUI from './components/LegacyDCLUI';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { legacyMode } = useAutonomy();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'lineage':
        return <DataLineagePage />;
      case 'connections':
        return <ConnectionsPage />;
      case 'agents':
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Agents</h1>
            <p className="text-gray-400">Agent management interface coming soon</p>
          </div>
        );
      case 'ontology':
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Ontology</h1>
            <p className="text-gray-400">Ontology explorer coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
            <p className="text-gray-400">Platform settings coming soon</p>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  // If legacy mode is enabled, show the legacy UI
  if (legacyMode) {
    return <LegacyDCLUI />;
  }

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AppLayout>
  );
}

function App() {
  return (
    <AutonomyProvider>
      <AppContent />
    </AutonomyProvider>
  );
}

export default App;
