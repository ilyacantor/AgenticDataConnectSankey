# Agentic Data Connection Layer (DCL)

## Overview
The Agentic Data Connection Layer (DCL) is an intelligent system designed to autonomously discover and map data sources from various enterprise systems to a predefined ontology using AI. It validates these mappings through quality checks and automatically publishes them as DuckDB views. The system features a real-time web dashboard with interactive data flow graphs and AI-powered schema inference.

The DCL operates as a multi-agent architecture, dynamically adapting based on selected data sources (e.g., Dynamics, Salesforce, SAP, NetSuite, Snowflake, Legacy SQL) and domain-specific agents (e.g., RevOps Pilot, FinOps Pilot). It automatically maps source fields to a unified ontology, filters ontology fields based on active agents, and visualizes complete or truncated data flows depending on data availability for selected agents.

The project aims to provide a dynamic data connection layer, aligning diverse data sources to unified ontologies for consumption by specialized AI agents, thereby streamlining data integration and analytical processes within an enterprise.

## User Preferences
- **AI Provider**: Gemini API (GEMINI_API_KEY environment variable)
- **Model**: `gemini-2.5-pro` (not `gemini-pro` which is retired)
- **Design Constraint**: Preserve existing GUI, add new features as separate sections

## Recent Changes (October 17, 2025)
- **Modern UI Integration**: Successfully integrated all legacy DCL functionality into Bolt v2 UI
  - Connections Page: Now displays actual data sources (Dynamics, Salesforce, SAP, NetSuite, Snowflake, Supabase, MongoDB, Legacy SQL, HubSpot)
  - xAO Navigation: Simplified label to "xAO" (left-aligned) for cleaner UI
  - xAO Page: Removed AOA Functions and Live Plans tabs, streamlined to show only xAO Metrics
  - AOA Status Card: Removed "View Details" button for cleaner interface
- **Top Bar Updates**:
  - **Autonomy Mode Toggle**: Restored to top bar with all modes (Observe, Recommend, Approve-to-Act, Auto (Guardrails), Federated (xAO))
  - **Legacy/Modern UI Toggle**: Restored to top bar for switching between modern Bolt v2 UI and legacy static DCL UI
- **Dashboard Components**:
  - **Active Agent Performance Monitor**: Fully restored showing agent status, executions/hr, CPU, and memory usage
- **DCL Graph Container Updates**:
  - Removed Agent Consumers column (simplified from 3-column to 2-column layout)
  - **Prod Mode Toggle**: Located in Intelligence Engine box (default: OFF)
    - **Prod Mode ON (dev_mode=true)**: Uses AI/RAG for intelligent semantic validation via Gemini API + Pinecone
    - **Prod Mode OFF (dev_mode=false)**: Uses fast deterministic domain-based heuristic filtering
    - Calls existing `/toggle_dev_mode` endpoint (legacy-compatible)
  - **Actions Dropdown**: Next to Prod Mode toggle
    - **Run**: Connects all 9 data sources to all 2 agents using current Prod Mode state via `/connect` endpoint
    - **Reset**: Clears all mappings via `/reset` endpoint
    - Default selections: ALL sources (dynamics, salesforce, hubspot, sap, netsuite, legacy_sql, snowflake, supabase, mongodb) → ALL agents (revops_pilot, finops_pilot)
  - **Intelligence Review Panel**: Full functionality restored
    - "Review" button on each mapping item
    - Detailed review modal showing source data snippet, proposed unified mapping, confidence score, and LLM reasoning
    - Action buttons: Approve, Edit Mapping, Ignore & Flag
    - Schema Log tab showing schema changes with change type indicators
  - **RAG Learning Engine**: EXACT legacy layout displaying source_field, similarity%, ontology_entity, and context directly from backend /state
  - Integrated Narration scroll box with typing animation for real-time event display
- **Sankey Graph Enhancements**:
  - **EXACT LEGACY FILTERING**: Modern UI now uses identical filtering logic as legacy view
    - Only shows ontology nodes consumed by agents
    - Only shows source tables that map to consumed ontologies
    - Filters out edges that don't lead to agents (no orphaned edges like NetSuite)
  - Improved bounding box constraints to prevent visual bleeding
  - Responsive sizing (400px mobile, 500px tablet, 600px desktop)
  - Node hover tooltips showing node type, system, and details
  - Node click handlers to fetch and display preview data
  - **Edge hover tooltips** showing detailed field mappings (matching legacy UI):
    - Table Fields for system→table connections
    - Field Mappings for table→ontology connections (source field → ontology field with confidence)
    - Entity Fields for ontology→agent connections
- **State Management**: Created useDCLState hook for centralized /state API polling (5-second intervals)
- **Bug Fixes**: Fixed Run All mode reversal - Production Mode now correctly triggers AI/RAG (dev_mode=true), Heuristic Mode triggers deterministic filtering (dev_mode=false)
- **Build Status**: Clean production build (268.36 kB), zero TypeScript errors, all features fully restored

## System Architecture

### Production Mode (Prod Mode Toggle)
The DCL features a Prod Mode toggle that controls how data mappings are validated:

**Prod Mode ON (Production-Ready):**
- Uses **LLM + RAG** for intelligent semantic validation
- Each mapping is assessed by Gemini AI for domain alignment and business context
- RAG engine provides historical mapping context for consistency
- Rejects semantically incorrect mappings (e.g., billing data → sales entities)
- Suitable for production data sources with high accuracy requirements
- Logs detailed rejection reasons for transparency

**Prod Mode OFF (Heuristic-Based):**
- Uses **hard-wired rules** for fast, deterministic filtering
- Domain categories: FinOps sources (snowflake, sap, netsuite, legacy_sql) map only to FinOps entities (aws_resources, cost_reports)
- RevOps sources (dynamics, salesforce, supabase, mongodb) map only to RevOps entities (account, opportunity, health, usage)
- No LLM calls = faster processing, zero API costs
- Suitable for testing and development scenarios
- Health entity now properly maps all fields: health_score, account_id, last_updated, risk_level

### UI/UX Decisions
- **Collapsible Panels**: Left Navigation, Left Data Sources, and Right Status/Narration panels are independently collapsible with smooth animations, allowing the center graph to intelligently expand.
- **Sankey Default View**: The default visualization is a Sankey diagram for clearer data flow representation, with a toggle to switch to a Graph view.
- **Smart Graph Expansion**: The central graph dynamically adjusts its width based on the state of collapsed side panels.
- **Progress Indicator**: A staged processing progress bar (Connecting, Analyzing, Mapping, Validating, Complete) is always visible at the top right sidebar, persisting with a green checkmark upon completion.
- **Layout Reorganization**: Narration is in the right sidebar, and Source/Unified Previews are in a "Notes" section below the graph.
- **5-Second Hook Modal**: A welcome modal appears on page load with the headline "Stop Building Pipelines. Let Agents Deliver the Outcome." and explains the "Insight-to-Action Gap." Features a pulsing/glowing button with full WCAG 2.1 accessibility (focus trap, Escape key dismissal, ARIA semantics, screen reader support).
- **Mobile Responsiveness**: Fully responsive design with auto-collapsing panels on screens < 1024px, reduced padding/gaps on mobile, responsive Sankey diagram heights (400px mobile, 500px tablet, 600px desktop), touch event support (touchstart, touchend), and mobile-optimized CSS (44px minimum touch targets, horizontal overflow prevention, smooth touch scrolling).
- **Real-Time Agent Visualization**: The Connect & Map button provides instant feedback, changing to "Agent Working..." with a spinning loader during processing. The Narration panel displays agent thought process with typewriter animation (20ms per character) for new events, creating a real-time visualization of the agent's work. Button auto-resets to idle state after completion (1.5s delay) or failure (2s delay).

### Technical Implementations
- **Multi-Agent Architecture**: The DCL dynamically adapts its ontology and data flows based on user-selected domain agents (e.g., RevOps Pilot, FinOps Pilot) and data sources.
- **Smart Edge Filtering**: Sankey diagrams only display edges for data that actively flows to selected agents, eliminating orphaned connections.
- **Dynamic Node Creation**: Ontology nodes only appear in visualizations if they receive actual data from sources.
- **RAG Engine**: Implemented for context-aware, learning-based schema mapping with historical memory. It uses Pinecone for embeddings and storage to retrieve similar mappings as context for LLM inference, continuously improving accuracy.
- **Schema Inference**: AI-powered schema inference allows users to create custom fields and get AI-powered ontology mappings.
- **DuckDB Views**: Mapped data is automatically published as DuckDB views for efficient access.
- **FinOps Alignment**: The system's FinOps ontology is fully aligned with the standalone FinOps Autopilot agent schema, featuring:
  - `aws_resources` - Consolidated resource configuration, utilization metrics, and cost data (matches agent's currentConfig + utilizationMetrics + monthlyCost structure)
  - `cost_reports` - Detailed cost reporting by service category, usage type, and resource (matches agent's cost_reports table)
  - All monetary values follow the agent's format: integers * 1000 (NO decimal pennies)
  - The DCL intelligently maps fields from Snowflake AWS data, Legacy SQL, NetSuite, and SAP to this unified schema

### System Design Choices
- **Backend Services**: A FastAPI server serves as the main web dashboard, handling ontology mapping, DuckDB view management, and RAG engine integration.
- **Data Flow Logic**: A heuristic planner filters mappings based on selected agents before creation, ensuring efficient and relevant data flows.
- **Autoscale Deployment Optimization**: Optimized for Autoscale deployment with efficient dependency installation (e.g., CPU-only PyTorch) and streamlined build commands.
- **Environment Variables**: `GEMINI_API_KEY`, `PINECONE_API_KEY`, and `GITHUB_TOKEN` are used for configuration and secure access.

## Authentication & Security
- **Current Status**: Authentication is **DISABLED** for ease of use
  - Set `AUTH_ENABLED = False` in `app.py` (line 20)
  - All users have full admin access to all features
  - No login/signup required - direct access to dashboard
  
- **Re-enable Instructions**: To activate authentication later:
  1. Change `AUTH_ENABLED = True` in `app.py`
  2. Set up Supabase database tables (SQL provided in Login.jsx)
  3. Configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables
  
- **Authentication Architecture** (when enabled):
  - Provider: Supabase Auth (CDN integration) for email/password
  - Authorization: Role-based access control (admin/viewer roles)
  - Protected Routes: All routes except `/login` require authentication
  - Security: Row Level Security (RLS), JWT tokens, automatic profile creation
  - Role persistence in localStorage for reliability during network issues

## External Dependencies
- **AI Provider**: Google Gemini API (`gemini-2.5-pro`) for AI-powered schema inference.
- **Vector Database**: Pinecone Inference API (for embeddings using `multilingual-e5-large`) and Pinecone Serverless (for vector storage, index "schema-mappings-e5" in `us-east-1`).
- **Database**: DuckDB for creating and managing data views.
- **Authentication**: Supabase for user authentication and role management.
- **Visualization Libraries**: Cytoscape.js for graph visualization.
- **Data Sources**: Integration with enterprise systems like Dynamics, Salesforce, SAP, NetSuite, Snowflake, Supabase, MongoDB, and Legacy SQL databases.