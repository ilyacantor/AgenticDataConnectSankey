import AOAStatusCard from './AOAStatusCard';
import AOADetailsModal from './AOADetailsModal';
import DCLGraphContainer from './DCLGraphContainer';
import IntelligenceReviewPanel from './IntelligenceReviewPanel';
import AgentPerformanceMonitor from './AgentPerformanceMonitor';
import {
  mockAgentNodes,
  mockDCLStats,
  mockMappingReviews,
  mockSchemaChanges,
  mockAgentPerformance,
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

      <div className="grid grid-cols-[1fr_420px] gap-6">
        <div>
          <DCLGraphContainer
            agents={mockAgentNodes}
            stats={mockDCLStats}
          />
        </div>

        <div className="space-y-6">
          <div className="h-[600px]">
            <IntelligenceReviewPanel
              mappings={mockMappingReviews}
              schemaChanges={mockSchemaChanges}
            />
          </div>
          <div className="h-[400px]">
            <AgentPerformanceMonitor agents={mockAgentPerformance} />
          </div>
        </div>
      </div>

      <AOADetailsModal />
    </div>
  );
}
