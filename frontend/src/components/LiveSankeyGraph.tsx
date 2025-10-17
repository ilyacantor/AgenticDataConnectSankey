import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

interface SankeyNode {
  name: string;
  type: string;
  id: string;
  sourceSystem?: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  sourceSystem?: string;
  targetType?: string;
  fieldMappings?: any[];
  edgeLabel?: string;
  entityFields?: string[];
  entityName?: string;
  tableFields?: string[];
}

interface GraphState {
  graph: {
    nodes: Array<{ id: string; label: string; type: string; fields?: string[] }>;
    edges: Array<{
      source: string;
      target: string;
      label?: string;
      field_mappings?: any[];
      entity_fields?: string[];
      entity_name?: string;
    }>;
  };
  dev_mode: boolean;
}

export default function LiveSankeyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<GraphState | null>(null);
  const [animatingEdges, setAnimatingEdges] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch('/state');
        const data = await response.json();
        setState(data);
      } catch (error) {
        console.error('Error fetching state:', error);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!state || !svgRef.current || !containerRef.current) return;
    if (!state.graph || !state.graph.nodes || state.graph.nodes.length === 0) return;

    renderSankey(state, svgRef.current, containerRef.current, animatingEdges);
  }, [state, animatingEdges]);

  const triggerEdgeAnimation = (edgeKey: string) => {
    setAnimatingEdges(prev => new Set(prev).add(edgeKey));
    setTimeout(() => {
      setAnimatingEdges(prev => {
        const next = new Set(prev);
        next.delete(edgeKey);
        return next;
      });
    }, 2000);
  };

  useEffect(() => {
    const handleEvent = (event: CustomEvent) => {
      const { type, sourceId, targetId } = event.detail;
      if (type === 'new_source' || type === 'source_removed' || type === 'fault' || type === 'schema_drift') {
        triggerEdgeAnimation(`${sourceId}-${targetId}`);
      }
    };

    window.addEventListener('dcl-graph-event' as any, handleEvent);
    return () => window.removeEventListener('dcl-graph-event' as any, handleEvent);
  }, []);

  return (
    <div ref={containerRef} className="rounded-xl bg-gray-800/40 border border-gray-700 shadow-sm ring-1 ring-cyan-500/10 p-3 h-full">
      <div className="relative w-full h-full mx-auto" style={{ minHeight: '500px' }}>
        <div className="absolute top-2 left-2 z-10">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Live DCL Connectivity Graph
          </span>
        </div>

        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        />

        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">
            Data Sources → Tables → Unified Ontology → Agents
          </p>
        </div>
      </div>
    </div>
  );
}

function renderSankey(
  state: GraphState,
  svgElement: SVGSVGElement,
  container: HTMLDivElement,
  animatingEdges: Set<string>
) {
  const svg = d3.select(svgElement);
  svg.selectAll('*').remove();

  if (!state.graph || !state.graph.nodes || state.graph.nodes.length === 0) {
    svg
      .append('text')
      .attr('x', '50%')
      .attr('y', '50%')
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '14px')
      .text('No data available. Click "Connect & Map" to start.');
    return;
  }

  const sankeyNodes: SankeyNode[] = [];
  const sankeyLinks: SankeyLink[] = [];
  const nodeIndexMap: Record<string, number> = {};
  let nodeIndex = 0;

  const sourceGroups: Record<string, any[]> = {};
  const ontologyNodes: any[] = [];
  const otherNodes: any[] = [];

  state.graph.nodes.forEach(n => {
    if (n.type === 'source') {
      const match = n.id.match(/^src_([^_]+)_(.+)$/);
      if (match) {
        const sourceSystem = match[1];
        const tableName = match[2];
        if (!sourceGroups[sourceSystem]) {
          sourceGroups[sourceSystem] = [];
        }
        sourceGroups[sourceSystem].push({
          id: n.id,
          label: n.label,
          tableName: tableName,
          type: n.type,
        });
      }
    } else if (n.type === 'ontology') {
      ontologyNodes.push(n);
    } else {
      otherNodes.push(n);
    }
  });

  // EXACT LEGACY FILTERING LOGIC: First pass - identify which ontology entities are consumed by agents
  const consumedOntologyIds = new Set<string>();
  state.graph.edges.forEach(e => {
    const sourceType = state.graph.nodes.find(n => n.id === e.source)?.type;
    const targetType = state.graph.nodes.find(n => n.id === e.target)?.type;
    
    // If edge is from ontology to agent, mark the ontology entity as consumed
    if (sourceType === 'ontology' && targetType === 'agent') {
      consumedOntologyIds.add(e.source);
    }
  });

  // Second pass - identify which source nodes have edges to consumed ontology entities
  const usefulSourceIds = new Set<string>();
  state.graph.edges.forEach(e => {
    const sourceType = state.graph.nodes.find(n => n.id === e.source)?.type;
    const targetType = state.graph.nodes.find(n => n.id === e.target)?.type;
    
    // If edge is from source to consumed ontology, mark the source as useful
    if (sourceType === 'source' && targetType === 'ontology' && consumedOntologyIds.has(e.target)) {
      usefulSourceIds.add(e.source);
    }
  });

  // Only add source nodes that have useful mappings (LEGACY LOGIC)
  Object.keys(sourceGroups).forEach(sourceSystem => {
    // Filter to only include tables that have useful mappings
    const usefulTables = sourceGroups[sourceSystem].filter(table => usefulSourceIds.has(table.id));

    // Only add parent node if there are useful tables
    if (usefulTables.length > 0) {
      const parentNodeName = sourceSystem.replace(/_/g, ' ').toLowerCase();
      const parentNodeId = `parent_${sourceSystem}`;
      nodeIndexMap[parentNodeId] = nodeIndex;
      sankeyNodes.push({
        name: parentNodeName,
        type: 'source_parent',
        id: parentNodeId,
        sourceSystem: sourceSystem,
      });
      nodeIndex++;

      usefulTables.forEach(table => {
        nodeIndexMap[table.id] = nodeIndex;
        const sourceNode = state.graph.nodes.find(n => n.id === table.id);
        sankeyNodes.push({
          name: table.tableName.toLowerCase(),
          type: 'source',
          id: table.id,
          sourceSystem: sourceSystem,
        });
        sankeyLinks.push({
          source: nodeIndexMap[parentNodeId],
          target: nodeIndexMap[table.id],
          value: 1,
          sourceSystem: sourceSystem,
          tableFields: sourceNode?.fields || [],
        });
        nodeIndex++;
      });
    }
  });

  // Only add ontology nodes that are consumed by agents (LEGACY LOGIC)
  ontologyNodes.forEach(n => {
    if (consumedOntologyIds.has(n.id)) {
      nodeIndexMap[n.id] = nodeIndex;
      sankeyNodes.push({ name: n.label, type: n.type, id: n.id });
      nodeIndex++;
    }
  });

  otherNodes.forEach(n => {
    nodeIndexMap[n.id] = nodeIndex;
    sankeyNodes.push({ name: n.label, type: n.type, id: n.id });
    nodeIndex++;
  });

  // Create links from state.graph.edges, filtering out unconsumed paths (LEGACY LOGIC)
  state.graph.edges.forEach(e => {
    const sourceType = state.graph.nodes.find(n => n.id === e.source)?.type;
    const targetType = state.graph.nodes.find(n => n.id === e.target)?.type;

    // Skip source-to-source edges
    if (sourceType === 'source' && targetType === 'source') {
      return;
    }

    // Skip source→ontology edges if the ontology entity isn't consumed by any agent
    if (sourceType === 'source' && targetType === 'ontology' && !consumedOntologyIds.has(e.target)) {
      return;
    }

    // Skip ontology→agent edges if the ontology entity isn't consumed
    if (sourceType === 'ontology' && targetType === 'agent' && !consumedOntologyIds.has(e.source)) {
      return;
    }

    // Create the link if both nodes exist in the Sankey
    if (nodeIndexMap[e.source] !== undefined && nodeIndexMap[e.target] !== undefined) {
      const sourceNode = state.graph.nodes.find(n => n.id === e.source);
      let linkSourceSystem = null;

      if (sourceNode?.type === 'source') {
        const match = sourceNode.id.match(/^src_([^_]+)_(.+)$/);
        if (match) {
          linkSourceSystem = match[1];
        }
      }

      sankeyLinks.push({
        source: nodeIndexMap[e.source],
        target: nodeIndexMap[e.target],
        value: 1,
        sourceSystem: linkSourceSystem || undefined,
        targetType: targetType,
        fieldMappings: e.field_mappings || [],
        edgeLabel: e.label || '',
        entityFields: e.entity_fields || [],
        entityName: e.entity_name || '',
      });
    }
  });

  const containerRect = container.getBoundingClientRect();
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

  const responsiveHeight = isMobile ? 400 : isTablet ? 500 : 600;

  svg
    .attr('width', '100%')
    .attr('height', responsiveHeight + 'px')
    .attr('viewBox', `0 0 ${Math.max(containerRect.width, 320)} ${responsiveHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const { width, height } = (svg.node() as SVGSVGElement).getBoundingClientRect();

  const validWidth = width > 0 ? Math.max(width, 320) : 800;
  const validHeight = height > 0 ? height : responsiveHeight;

  const sankey = d3Sankey<SankeyNode, SankeyLink>()
    .nodeWidth(2)
    .nodePadding(18)
    .extent([
      [1, 40],
      [validWidth - 1, validHeight - 6],
    ]);

  const graph = sankey({
    nodes: sankeyNodes.map(d => Object.assign({}, d)),
    links: sankeyLinks.map(d => Object.assign({}, d)),
  });

  const { nodes, links } = graph;

  // EXACT LEGACY POSITIONING LOGIC: Distribute ontology nodes evenly across vertical space
  const ontologyNodesInSankey = nodes.filter(n => {
    const nodeData = sankeyNodes.find(sn => sn.name === n.name);
    return nodeData && nodeData.type === 'ontology';
  });
  
  if (ontologyNodesInSankey.length > 1) {
    const totalOntologyHeight = ontologyNodesInSankey.reduce((sum, n) => sum + (n.y1! - n.y0!), 0);
    const availableSpace = validHeight - totalOntologyHeight - 80; // Leave margin
    const spacing = availableSpace / (ontologyNodesInSankey.length - 1);
    
    let currentY = 40; // Start with top margin
    ontologyNodesInSankey.forEach(node => {
      const nodeHeight = node.y1! - node.y0!;
      node.y0 = currentY;
      node.y1 = currentY + nodeHeight;
      currentY += nodeHeight + spacing;
    });
    
    sankey.update(graph);
  }

  // EXACT LEGACY POSITIONING LOGIC: Manually center agent nodes vertically
  const agentNodesInSankey = nodes.filter(n => {
    const nodeData = sankeyNodes.find(sn => sn.name === n.name);
    return nodeData && nodeData.type === 'agent';
  });
  
  if (agentNodesInSankey.length > 0) {
    // Calculate total height of all agent nodes including padding
    const totalAgentHeight = agentNodesInSankey.reduce((sum, n) => sum + (n.y1! - n.y0!), 0);
    const totalPadding = (agentNodesInSankey.length - 1) * 2; // 2px padding between agents
    const centerY = (validHeight - totalAgentHeight - totalPadding) / 2;
    
    // Reposition agents to be centered
    let currentY = centerY;
    agentNodesInSankey.forEach(node => {
      const nodeHeight = node.y1! - node.y0!;
      node.y0 = currentY;
      node.y1 = currentY + nodeHeight;
      currentY += nodeHeight + 2; // 2px padding
    });
    
    // Update the sankey link generator to use the new positions
    sankey.update(graph);
  }

  const sourceColorMap: Record<string, { parent: string; child: string }> = {
    dynamics: { parent: '#3b82f6', child: '#60a5fa' },
    salesforce: { parent: '#8b5cf6', child: '#a78bfa' },
    sap: { parent: '#10b981', child: '#34d399' },
    netsuite: { parent: '#f59e0b', child: '#fbbf24' },
    legacy_sql: { parent: '#ef4444', child: '#f87171' },
    snowflake: { parent: '#06b6d4', child: '#22d3ee' },
    supabase: { parent: '#14b8a6', child: '#2dd4bf' },
    mongodb: { parent: '#10b981', child: '#34d399' },
  };

  svg
    .append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', (d: any, i: number) => {
      const originalLink = sankeyLinks[i];
      const targetNode = sankeyNodes.find(n => n.name === d.target.name);
      if (targetNode && targetNode.type === 'agent') {
        return '#9333ea';
      }
      if (originalLink && originalLink.sourceSystem) {
        return sourceColorMap[originalLink.sourceSystem]?.child || '#0bcad9';
      }
      return '#64748b';
    })
    .attr('stroke-width', (d: any) => Math.min(Math.max(0.5, d.width * 0.5), 20))
    .attr('stroke-opacity', (_d: any, i: number) => {
      const originalLink = sankeyLinks[i];
      const sourceNode = state.graph.nodes.find(n => nodeIndexMap[n.id] === originalLink.source);
      const targetNode = state.graph.nodes.find(n => nodeIndexMap[n.id] === originalLink.target);
      const edgeKey = `${sourceNode?.id}-${targetNode?.id}`;
      return animatingEdges.has(edgeKey) ? 0.9 : 0.3;
    })
    .attr('class', (_d: any, i: number) => {
      const originalLink = sankeyLinks[i];
      const sourceNode = state.graph.nodes.find(n => nodeIndexMap[n.id] === originalLink.source);
      const targetNode = state.graph.nodes.find(n => nodeIndexMap[n.id] === originalLink.target);
      const edgeKey = `${sourceNode?.id}-${targetNode?.id}`;
      return animatingEdges.has(edgeKey) ? 'animate-pulse' : '';
    })
    .style('cursor', 'pointer')
    .on('mouseenter', function(event: MouseEvent, d: any) {
      d3.select(this).attr('stroke-opacity', 0.7);
      
      const linkIndex = links.indexOf(d);
      const originalLink = sankeyLinks[linkIndex];
      const sourceNodeData = sankeyNodes.find(n => n.name === d.source.name);
      const targetNodeData = sankeyNodes.find(n => n.name === d.target.name);
      
      const tooltipContent = getEdgeTooltip(sourceNodeData, targetNodeData, originalLink);
      
      const edgeTooltip = d3.select('body')
        .selectAll('.sankey-edge-tooltip')
        .data([null])
        .join('div')
        .attr('class', 'sankey-edge-tooltip')
        .style('position', 'fixed')
        .style('background', 'rgba(15, 23, 42, 0.95)')
        .style('color', '#e2e8f0')
        .style('padding', '8px 12px')
        .style('border-radius', '6px')
        .style('border', '1px solid #475569')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', 10000)
        .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)')
        .style('max-width', '400px')
        .style('font-family', 'system-ui, -apple-system, sans-serif');
      
      edgeTooltip
        .html(tooltipContent)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .style('opacity', 1);
    })
    .on('mousemove', function(event: MouseEvent) {
      d3.select('.sankey-edge-tooltip')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseleave', function() {
      d3.select(this).attr('stroke-opacity', 0.3);
      d3.select('.sankey-edge-tooltip').style('opacity', 0);
    });

  const nodeGroups = svg.append('g').selectAll('g').data(nodes).join('g');

  // Create tooltip element
  const tooltip = d3.select('body')
    .selectAll('.sankey-tooltip')
    .data([null])
    .join('div')
    .attr('class', 'sankey-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(15, 23, 42, 0.95)')
    .style('color', '#e2e8f0')
    .style('padding', '8px 12px')
    .style('border-radius', '6px')
    .style('border', '1px solid #475569')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', 1000)
    .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');

  nodeGroups
    .append('rect')
    .attr('x', (d: any) => {
      const connectedLinks = links.filter((l: any) => l.source === d || l.target === d);
      const maxEdgeWidth =
        connectedLinks.length > 0
          ? Math.max(...connectedLinks.map((l: any) => Math.min(Math.max(0.5, l.width * 0.5), 20)))
          : 0.5;
      const nodeWidth = maxEdgeWidth + 1;
      return d.x0 + (d.x1 - d.x0) / 2 - nodeWidth / 2;
    })
    .attr('y', (d: any) => d.y0)
    .attr('height', (d: any) => d.y1 - d.y0)
    .attr('width', (d: any) => {
      const connectedLinks = links.filter((l: any) => l.source === d || l.target === d);
      const maxEdgeWidth =
        connectedLinks.length > 0
          ? Math.max(...connectedLinks.map((l: any) => Math.min(Math.max(0.5, l.width * 0.5), 20)))
          : 0.5;
      return maxEdgeWidth + 1;
    })
    .attr('fill', (d: any) => {
      const nodeData = sankeyNodes.find(n => n.name === d.name);
      if (!nodeData) return '#64748b';
      
      if (nodeData.type === 'source_parent' && nodeData.sourceSystem) {
        return sourceColorMap[nodeData.sourceSystem]?.parent || '#1e40af';
      } else if (nodeData.type === 'source' && nodeData.sourceSystem) {
        return sourceColorMap[nodeData.sourceSystem]?.child || '#2563eb';
      } else if (nodeData.type === 'ontology') {
        return '#16a34a';
      } else if (nodeData.type === 'agent') {
        return '#9333ea';
      }
      return '#64748b';
    })
    .attr('fill-opacity', 0.7)
    .style('cursor', 'pointer')
    .on('mouseenter', function(event: MouseEvent, d: any) {
      const nodeData = sankeyNodes.find(n => n.name === d.name);
      if (!nodeData) return;
      
      d3.select(this).attr('fill-opacity', 1);
      
      let tooltipContent = `<strong>${d.name}</strong><br/>`;
      tooltipContent += `Type: ${nodeData.type}`;
      
      if (nodeData.type === 'source' || nodeData.type === 'source_parent') {
        tooltipContent += `<br/>System: ${nodeData.sourceSystem || 'Unknown'}`;
      }
      
      tooltip
        .html(tooltipContent)
        .style('opacity', 1)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mousemove', function(event: MouseEvent) {
      tooltip
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseleave', function() {
      d3.select(this).attr('fill-opacity', 0.7);
      tooltip.style('opacity', 0);
    })
    .on('click', async function(_event: MouseEvent, d: any) {
      const nodeData = sankeyNodes.find(n => n.name === d.name);
      if (!nodeData) return;
      
      try {
        const response = await fetch(`/preview?node=${nodeData.id}`);
        const data = await response.json();
        console.log('Preview data for', nodeData.id, ':', data);
        
        // Dispatch custom event with preview data
        window.dispatchEvent(new CustomEvent('sankey-node-click', { 
          detail: { node: nodeData, preview: data } 
        }));
      } catch (error) {
        console.error('Error fetching preview:', error);
      }
    });

  nodeGroups.each(function (this: any, d: any) {
    const nodeData = sankeyNodes.find(n => n.name === d.name);
    const isLeft = d.x0 < validWidth / 2;
    const group = d3.select(this);

    const connectedLinks = links.filter((l: any) => l.source === d || l.target === d);
    const maxEdgeWidth =
      connectedLinks.length > 0
        ? Math.max(...connectedLinks.map((l: any) => Math.min(Math.max(0.5, l.width * 0.5), 20)))
        : 0.5;
    const nodeWidth = maxEdgeWidth + 1;

    const nodeCenterX = d.x0 + (d.x1 - d.x0) / 2;
    const adjustedX0 = nodeCenterX - nodeWidth / 2;
    const adjustedX1 = nodeCenterX + nodeWidth / 2;

    const textX = isLeft ? adjustedX1 + 6 : adjustedX0 - 6;
    const textY = (d.y1 + d.y0) / 2;
    const padding = 4;

    const text = group
      .append('text')
      .attr('x', textX)
      .attr('y', textY)
      .attr('dy', '0.35em')
      .attr('text-anchor', isLeft ? 'start' : 'end')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .text(d.name);

    const bbox = (text.node() as SVGTextElement).getBBox();

    group
      .insert('rect', 'text')
      .attr('x', bbox.x - padding)
      .attr('y', bbox.y - padding)
      .attr('width', bbox.width + padding * 2)
      .attr('height', bbox.height + padding * 2)
      .attr('fill', 'rgba(15, 23, 42, 0.9)')
      .attr('stroke', nodeData?.type === 'agent' ? '#9333ea' : '#475569')
      .attr('stroke-width', 1)
      .attr('rx', 4);
  });

  function getEdgeTooltip(sourceNodeData: SankeyNode | undefined, targetNodeData: SankeyNode | undefined, linkData: SankeyLink): string {
    if (!sourceNodeData || !targetNodeData) return 'Data Flow';
    
    const sourceName = sourceNodeData.name || 'Unknown';
    const targetName = targetNodeData.name || 'Unknown';
    
    let flowDescription = '';
    if (sourceNodeData.type === 'source_parent' && targetNodeData.type === 'source') {
      flowDescription = 'System to table connection';
    } else if (sourceNodeData.type === 'source' && targetNodeData.type === 'ontology') {
      flowDescription = 'Raw data mapped to unified schema';
    } else if (sourceNodeData.type === 'ontology' && targetNodeData.type === 'agent') {
      flowDescription = 'Ontology field consumed by agent';
    } else {
      flowDescription = 'Data flow';
    }
    
    let tooltip = `
      <strong>Data Flow</strong><br>
      <span style="color: #94a3b8; font-size: 10px;">${flowDescription}</span><br>
      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #475569;">
        <span style="color: #60a5fa;">From:</span> ${sourceName}<br>
        <span style="color: #34d399;">To:</span> ${targetName}
      </div>
    `;
    
    if (sourceNodeData.type === 'source_parent' && targetNodeData.type === 'source' && linkData?.tableFields?.length) {
      tooltip += `
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #475569;">
          <strong style="color: #a78bfa; font-size: 10px;">Table Fields:</strong><br>
          <div style="max-height: 120px; overflow-y: auto; margin-top: 4px;">
      `;
      linkData.tableFields.forEach(field => {
        tooltip += `
          <div style="font-size: 10px; margin: 2px 0; color: #cbd5e1;">
            <span style="color: #60a5fa;">•</span> ${field}
          </div>
        `;
      });
      tooltip += `</div></div>`;
    }
    
    if (linkData?.fieldMappings?.length) {
      tooltip += `
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #475569;">
          <strong style="color: #a78bfa; font-size: 10px;">Field Mappings:</strong><br>
          <div style="max-height: 120px; overflow-y: auto; margin-top: 4px;">
      `;
      linkData.fieldMappings.forEach((field: any) => {
        const sourceField = field.source || 'N/A';
        const ontoField = field.onto_field || 'N/A';
        const confidence = field.confidence ? `(${Math.round(field.confidence * 100)}%)` : '';
        tooltip += `
          <div style="font-size: 10px; margin: 2px 0; color: #cbd5e1;">
            <span style="color: #60a5fa;">${sourceField}</span> → <span style="color: #34d399;">${ontoField}</span> <span style="color: #94a3b8;">${confidence}</span>
          </div>
        `;
      });
      tooltip += `</div></div>`;
    }
    
    if (sourceNodeData.type === 'ontology' && targetNodeData.type === 'agent' && linkData?.entityFields?.length) {
      const entityName = linkData.entityName || 'entity';
      tooltip += `
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #475569;">
          <strong style="color: #a78bfa; font-size: 10px;">Unified ${entityName.replace('_', ' ').toUpperCase()} Fields:</strong><br>
          <div style="max-height: 120px; overflow-y: auto; margin-top: 4px;">
      `;
      linkData.entityFields.forEach(field => {
        tooltip += `
          <div style="font-size: 10px; margin: 2px 0; color: #cbd5e1;">
            <span style="color: #34d399;">•</span> ${field}
          </div>
        `;
      });
      tooltip += `</div></div>`;
    }
    
    return tooltip;
  }
}
