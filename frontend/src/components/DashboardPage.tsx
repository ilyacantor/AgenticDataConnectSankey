import AOAStatusCard from './AOAStatusCard';
import AOADetailsModal from './AOADetailsModal';
import AOAFunctionsPanel from './AOAFunctionsPanel';
import DCLGraphContainer from './DCLGraphContainer';
import {
  mockAgentNodes,
  mockDCLStats,
  mockMappingReviews,
  mockSchemaChanges,
} from '../mocks/data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Data Engineer Control Center</h1>
        <p className="text-gray-400">
          Monitor live data connectivity, review intelligent mappings, and track agent performance
        </p>
      </div>

      <AOAStatusCard />
      
      <AOAFunctionsPanel />

      <DCLGraphContainer
        agents={mockAgentNodes}
        stats={mockDCLStats}
        mappings={mockMappingReviews}
        schemaChanges={mockSchemaChanges}
      />

      <AOADetailsModal />
    </div>
  );
}
