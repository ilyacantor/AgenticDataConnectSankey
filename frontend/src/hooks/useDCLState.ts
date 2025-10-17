import { useState, useEffect, useCallback } from 'react';

interface RAGRetrieval {
  source_field: string;
  ontology_entity: string;
  similarity: number;
}

interface RAGContext {
  retrievals: RAGRetrieval[];
  total_mappings: number;
  last_retrieval_count: number;
}

interface GraphNode {
  id: string;
  label: string;
  type: string;
  fields?: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  field_mappings?: any[];
  entity_fields?: string[];
  entity_name?: string;
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface LLMStats {
  calls: number;
  tokens: number;
}

interface PreviewData {
  sources: Record<string, any>;
  ontology: Record<string, any>;
  connectionInfo: any;
}

export interface DCLState {
  events: string[];
  graph: Graph;
  llm: LLMStats;
  preview: PreviewData;
  rag: RAGContext;
  selected_sources: string[];
  selected_agents: string[];
  dev_mode: boolean;
}

interface UseDCLStateReturn {
  state: DCLState | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDCLState(): UseDCLStateReturn {
  const [state, setState] = useState<DCLState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const response = await fetch('/state');
      if (!response.ok) {
        throw new Error(`Failed to fetch state: ${response.statusText}`);
      }
      const data = await response.json();
      setState(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching DCL state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [fetchState]);

  return { state, loading, error, refetch: fetchState };
}
